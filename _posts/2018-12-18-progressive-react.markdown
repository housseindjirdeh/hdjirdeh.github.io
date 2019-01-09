---
layout: post
title:  "Progressive React"
date:   2019-02-03 10:00:00
description: Developer Advocates/Evangelists/Programs Engineers spend a significant amount of time reaching out to the community to explain how they can build their websites better. For those of us that focus on web performance, it can sometimes feel a bit like this...
type: post
image: assets/progressive-react/banner.png
permalink: /:title
published: false
---

<aside>
<p>Although modified to include additional information, this article is a write-up of a talk I gave at <a href="https://www.youtube.com/watch?v=zSECXuCB8wg">React Boston</a>.</p>
</aside>

Developer Advocates/Evangelists/Programs Engineers spend a significant amount of time reaching out to the community to explain how they can build their websites better. For those of us that focus on web performance, it can sometimes feel a bit like this:

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/panda-wildin.webm" type="video/webm">
  <source src="/assets/progressive-react/panda-wildin.mp4" type="video/mp4">
</video>

So for the rest of this article, we'll go through all the reasons for why you should stop using React today!

Okay, that's just a joke :). In all seriousness, this article will cover how you can continue to build the same React applications that you're currently working on, but to also consider adding a number of progressive enhancements to it. The key point here is to make sure that you build your app so that _more people can use it_.

## Introduction

So what does it really mean to build an application so that more people can use it? How do we measure that? Why should we measure that?

Let's try and answer this question by taking a look at [Create React App](https://github.com/facebook/create-react-app) (CRA), which is the easiest way to start building a React application. A brand new project from scratch has the following dependencies:

* The `react` core library that lets you build things with React components: **2.5 kB**
* The `react-dom` library to render your components to the DOM: **30.7 kB**
* Some initial code including the first component: **~ 3 kB**

The sizes here are from v16.6.3.

