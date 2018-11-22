---
layout: post
title:  "Progressive React"
date:   2018-11-06 10:00:00
description: In Part 1 of this series, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. Some of these enhancements included adding a service worker to allow for faster repeat visits and improved reliability for poor network connections. Instead of using a third-party library, we'll explore how to add service worker functionality using a built-in Angular package, `@angular/service-worker`, in this article.
type: post
image: assets/progressive-react/banner.png
permalink: /:title
---

<aside>
<p>Although modified to include additional information, this article is a write-up of a talk I gave at <a href="https://www.youtube.com/watch?v=zSECXuCB8wg">React Boston</a>.</p>
</aside>

Developer Advocates/Evangelists/Programs Engineers spend a significant amount of time reaching out to the community to explain how they can build their websites better. For those of us that focus on web performance, it can sometimes feel a bit like this:

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/panda-wildin.webm" type="video/webm">
  <source src="/assets/progressive-react/panda-wildin.mp4" type="video/mp4">
</video>

So for the rest of this article, we'll be covering all the reasons why you should stop using React today!

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

One thing that can be agreed on that's not specific to a particular tool or technology is the amount of JavaScript that we're shipping over the wire. The HTTP Archive already provides a handy report and chart for this, but in short:

* Median JavaScript bytes sent in **October 15, 2011**
  * Desktop: 123.6 KB
  * Mobile: 75.1 KB
* Median JavaScript bytes sent in **October 15, 2018**
  * Desktop: 420.1 KB
  * Mobile: 373.0 KB

As a whole, we're building websites that ship more JavaScript than we did seven years ago, and the number is gradually increasing in an upward trend year after year. The more JavaScript we send to the browser, the more time it needs to be uncompressed, parsed and executed which can affect the performance of your site. Now granted, every application is different and every userbase is different, so many sites that ship over 400 KB may not have a problem in the slightest in terms of how well their site is performing. But if you are concerned that the performance of your React site could be better for the users you are targeting, it's always a good idea to begin by profiling it.

## Profiling / Analyzing

Profiling and analyzing your React site is always a good first step before attempting to try and optimize things prematurely. I like to think of this is a two-fold approach:

* **Component-level performance**
* **App-level performance**

### Component-level performance

You may have heard of React's reconciliation algorithm, or the "virtual DOM". To summarize in a single sentence - React takes steps to diff between a newer DOM tree and an older tree to figure out what needs to be updated in the UI when data is changed within a component. This makes things a lot less performance intensive than re-rendering the entire application with every state/prop change ([a difference between O(N<sup>3</sup>) and O(N)](https://reactjs.org/docs/reconciliation.html)).

<aside>
The <a href="https://reactjs.org/docs/faq-internals.html">React docs</a> and Andrew Clark's write-up on <a href="https://github.com/acdlite/react-fiber-architecture">Fiber</a> are useful reads if you're interested in learning more. 
</aside>

Even with these optimizations baked into React internals, we can always run into the problem of having components in our application re-rendering when they actually shouldn't. For a small application, this might hardly even be noticeable, but it can for a larger application where 100+ components are unecessarily re-rendering after a certain user interaction.

There may be functions within a component that isn't as efficient as it could be, or maybe an entire list of components are being re-rendered when only a single component is being added onto the list. To help pinpoint where issues may be happening, there are tools out there that can help us analyze if certain component trees are taking too long to re-render.

#### Chrome DevTools Performance Panel

React uses the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) to measure how much time components take for each step of their lifecycle. This allows us to run performance traces on our application using Chrome DevTools to analyze how efficiently components mount, rende, and unmount during page interactions or reloads.

<aside>
Ben Schwarz has written an excellent tutorial, <a href="https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad">Debugging React performance with React 16 and Chrome Devtools</a>, that covers this in detail.
</aside>

#### React DevTools Profiler

### App-level performance