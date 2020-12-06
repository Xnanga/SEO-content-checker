"use: strict";

// Global Variables

let tKeyword;
let textCopy;
let copyArr = [];

const exampleData =
  "This is Example TeXt which is used for an example. Example one...";

// DOM Elements

let editorCopy = document.getElementById("editor").textContent;

let tKeywordLabel = document.querySelector(".keyword__input").value;
const tKeywordButton = document.querySelector(".keyword__submit");

let recommendationListParent = document.querySelector(
  ".right-side__recommendations"
);

// Functions

const controller = function (copy, tKeyword) {
  const recommendations = [];
  const pCopyArr = processCopy(copy);
  const pCopy = copy.toLowerCase();

  const instances = findKeywordInstances(pCopy, tKeyword, pCopyArr);

  recommendations.push(instances);

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

  return calculateKeywordDensity(instances, pCopyArr.length);
};

const calculateKeywordDensity = function (instances, wordcount) {
  const density = (instances / wordcount) * 100;
  console.log(density);

  if (density < 0.8 && density > 0) {
    return `
    <div class="recommendation">
    Your target keyword only appears ${instances} time(s). Consider including your target keyword naturally in the copy a few more times.
  </div>
      `;
  } else if (density > 0.8 && density < 1.2) {
    return `
    <div class="recommendation">
    Your target keyword appears ${instances} time(s). This is within an ideal range for SEO best practice!
  </div>
      `;
  } else if (density > 1.2) {
    return `
    <div class="recommendation">
    Your target keyword appears ${instances} time(s). Consider reducing the number of times your target keyword is included to avoid keyword-stuffing.
  </div>
      `;
  } else if (density === 0) {
    return `
    <div class="recommendation">
    Your target keyword does not appear anywhere in the copy. Make sure to add some instances in naturally to signal keyword-relevance.
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

// Event Listeners

tKeywordButton.addEventListener("click", function () {
  tKeywordLabel = document.querySelector(".keyword__input").value;
  editorCopy = document.getElementById("editor").textContent;

  textCopy = String(editorCopy);
  tKeyword = String(tKeywordLabel);

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