[WebPageTest](https://webpagetest.org) can be used to see how long it would take for a brand new CRA application to load on a Moto G4.

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/cra-motog4.webm" type="video/webm">
  <source src="/assets/progressive-react/cra-motog4.mp4" type="video/mp4">
</video>

This "Hello, World" CRA application is hosted on Firebase and is opened on Chrome with three different network connection types: 

* **4G** (9 Mbps)
* **3G** (1.6 Mbps)
* **3G Slow** (400 Kbps)

Some latency needs to be accounted here as well.

The Moto G4 phone is a low-end mobile device similar in terms of performance to what many people use in developing countries as their primary device. On 4G, the application finishes loading in 2 seconds. In 3G Slow, things are not as fast and it takes more than 4 seconds for the page to become interactive. 

As interesting as these numbers may seem, they really don't tell us much about performance if you don’t know who your users are. Your definition of slow can be completely different from somebody else's, and your perception on how fast a site loads can be skewed depending on the device you use and network connection you have. Including a desktop machine + cable connection trace in our experiment shows how drastic this can be:

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/cra-desktop-motog4.webm" type="video/webm">
  <source src="/assets/progressive-react/cra-desktop-motog4.mp4" type="video/mp4">
</video>

<aside>
<h4>Updates to React DOM 🔥</h4>
<p>In terms of how well a React app performs right out of the gate, some changes are slated for React DOM that aims to simplify a few things. The event system that is used, which accounts for a large portion of the library, contains a number of polyfills that aren't needed for many newer browsers, and the team is considering removing/simplifying them where possible. You can keep track of these efforts in the <a href="https://github.com/facebook/react/issues/13525">GitHub issue.</a></p>
</aside>

## Can we measure the current state of speed?

Not knowing who your users are or what device they use isn't the only reason why performance numbers for a brand new React application is not very useful. The numbers of a "hello world" application generally don't mean much since it doesn't really give us insight into how real React applications generally perform in the wild (with many components, libraries, utilities, and so forth).

But is there a way to track how well a majority of sites that use a specific tool (like React) generally perform? Do we even want to track this sort of information? Is it useful? 

[HTTP Archive](https://httparchive.org/) might be able to help here. It's an open-source attempt to keep track of how the web is built and it does this by crawling over a million sites every month, running them through WebPagetest, and then storing information about them such as their number of requests, their loading metrics, size of payloads, and so on.

WebPageTest recently integrated with Wappalyzer, a tool that makes it easy to detect which libraries are used on a website. By querying both sets of data, maybe we analyze this sort of information for a number of differnt JavaScript frameworks and libraries?

After querying over a 100,000 URLs that use Reac:

* Median First Paint: **~4.7s**
* Median Time to Interactive: **~20.5s**

These are WebPageTest lab runs on a Moto G4 and 3G connection.

More than 20 seconds for the JavaScript thread to settle and an application to become interactive may seem like a lot, but it's not  uncommon to see on very large sites especially with a weak device and/or connection type. However this analysis isn't entirely accurate at it's current state for a number of reasons:

* At the time of writing these queries, Wappalyzer would [detect if React is used on a site](https://github.com/AliasIO/Wappalyzer/blob/master/src/apps.json#L8120-L8130) by looking for `data-react` attributes in the DOM, global `React` variables, or script elements that inject React onto the page. Pages that are bundled with with a module bundler (like webpack, parcel or rollup) and use React 16+ can not be identified with this detection strategy.
* There are a lot of other factors involved that affect the performance of a site, such as the total amount of JavaScript that gets loaded, the number of images and other assets used on a page and so on. It's not entirely fair to measure site performance against a single horizontal (such as if React is used on a page or not) if all of these other factors aren't taken into account as well.

So there's a lot of work that needs to be done before we can accurately assess how many sites in the wild that use a particular framework is performing (and if you're interested, you can track my efforts in this [Google doc](bit.ly/state-of-perf)).

## Moar JavaScript

One thing that can be agreed on that's not specific to a particular tool or technology is the amount of JavaScript that we're shipping over the wire. The HTTP Archive already provides a handy report for this, but in short:

* Median JavaScript bytes sent in **October 15, 2011**: Mobile: 75.1 KB
* Median JavaScript bytes sent in **October 15, 2018**: Mobile: 373.0 KB

As a whole, we're building websites that ship more JavaScript than we did seven years ago, and this makes sense. Applications have become larger, more interactive and more complex. The number is still gradually increasing in an upward trend year after year. 

You may have heard this many times already, but the more JavaScript we send to the browser, the more time it needs to be uncompressed, parsed and executed. Consequently, this will slow down your site. Now granted, every application and userbase is different, so many sites that ship over 400 KB may not have a problem at all with how it performs for its users. But if you are concerned that the performance of your React site could be better for the users you are targeting, it's always a good idea to begin by profiling it.

## Profiling / Analyzing

Profiling and analyzing a React site is always a good first step before trying to optimize anything. I like to think of this is a two-fold approach:

* **Component-level performance**
* **App-level performance**

### Component-level performance

You may already have heard of React's reconciliation algorithm, or the "virtual DOM". To try and summarize in a single sentence, React takes steps to diff between a newer DOM tree and an older tree to figure out what needs to be updated in the UI when data is changed within a component. This makes things a lot less performance intensive than re-rendering the entire application with every state/prop change ([a difference between O(N<sup>3</sup>) and O(N)](https://reactjs.org/docs/reconciliation.html)).

<aside>
The <a href="https://reactjs.org/docs/faq-internals.html">React docs</a> and Andrew Clark's write-up on <a href="https://github.com/acdlite/react-fiber-architecture">Fiber</a> are useful reads if you're interested in learning more. 
</aside>

Even with these optimizations baked into React internals, we can always run into the problem of having components in our application re-rendering when they actually shouldn't. For a small application, this might not even be noticeable, but it can for a larger application.

There may be functions within a component that isn't as efficient as it could be, or maybe an entire list of components are being re-rendered when only a single component is being added onto the list. To help pinpoint where issues may be happening, there are tools out there that can help us analyze if certain component trees are taking too long to re-render.

#### Chrome DevTools Performance Panel

React uses the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) to measure how much time components take for each step of their lifecycle. You can run performance traces using Chrome DevTools to analyze how efficiently your components mount, render, and unmount during page interactions or reloads.

<img alt="DevTools Performance Panel" title="DevTools Performance Panel" data-src="/assets/progressive-react/chrome-perf-panel.png" class="lazyload shadow" />

<aside>
Ben Schwarz has an excellent tutorial that covers this in detail - <a href="https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad">Debugging React performance with React 16 and Chrome Devtools</a>.
</aside>

The User Timing API is only used during development and is disabled in production mode. A faster implementation that can even be used during production without significantly harming performance was one of the motivations behind building a newer timing API.

#### React DevTools Profiler

With `react-dom` 16.5, the Profiler panel can be used to trace how well your components are rendering in terms of performance. It does this by using a newer [`Profiler`](https://github.com/reactjs/rfcs/pull/51) API to collect timing information for every component that re-renders.

The `Profiler` panel lives as a separate tab within [React DevTools](https://github.com/facebook/react-devtools). Similar to the Performance panel in Chrome DevTools, you can record user interactions and page reloads to analyze how well your components are performing.

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/fetch-profiler.webm" type="video/webm">
  <source src="/assets/progressive-react/fetch-profiler.mp4" type="video/mp4">
</video>

When you stop recording with the Profiler, you're greeted with a flame chart that shows you how long each of the components in the page took to render.

<img alt="Profiler Flame Chart" title="Profiler Flame Chart" data-src="/assets/progressive-react/profiler-flame-chart.png" class="lazyload" />

You can switch between different _commits_, or states when DOM nodes are added, removed, or updated, to get more nuanced data of when components are taking their time while rendering. 

<img alt="Profiler Commit Chart" title="Profiler Commit Chart" data-src="/assets/progressive-react/profiler-commit-chart.png" class="lazyload" />

These screenshots are from profiling a single user interaction in a [simple app] which involves fetching a list of trending GitHub repos when a button is clicked. As you can see, there are only two commits:

* One for a loading indicator that shows when the list of items are fetched
* One after the API call is completed and the list is populated to the DOM

The right hand side shows other useful metadata including commit information or component-specific data such as props and state.

<img alt="Profiler Metadata" title="Profiler Metadata" data-src="/assets/progressive-react/profiler-metadata.png" class="lazyload" />

<aside>
Other chart views (ranked, component) are also available for you to fiddle around with. For more details on this (as well as everything else about the Profiler), the <a href="https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html">canonical blog post</a> in the React docs is a must-read. 
</aside>

To complicate things up a bit, consider the same example but with multiple API calls being fired at the same time to load specific trending repositories based on language (JavaScript, Golang, etc...). As expected, there are more commits now.

<img alt="Profiler - more commits" title="Profiler - more commits" data-src="/assets/progressive-react/profiler-more-commits.png" class="lazyload" />

The later the commit - the longer and more yellow the bar happens to be in the commit chart. This means that the time it takes for all the components to finish rendering take longer and longer as the list in the app grows.

In the flame chart itself, we can see that this happens because _every_ item component in the list re-renders with each API call completing. This helps identify an issue that can be resolved relatively quickly: we can just try to only render newly added items to the list instead of re-rendering every single item as the list grows.

There are quite a few ways to minimize/remove unecessary re-renders in a React app depending on context:

* Override [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action)

{% highlight javascript %}
shouldComponentUpdate(nextProps, nextState) {
  // return true only if a certain condition is met
}
{% endhighlight %}

* Use [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) for class components

{% highlight javascript %}
import React, { PureComponent } from 'react';

class SomeComponent extends PureComponent {

}
{% endhighlight %}

* Use [`memo`](https://reactjs.org/docs/react-api.html#reactmemo) for functional components

{% highlight javascript %}
import React, { memo } from 'react';

const SomeComponent = memo(props => {

});
{% endhighlight %}

* Memoize Redux selectors (with [reselect](https://github.com/reduxjs/reselect) for example)
* Virtualize super long lists (with [react-window](https://github.com/bvaughn/react-window) for example)

<aside>
There are two videos by Brian Vaughn that are worth watching if you would like to learn more about using the Profiler to identify bottlenecks in your application:

<ul>
  <li><a href="https://www.youtube.com/watch?v=nySib7ipZdk">Deep dive with the React DevTools profiler</a></li>
  <li><a href="https://youtu.be/ByBPyMBTzM0?t=1988">Profiling React - React Conf 2018</a></li>
</ul>
</aside>

### App-level performance

Aside from specific DOM mutations and component re-renders, there are other higher level concerns worth profiling in a React app as well. [Lighthouse](https://github.com/GoogleChrome/lighthouse), a tool built by the Google Chrome team, makes it easy to analyze and assess how a particular site performs. There are three ways to run Lighthouse tests on a webpage:

* Node CLI
* Chrome Extension
* Directly through Chrome DevTools in the `Audits` panel

[GIF]

Lighthouse usually takes a little time gathering all the data it needs from a page, auditing the data against a number of checks, and then finally generating a report with all the information. A number of audits can be used to identify if the amount of JavaScript being shipped to the browser can (and should) be improved:

* Eliminate render-blocking resources
* JavaScript boot-up time is too high
* Avoid enormous network payloads

If any of these audits fail due to large JavaScript bundles being sent over the wire, the first thing that should be considered is splitting the bundle and only trying to load what's necessary for the current page during initial load. Dynamic imports 