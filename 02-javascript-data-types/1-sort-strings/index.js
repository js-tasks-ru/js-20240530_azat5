/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  return arr.toSorted((a, b) => {
    switch (param) {
    case "asc":
      return a.localeCompare(b, "ru", { caseFirst: "upper" });
    case "desc":
      return b.localeCompare(a, "ru", { caseFirst: "upper" });
    }
  });
}
