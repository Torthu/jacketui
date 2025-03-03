# JacketUI Broadcast

Pub-sub based on thinking from [compassionate components](https://www.youtube.com/watch?v=VKQAS3PNEVw&pp=ygUYY29tcGFzc2lvbmF0ZSBjb21wb25lbnRz).

## Philosophy

We want flexibility in our components and escape hatches in order to solve edge cases and make components truly expandable and reusable.

In order to achieve this we need to create flexible components, meaning expandable and full of escape hatches in order to cater for edge cases.

## Usage

const broadcast = new Broadcast();

broadcast.on("eventName", console.log);
broadcast.emit("eventName", "Hello World");
broadcast.off("eventName", console.log);
