/** rgbToHex
 *
 * Convert RGB colour to HEX colour.
 *
 * @param rgb {string | string[] | number[]} e.g "255, 255, 255" or ["255", "255", "255"] or [255, 255, 255]
 * @returns string HEX string, e.g "#ffffff"
 */
export function rgbToHex(rgb: string | string[] | number[]): string {
  let r, g, b;

  if (typeof rgb === "string") {
    [r, g, b] = rgb.split(",").map((p) => parseInt(p.trim(), 10));
  } else {
    [r, g, b] = rgb.map((p) => (typeof p === "string" ? parseInt(p, 10) : p));
  }

  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
