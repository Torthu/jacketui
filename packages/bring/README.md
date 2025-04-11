# JacketUI Bring

Bring is a fetch wrapper that provides a simple API for making HTTP requests. It supports retrying, timeouts and callbacks. And will return a Result ({ok: true, value} | {ok: false, error}) instead of throwing errors.

## Philosophy

We want flexibility in our components and escape hatches in order to solve edge cases and make components truly expandable and reusable.

In order to achieve this we need to create flexible components, meaning expandable and full of escape hatches in order to cater for edge cases.

## In practice
