# JacketUI Store

Store based on thinking from [compassionate components](https://www.youtube.com/watch?v=VKQAS3PNEVw&pp=ygUYY29tcGFzc2lvbmF0ZSBjb21wb25lbnRz).

## Philosophy

We want flexibility in our components and escape hatches in order to solve edge cases and make components truly expandable and reusable.

In order to achieve this we need to create flexible components, meaning expandable and full of escape hatches in order to cater for edge cases.

## Features

The Store is based on the Flux-architecture/ELM-architecture with one twist: it supports asynchronous action handlers in addition to the usual synchronous reducer functions.

**Anti-features**: Not synchronous, not pure.
**Features**: Async is first-class member, not an afterthought or delegated to another library.

This means that the store is not synchronous, meaning it does not comform to f(state, action) => state, but rather f(state, action) => [multiple states over time].

## Action handlers

An action handler is essentially the same as a reducer in e.g useReducer. It is a function that takes the existing state and an action and returns a new state.

When setting up the store, you pass an array of action handlers, please note that the order is important since earlier action handlers will impact the state passed to later action handlers.

### Synchronous action handlers

Exactly the same as a reducer. `(state, action) => state`.

JacketUI Store expects an array of action handlers, but you may choose to create one large one - perhaps reuse the reducer you already have if migrating from useReducer.

### Asynchronous action handlers

Asynchonous action handlers work similarly to sagas. `(getState, action, commit, dispatch) => void`

**getState()**: A function for getting the current state. Since the async action handler works over time, you should call this function in order to get the current state of the store whenever you want to set a new state.

**commit(newState)**: function for setting a new state in the store. Wraps store.setState.

**dispatch(action)**: the store's dispatch-function. Useful if you want to trigger e.g synchronous action handlers as a result of some API-result.

## Installation

Requires Typescript.

`npm i --save @torthu/jacketui-store`

## Usage

See [examples/example.ts](./examples/example.ts) for example usage.

If you are using React, you can use the included useStore hook instead: `const [state, dispatch, store] = useStore(actionHandlerArray, initialState);`

## Architecture

![Data Flow](docs/DataFlow.png)
