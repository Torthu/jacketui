import React, { Fragment, JSX } from "react";
import { twMerge } from "tailwind-merge";

export interface BaseComponentProps<
  VariantType = unknown,
  AsType = keyof JSX.IntrinsicElements | React.ComponentType<any>
> extends Omit<React.AllHTMLAttributes<any>, "as" | "data" | "onChange"> {
  children?: React.ReactNode;
  as?: AsType;
  hidden?: boolean;
  variant?: VariantType;
  className?: string;
  prefetch?: boolean; // Next.js
  ref?: any;
}

/** BaseComponent
 *  The BaseComponent implements tw-merge and as behaviour.
 *
 * @param props.as {string | React.ComponentType} (default: 'div') What to render as
 *
 * @example
 *   <BaseComponent as={Paragraph}>Children</BaseComponent>
 * @example
 *   <BaseComponent as="p">A paragraph</BaseComponent>
 */
export function BaseComponent({
  as = "div",
  className,
  hidden,
  // Extract and pass rest to DOM
  ...rest
}: BaseComponentProps) {
  const Element = as;

  // React Fragments only support children and keys and will complain if other props are passed
  if (Element === Fragment) {
    return <Element children={rest.children} />;
  }

  return (
    <Element
      className={hidden ? "hidden" : className ? twMerge(className) : ""}
      {...rest}
    />
  );
}
