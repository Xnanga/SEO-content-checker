"use: strict";

// Global Variables

let tKeyword;
let textCopy;
let copyArr = [];
let wordCount = 0;

// DOM Elements

let editorCopy = document.getElementById("editor").textContent;
let tKeywordLabel = document.querySelector(".keyword__input").value;
const tKeywordButton = document.querySelector(".keyword__submit");
let recommendationListParent = document.querySelector(
  ".right-side__recommendations"
);
let wordCountLabel = document.querySelector(".wordcount");
let keywordCountLabel = document.querySelector(".keyword-count");
const headingList = [
  ...document.querySelectorAll(".header-dropdown__list-item"),
];

// Does not appear to be pulling the highlighted text
let highlightedText = document.getSelection().toString();

// Functions

const controller = function (copy, tKeyword) {
  const recommendations = [];
  const pCopyArr = processCopy(copy);
  const pCopy = copy;

  const instances = findKeywordInstances(pCopy, tKeyword, pCopyArr);
  const wordcount = wordCountSufficient(pCopyArr);

  processFirstPara(copy);
  updateWordcount(pCopyArr);

  recommendations.push(instances, wordcount);
  updateRecommendations(recommendations);
};

const processCopy = function (copy) {
  const processedCopy = copy
    .replace(/[^A-Za-z0-9\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .toLowerCase()
    .split(" ");
  return processedCopy;
};

const findKeywordInstances = function (pCopy, tKeyword, pCopyArr) {
  let re = new RegExp(tKeyword, "g");
  const instances = (pCopy.match(re) || []).length;

  updateKeywordCount(instances);
  return calculateKeywordDensity(instances, pCopyArr.length);
};

const calculateKeywordDensity = function (instances, wordcount) {
  const density = (instances / wordcount) * 100;

  if (density < 0.8 && density > 0) {
    return `
    <div class="recommendation">
    ❌ Your target keyword density is ${density.toFixed(
      2
    )}% and only appears ${instances} time(s). Consider including your target keyword naturally in the copy a few more times.
  </div>
      `;
  } else if (density > 0.8 && density < 1.2) {
    return `
    <div class="recommendation">
    ✔️ Your target keyword density is ${density.toFixed(
      2
    )}% and appears ${instances} time(s). This is within an ideal range for SEO best practice!
  </div>
      `;
  } else if (density > 1.2) {
    return `
    <div class="recommendation">
    ❌ Your target keyword density is ${density.toFixed(
      2
    )}% and appears ${instances} time(s). Consider reducing the number of times your target keyword is included to avoid keyword-stuffing.
  </div>
      `;
  } else if (density === 0) {
    return `
    <div class="recommendation">
    ❌ Your target keyword does not appear anywhere in the copy. Make sure to add some instances in naturally to signal keyword-relevance.
  </div>
      `;
  }
};

const updateRecommendations = function (recommendations) {
  recommendationListParent.innerHTML = "";
  recommendations.forEach((recommendation) => {
    recommendationListParent.insertAdjacentHTML("beforeEnd", recommendation);
  });
};

const updateWordcount = function (copyArr) {
  wordCountLabel.textContent = `Wordcount: ${copyArr.length}`;
};

const updateKeywordCount = function (keywordCount) {
  keywordCountLabel.textContent = `Keyword Count: ${keywordCount}`;
};

const wordCountSufficient = function (wordcount) {
  if (!wordcount) {
    return `<div class="recommendation">
    ❌ No content added. Please paste in content and click the "analyse" button.
      </div>`;
  } else if (wordcount.length < 500) {
    return `<div class="recommendation">
    ❌ The length of the copy is only ${wordcount.length} words, less than the minimum recommended wordcount of 500 words.
  </div>`;
  } else if (wordcount.length >= 500) {
    return `<div class="recommendation">
    ✔️ The length of the copy is ${wordcount.length} words, above the minimum recommended wordcount of 500 words.
  </div>`;
  }
};

const processFirstPara = function (copy) {
  const firstPara = copy.split("</p>")[0];
  console.log(firstPara);
};

// Find a way to take highlighted text and apply heading to it.
const applyHeading = function (headingID) {
  console.log(headingID);
  highlightedText = document.getSelection().toString();
  console.log(highlightedText);
};

// Event Listeners

tKeywordButton.addEventListener("click", function () {
  tKeywordLabel = document.querySelector(".keyword__input").value;
  editorCopy = document.getElementById("editor").textContent;

  textCopy = String(editorCopy).toLowerCase();
  tKeyword = String(tKeywordLabel).toLowerCase();

  controller(textCopy, tKeyword);
});

editor.addEventListener("paste", function (e) {
  e.preventDefault();

  if (e.clipboardData) {
    content = (e.originalEvent || e).clipboardData.getData("text/plain");

    document.execCommand("insertText", false, content);
  } else if (window.clipboardData) {
    content = window.clipboardData.getData("Text");

    document.selection.createRange().pasteHTML(content);
  }
});

headingList.forEach(function (option) {
  option.addEventListener("click", function () {
    applyHeading(option.id);
  });
});
