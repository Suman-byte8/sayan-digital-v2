// Shortens text to at most `maxWords` words, ending on a whole word with an
// ellipsis. Used by product cards so a long description never stretches or
// breaks a card; the full text is still shown on the product page.
export function truncateWords(text, maxWords) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ").replace(/[,;:.\-–—]+$/, "")}…`;
}
