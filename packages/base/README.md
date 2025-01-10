# JacketUI Base

Utilities for creating React component systems based on thoughts from [compassionate components](https://www.youtube.com/watch?v=VKQAS3PNEVw&pp=ygUYY29tcGFzc2lvbmF0ZSBjb21wb25lbnRz).

## Philosophy

We want flexibility in our components and escape hatches in order to solve edge cases and make components truly expandable and reusable.

In order to achieve this we need to create flexible components, meaning expandable and full of escape hatches in order to cater for edge cases.

## In practice

**tailwind-merge**: Is used to enable overwriting Tailwind classes. This lets us restyle components on the fly through className
**...rest**: Passes all arguments to the used element. This lets us avoid cases where we've forgotten to define certain DOM attributes in our react props.
**as=""**: Tell components to render as anything. Can be JSX.IntrinsicElements such as "div" or "button" or other React components. Explicitly set limitations in your types instead of implicitly defining them.

## juis: JacketUI Styled Components

A simple util for creating components based on other components. Does not rely on BaseComponent and can thus be used in any React setup.

```
const Button = juis("button", {base: "btn", variants: { primary: "btn-primary", secondary: "btn-secondary" }});
```

```
<Button variant="primary">Primary button with class="btn btn-primary"</Button>
```
