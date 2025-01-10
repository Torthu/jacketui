import React, { ComponentType, useMemo } from "react";
import { As } from "../types";

interface JuisConfig {
  base: string;
  variants: Record<string, string>;
}

/** juis
 * Helper function to create multiple variants (with different classes) of a component.
 *
 * @param component {string | React.ComponentType}
 * @param config {JuisConfig} Config object {base: "class names", variants: { someVariant: "more class names" }}
 * @return ReactComponent
 *
 * @example
 *   const Button = juis("button", {base: "btn", variants: { primary: "btn-primary", secondary: "btn-secondary" }});
 *   <Button variant="primary">Primary button with class="btn btn-primary"</Button>
 */
export default function juis(component: As, variantConfig: JuisConfig) {
  const Element = component;

  const { base = "", variants = {} } = variantConfig;
  variants.default = variants.default ?? "";

  const StyledComponent = ({ variant, ...rest }: any) => {
    const classNames = useMemo(() => {
      let variantToUse = variant;
      if (!variants[variant]) {
        console.warn(
          `Variant "${variant}" does not exist. Falling back to default variant.`
        );
        variantToUse = "default";
      }
      return base + " " + variants[variantToUse];
    }, [variant]);

    return <Element className={classNames} {...rest} />;
  };

  return StyledComponent;
}
