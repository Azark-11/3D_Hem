/**
 * Format an integer öre value to Swedish price string.
 * 24900 → "249 kr"
 * 24950 → "249,50 kr"
 */
export function formatSek(ore: number): string {
  const kr = ore / 100;
  if (kr % 1 === 0) {
    return `${kr.toFixed(0)} kr`;
  }
  return `${kr.toFixed(2).replace(".", ",")} kr`;
}
