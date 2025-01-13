import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

export function InputFormat({ className = "", ...rest }: BaseComponentProps) {
  return (
    <BaseComponent
      className="text-gray-500 dark:text-gray-200 p-2 rounded-r-lg border-box border border-l-0 border-black dark:border-white dark:border-opacity-5 border-opacity-5"
      {...rest}
    />
  );
}
