// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT
const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";
window.addEventListener("load", addBookMarkButton);

function addBookMarkButton() {
  const bookMarkButton = document.createElement("img");
  bookMarkButton.id = "add-bookmark-btn";
  bookMarkButton.src = bookmarkURL;
  bookMarkButton.style.height = "20px";
  bookMarkButton.style.width = "20px";

  const questionTitle = document.getElementsByClassName(
    "coding_problem_info_heading__G9ueL fw-bolder rubik fs-4 mb-0"
  )[0];

  questionTitle.insertAdjacentElement("afterend", bookMarkButton);

  bookMarkButton.addEventListener("click", addbookmark);
}
async function addbookmark() {
  try {
    const currBookmarks = await getAllBookmarks();
    const problemURL = window.location.href;
    const uniqueId = extractProblemId(problemURL);

    const titleElement = document.getElementsByClassName(
      "coding_problem_info_heading__G9ueL fw-bolder rubik fs-4 mb-0"
    )[0];

    const problemName = titleElement
      ? titleElement.innerText
      : "Untitled Problem";

    if (currBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

    const newBookmark = {
      id: uniqueId,
      name: problemName,
      url: problemURL,
    };

    const updatedBookmarks = [...currBookmarks, newBookmark];

    chrome.storage.sync.set(
      {
        AZ_PROBLEM_KEY: updatedBookmarks,
      },
      () => {
        console.log("Bookmarks updated with:", updatedBookmarks);
      }
    );
  } catch (err) {
    console.error("Bookmark error:", err);
  }
}

function getAllBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([AZ_PROBLEM_KEY], function (result) {
      if (chrome.runtime.lastError) {
        console.error("Storage error:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[AZ_PROBLEM_KEY] || []);
      }
    });
  });
}

function extractProblemId(url) {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split("/");
  const problemsIndex = pathParts.indexOf("problems");
  return problemsIndex !== -1 && problemsIndex + 1 < pathParts.length
    ? pathParts[problemsIndex + 1]
    : null;
}
