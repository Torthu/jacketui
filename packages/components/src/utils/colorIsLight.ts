/** colorIsLight
 * Estimates if a passed rgb is light (true) or dark (false)
 *
 * @param rgb {string} RGB string
 * @returns boolean
 */
export const colorIsLight = (rgb: string): boolean => {
  const [r, g, b] = rgb.split(",").map((c) => parseInt(c, 10));
  return 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b) > 16256;
};
