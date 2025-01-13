/** hexToRgb
 *
 * @param hex {string} HEX, e.g #AABBCC
 * @returns {number[]} [r, g, b]
 */
export function hexToRgb(hex: string): number[] {
  const base16Int = parseInt(hex.substring(1), 16);
  const r = (base16Int >> 16) & 255;
  const g = (base16Int >> 8) & 255;
  const b = base16Int & 255;

  return [r, g, b];
}
