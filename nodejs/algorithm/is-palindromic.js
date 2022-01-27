const { strictEqual } = require("assert");

/**
 * @param {string} str
 * @returns {boolean}
 */
function isPalindromic(str) {
  let isPalindromic = true;
  let leftIndex = 0;
  let rightIndex = str.length - 1;
  while (rightIndex >= leftIndex) {
    if (str[leftIndex] !== str[rightIndex]) {
      isPalindromic = false;
      break;
    }

    leftIndex++;
    rightIndex--;
  }

  return isPalindromic;
}

strictEqual(isPalindromic(""), true);
strictEqual(isPalindromic("aaa"), true);
strictEqual(isPalindromic("aba"), true);
strictEqual(isPalindromic("abb"), false);
strictEqual(isPalindromic("abba"), true);
