/** AtLeast<interface, "propA" | "propB">
 * 
 *  Checks that the structure passed has at least the named props from an interface.
 *  Useful for cases where you have a Partial, but with some requirements.
 */
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;