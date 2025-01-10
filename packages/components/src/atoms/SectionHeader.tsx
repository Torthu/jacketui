import React from "react";
import { FlexRow, H2 } from ".";

/** SectionHeader
 *  ---- Header with lines on left and right ---------------
 * Meant to be used together with <Section> or similar blocks.
 *
 * Currently not follwing the variant-pattern, but does accept as (default as="h2").
 *
 * @example
 *  <SectionHeader as="h2">My header</SectionHeader>
 *
 * @todo Refactor and find pattern for class configuration of both the outer and inner parts.
 */
export function SectionHeader({
  children,
  className = "",
  as = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const innerClassNames =
    "w-full text-gray-600 dark:text-white items-center gap-4 print:hidden";
  return (
    <>
      <FlexRow className={`${innerClassNames} ${className}`}>
        <div className="w-6 border-b border-gray-400 dark:border-gray-500 print:border-gray-900"></div>
        <H2 className="" as={as}>
          {children}
        </H2>
        <div className="grow w-6 border-b border-gray-400 dark:border-gray-500 print:border-gray-900"></div>
      </FlexRow>
      <H2 className="hidden print:block">{children}</H2>
    </>
  );
}
