/**
 * Check if path has any parameters.
 *
 * @param path
 * @returns RegExpMatchArray | null
 */
export const hasParameter = (path: string) => path.match(/:\w+/);
