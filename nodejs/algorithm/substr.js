const { deepStrictEqual } = require("assert");

/**
 * @param {string} str
 * @returns {string[]} sub strings list
 */
function substr(str) {
  const subStrings = new Set([str, ""]);
  let subStringLength = str.length - 1;
  while (subStringLength > 0) {
    for (let i = 0; i <= str.length - subStringLength; i++) {
      subStrings.add(str.slice(i, i + subStringLength));
    }
    subStringLength--;
  }

  return subStrings;
}

deepStrictEqual(substr("abc"), new Set(["abc", "ab", "bc", "a", "b", "c", ""]));
deepStrictEqual(substr("aaa"), new Set(["aaa", "aa", "a", ""]));
deepStrictEqual(substr(""), new Set([""]));
