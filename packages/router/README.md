# JacketUI Router

Router based on thinking from [compassionate components](https://www.youtube.com/watch?v=VKQAS3PNEVw&pp=ygUYY29tcGFzc2lvbmF0ZSBjb21wb25lbnRz).

## Philosophy

We want flexibility in our components and escape hatches in order to solve edge cases and make components truly expandable and reusable.

In order to achieve this we need to create flexible components, meaning expandable and full of escape hatches in order to cater for edge cases.

## Route paths

- Static (/foo, /foo/bar)
- Parameter (/:title, /books/:title, /books/:genre/:title)
- Parameter w/ Suffix (/movies/:title.mp4, /movies/:title.(mp4|mov))
- Optional Parameters (/:title?, /books/:title?, /books/:genre/:title?)
- Wildcards (\*, /books/\*, /books/:genre/\*)
- Optional Wildcard (/books/\*?)

## Example

```
<Router>
    <Route path="/" as={Component} />
</Router>
```
