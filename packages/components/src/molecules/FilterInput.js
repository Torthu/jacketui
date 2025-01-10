import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BaseComponent } from "@thune/jacketui-base";
import { FlexRow } from "../atoms";
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
export function FilterInput({ filter, onChange, onReset, inputTitle = "", inputPlaceholder = "", resetTitle = "", className = "", skeleton = false, as = FlexRow, ...rest }) {
    const innerClassNames = "rounded-full bg-gray-400 text-white";
    if (skeleton) {
        return (_jsx(BaseComponent, { as: as, className: `h-10 ${innerClassNames} ${className}` }));
    }
    return (_jsxs(BaseComponent, { className: `${innerClassNames} ${className}`, as: as, ...rest, children: [_jsx("input", { className: `flex grow bg-white border border-gray-400 p-2 pl-4 ${filter !== "" ? "" : ""} rounded-full outline-none hover:bg-gray-300 hover:placeholder-gray-800 focus:bg-white focus:text-black`, value: filter, onChange: (e) => onChange(e.target.value), onKeyDown: (e) => (e.key === "Escape" ? onReset() : null), title: inputTitle, placeholder: inputPlaceholder }), filter !== "" && (_jsx("button", { className: "bold m-2 h-6 w-6 rounded-full bg-gray-400 p-1 text-white hover:bg-gray-300 hover:text-black focus:bg-gray-200 focus:text-black active:bg-gray-300 active:text-black", onClick: onReset, title: resetTitle, children: _jsx(XMarkIcon, {}) }))] }));
}