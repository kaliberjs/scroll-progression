# `@kaliber/scroll-progression`
Track the scroll progression between two points within an scroll parent as a normalized number between 0 and 1. 

## Motivation
Animating things in reaction to scroll should be easy, also if you don't want to use GSAP's ScrollTrigger library. This library tracks you scroll progression and calls you back with a value between 0 and 1. This is perfect for animation, since you can apply easing functions to it and use linear interpolation (`lerp`) to map it to any output domain that you like. Total freedom!

## Contents
- [Installation](#installation)
- [Usage](#usage)
  - [The scroll parent](#the-scroll-parent)
  - [Scroll triggers](#scroll-triggers)
  - [Examples](#examples)
    - [Parallax scrolling](#parallax-scrolling)
    - [Playing video/animation on scroll](#playing-videoanimation-on-scroll)
    - [Scroll reveals](#scroll-reveals)
    - [Custom triggers](#custom-triggers)
  - [Usage with React](#usage-with-react)
  - [Usage with `react-spring`](#usage-with-react-spring)
- [Examples](#examples)
- [Tips & Gotcha's](#tips--gotchas)
  - [Do NOT use `vh` units in your page](#do-not-use-vh-units-in-your-page)
  - [Optimize performance with css `contain`](#optimize-performance-with-css-contain)
  - [Transforms](#transforms)
  - [Track horizontal scrolling](#track-horizontal-scrolling)

## Installation

```
yarn add @kaliber/scroll-progression
```

#### Transpilation

When working with `@kaliber/build`, add `/@kaliber\/scroll-progression/` to your `compileWithBabel` array. 

#### Polyfills

- `ResizeObserver`

---

## Usage

This library tracks to progression of a given element between two points within its [scroll parent](#the-scroll-parent). These two points are called [scroll triggers](#scroll-triggers). 

### The scroll parent
The scroll parent of an element is found by finding the closest parent that has an `overflow` or `overflow-y` value of `auto` or `scroll`.

### Scroll triggers

All the functions defined in `@kaliber/scroll-progression/triggers` return an object consistsing of an `anchor` and (optionally) an `offset`. The anchor is a relative value based on the scroll parent's height. `0` means the top of the scroll parent, `1` means the bottom. If you need to increase or decrease with an amount of pixels, you can use the `offset` property for this. 

For instance: a scroll trigger describing the point 100 pixels below the top of an element is described as follows:

```js
{ anchor: 0, offset: 100 }
```

To ease the use of this library, a set of constants is exported which describe the most common scroll triggers:

| Function  |   |
|---|---|
| top  | `(offset = 0) => ({ anchor: 0, offset })`  |
| center  | `(offset = 0) => ({ anchor: 0.5, offset: 0 })`  |
| bottom  | `(offset = 0) => ({ anchor: 1, offset: 0 })`  |
| fraction  | `(anchor, offset = 0) => ({ anchor, offset })`  |

Below are some examples to help you get a feeling for this. To view some examples in a practical setting, check the [`/example`](https://github.dev/kaliberjs/scroll-progression) folder!

### Examples

To build a bit of intuition of how to setup animated scroll progression, some examples:

1. [Parallax scrolling](#parallax-scrolling)
2. [Playing video/animation on scroll](#playing-videoanimation-on-scroll)
3. [Scroll reveals](#scroll-reveals)
4. [Custom triggers](#custom-triggers)

#### Parallax scrolling
When parallax scrolling you want to animate whenever the element is visible, also when only just a fraction has entered/left the scroll parent. Specifically:

- Start when the __top of the element__ reaches the __bottom of the scroll parent__
- End when the __bottom of the element__ reaches the __top of the scroll parent__

```js
import { onScrollProgression, constants as c } from '@kaliber/scroll-progression'

const cleanup = onScrollProgression({
  element: component,
  start: { element: c.top, scrollParent: c.bottom },
  end: { element: c.bottom, scrollParent: c.top },
  onChange(progression) { 
    /* setTranslateY(lerp({ start: -10%, end: 10%, input: progression })) */ 
  }
})
```

#### Playing video/animation on scroll
When controlling a video or animation, you want the user to be able to view the whole video/animation. Therefore you start tracking when the element is scrolled fully into view. You finishing tracking when the element reaches the top of the screen, but is still fully visible.

- Start when the __bottom of the element__ reaches the __bottom of the scroll parent__
- End when the __top of the element__ reaches the __top of the scroll parent__

```js
import { onScrollProgression, constants as c } from '@kaliber/scroll-progression'

const { ref } = onScrollProgression({
  element: component,
  start: { element: c.bottom, scrollParent: c.bottom },
  end: { element: c.top, scrollParent: c.top },
  onChange(progression) {
    /* updateVideoProgress(progression) */ 
  }
})
```

#### Scroll reveals
Animations start when the elements become visible, scrolling them into view. They are finished when they are still visible within the scroll parent. Specifically:

- Start when the __top of the element__ reaches the __bottom of the scroll parent__
- End when the __top of the element__ reaches __200 pixels above the bottom of the scroll parent__

```js
import { onScrollProgression, constants as c } from '@kaliber/scroll-progression'

onScrollProgression({
  element: component,
  start: { element: c.bottom, scrollParent: c.bottom },
  end: { element: c.top, scrollParent: { anchor: 1, offset: -200 } },
  onChange(progression) { 
    /* setOpacity(progression) */ 
  }
})
```

#### Custom triggers
If the predefined triggers aren't exactly what you need, you can define your own. Consider the following case:

- Start when the *top of the element* reaches the *bottom of the scroll parent*
- End when the *top of the element* reaches the point *200 pixels above 75% of the scroll parent, measured from the top of the scroll parent*

```js
import { onScrollProgression, constants as c } from '@kaliber/scroll-progression'

const { ref } = onScrollProgression({
  element: component,
  start: { element: c.bottom, scrollParent: c.bottom },
  end: { element: c.top, scrollParent: { anchor: 0.75, offset: -200 } },
  onChange(progression) { 
    /* setOpacity(progression) */ 
  }
})
```

### Usage with React

```js
import { useScrollProgression, constants as c } from '@kaliber/scroll-progression'

const trackedElementRef = useScrollProgression({
  start: { element: c.top, scrollParent: c.bottom },
  end: { element: c.bottom, scrollParent: c.top },
  onChange(progression) { /* Do something */ }
})
```

### Usage with `react-spring`

If you always use `useScrollProgression` together with `react-spring` it might reduce noise if you implement the following custom hook:

```js
function useAnimatedScrollProgression({ start, end, getSpringProps }) {
  const [spring, springApi] = useSpring(() => ({ 
    ...getSpringProps(0), 
    config: { tension: 500, friction: 35 } 
  }))

  const { ref } = useAnimatedScrollProgression({
    start,
    end,
    onChange(input) {
      spring.start(getSpringProps(input)) })
    }
  })

  return { ref, spring }
}
```

Usage:

```js
const { ref, spring } = useAnimatedScrollProgression({
  start: { element: c.top, scrollParent: c.bottom },
  end: { element: c.top, scrollParent: c.center },
  getSpringProps: x => ({
    opacity: x,
    scale: lerp({ start: 0.5, end: 1, input: easeOut(x) })
  })
})
```

---

## Tips & Gotcha's

### Do NOT use `vh` units in your page

This might be a hard one, but when using scroll-based animations, you should really avoid using `vh` units. These re-layout your whole page when resizing leading to noticable jag on mobile. On mobile this resizing is triggered often (when your navigation bar(s) show or hide) which is why this is an issue.

The introduction of [large and small viewport units](https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/) will resolve this issue.

### Optimize performance with css `contain`

If you have a large page with animated components, you might start to notice some performance issues. If this is the case, you can mark you animated components with `contain: layout paint style;`. This allows the browser to make certain [optimizations](https://developer.mozilla.org/en-US/docs/Web/CSS/contain) during recalculation. Leave out properties which cause issues, for instance `paint` if you component overflows it's bounding box. 

__🚨 Gotcha:__ *If you put `contain: layout;` on an element, don't but the `ref` returned by `useScrollProgression` on the same element.*

### Transforms
This library uses `getBoundingClientRect()` to determine to position of objects on the screen. If you translate objects (or parents of objects) you're tracking within an scroll parent, **transforms are taken into account** when calculating the position of the tracked element. This is probably what you want, but can be unexpected if you assumed `offsetTop` was used.

### Track horizontal scrolling
Currently this library doesn't support horizontal scroll tracking. If this is something you need, please file an issue.

---

![](https://media.giphy.com/media/xvqIOHfQvth5NeoT0Y/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. It does not import React, but expects it to be provided, which [@kaliber/build](https://kaliberjs.github.io/build/) can handle for you.

This library is not transpiled.
