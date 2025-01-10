import { BaseComponentProps } from "@thune/jacketui-base";
interface FilterInputProps extends BaseComponentProps {
    filter: string;
    onChange: (filter: string) => void;
    onReset: () => void;
    inputTitle?: string;
    inputPlaceholder?: string;
    resetTitle?: string;
    skeleton?: boolean;
}
/** FilterInput
 * Simple search-like box for filters.
 * State should be handled outside the component.
 *
 * @param {(filter: string) => void} onChange Function for handling filter change
 * @param {() => void} onReset Function for resetting the filter
 * @param {string} filter The current filter
 * @param {boolean} skeleton (optional) Whether to return a skeleton variant
 * @param {string} inputTitle (optional) Title of input field
 * @param {string} inputPlaceholder (optional) Placeholder of input field
 * @param {string} resetTitle (optional) Title of reset button
 * @returns ReactNode
 *
 * @example
 *   const WrapperComponent = () => {
 *     const [filter, setFilter] = useState("");
 *     const resetFilter = () => setFilter("");
 *
 *     return <FilterInput filter={filter} onChange={setFilter} onReset={resetFilter} />
 *   }
 */
export declare function FilterInput({ filter, onChange, onReset, inputTitle, inputPlaceholder, resetTitle, className, skeleton, as, ...rest }: FilterInputProps): import("react/jsx-runtime").JSX.Element;
export {};
