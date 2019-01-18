---
layout: post
title:  "Progressive React"
date:   2019-01-03 10:00:00
description: Developer Advocates/Evangelists/Programs Engineers spend a significant amount of time reaching out to the community to explain how they can build their websites better. For those of us that focus on web performance, it can sometimes feel a bit like this...
type: post
image: assets/progressive-react/banner.png
permalink: /:title
---

<aside>
<p>Although modified to include additional information, this article is a write-up of a talk I gave at <a href="https://www.youtube.com/watch?v=zSECXuCB8wg">React Boston</a>.</p>
</aside>

<aside class="secondary">
<p><strong>tl.dr:</strong>aidad</p>
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

## Can we measure the current state of performance of React?

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

## Component-level performance

You may already have heard of React's reconciliation algorithm, or the "virtual DOM". To try and summarize in a single sentence, React takes steps to diff between a newer DOM tree and an older tree to figure out what needs to be updated in the UI when data is changed within a component. This makes things a lot less performance intensive than re-rendering the entire application with every state/prop change ([a difference between O(N<sup>3</sup>) and O(N)](https://reactjs.org/docs/reconciliation.html)).

<aside>
The <a href="https://reactjs.org/docs/faq-internals.html">React docs</a> and Andrew Clark's write-up on <a href="https://github.com/acdlite/react-fiber-architecture">Fiber</a> are useful reads if you're interested in learning more. 
</aside>

Even with these optimizations baked into React internals, we can always run into the problem of having components in our application re-rendering when they actually shouldn't. For a small application, this might not even be noticeable, but it can for a larger application.

There may be functions within a component that isn't as efficient as it could be, or maybe an entire list of components are being re-rendered when only a single component is being added onto the list. To help pinpoint where issues may be happening, there are tools out there that can help us analyze if certain component trees are taking too long to re-render.

### Profile your app using the Chrome DevTools Performance Panel

React uses the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) to measure how much time components take for each step of their lifecycle. You can run performance traces using Chrome DevTools to analyze how efficiently your components mount, render, and unmount during page interactions or reloads.

<img alt="DevTools Performance Panel" title="DevTools Performance Panel" data-src="/assets/progressive-react/chrome-perf-panel.png" class="lazyload shadow" />

<aside>
Ben Schwarz has an excellent tutorial that covers this in detail - <a href="https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad">Debugging React performance with React 16 and Chrome Devtools</a>.
</aside>

The User Timing API is only used during development and is disabled in production mode. A faster implementation that can even be used during production without significantly harming performance was one of the motivations behind building a newer timing API.

### Analyze your app using the React DevTools Profiler

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

### Minimize unecessary re-renders

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

class AvatarComponent extends PureComponent {

}
{% endhighlight %}

* Use [`memo`](https://reactjs.org/docs/react-api.html#reactmemo) for functional components

{% highlight javascript %}
import React, { memo } from 'react';

const AvatarComponent = memo(props => {

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

## App-level performance

Aside from specific DOM mutations and component re-renders, there are other higher level concerns worth profiling in a React app as well. [Lighthouse](https://github.com/GoogleChrome/lighthouse), a tool built by the Google Chrome team, makes it easy to analyze and assess how a particular site performs. There are three ways to run Lighthouse tests on a webpage:

* Node CLI
* Chrome Extension
* Directly through Chrome DevTools in the `Audits` panel

<img alt="Lighthouse in the audits panel" title="Lighthouse in the audits panel" data-src="/assets/progressive-react/lighthouse-audits-panel.png" class="lazyload shadow" />

Lighthouse usually takes a little time gathering all the data it needs from a page, auditing the data against a number of checks, and then finally generating a report with all the information. A number of audits can be used to identify if the amount of JavaScript being shipped to the browser can (and should) be improved:

* Eliminate render-blocking resources
* JavaScript boot-up time is too high
* Avoid enormous network payloads

If any of these audits fail due to large JavaScript bundles being sent over the wire, splitting your bundle should be the very first thing that you consider doing. There's no reason to load more code than necessary if there is a way to incrementally load different chunks as the user moves their way around the site.

### Split your code

The easiest way to start code-splitting is to use **dynamic imports**.

<pre>
  <code class="language-javascript hljs" data-lang="javascript">
  <strong>import('lodash.sortby')</strong>
    .then(module => module.default)
    .then(module => doSomethingCool(module))
  </code>
</pre>

The import syntax may look like a function call but it allows you to import any module asynchronously where a promise gets returned. In here, the `sortby` method from `lodash` is imported where then `doSomethingCool` is fired with that specific module. Here's an example of how this work on a site:

<img alt="Dynamic import example" title="Dynamic import example" data-src="/assets/progressive-react/magic-sorter.gif" class="lazyload shadow" />

User clicks a button to sort three numbers --> `lodash.sortby` is imported --> `doSomethingCool` method is fired which sorts the numbers and displays it in a new DOM node. Now this is a super contrived example, because if you really needed to do this in your application you would probably just use `Array.prototype.sort()`. However, it hopefully demonstrates why using dynamic imports on _specific user actions_ can be useful.

Dynamic imports are a relatively new syntax and are currently in [stage 3](https://github.com/tc39/proposal-dynamic-import) of the TC39 process. The syntax is already supported in [Chrome and Safari](https://caniuse.com/#search=dynamic%20import) as well as module bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/#dynamic-imports), [Rollup](https://rollupjs.org/guide/en#code-splitting) and [Parcel](https://parceljs.org/code_splitting.html).

In the context of React, dynamic import abstractions have been built to make the process of splitting on the component-level easier. `React.lazy` can be used to dynamically import a component:

{% highlight javascript %}
import React, { lazy } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
{% endhighlight %}

One of the main concerns of loading different parts of an application asynchronously is handling the delay that a user may experience. The `Suspense` component can be used for this to "suspend" a certain component tree from rendering. By using it alongside `React.lazy`, a loading indicator can be shown as a fallback while the component is still being fetched:

{% highlight javascript %}
import React, { lazy, Suspense } from 'react';
import LoadingComponent from './LoadingComponent';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const PageComponent = () => (
  <Suspense fallback={LoadingComponent}>
    <SomeComponent />
  </Suspense>
)
{% endhighlight %}

[SHOW DEMO]

Suspense does not yet work if your views are rendered on the server. If you would like to code-split components in a server-side rendered app, use a different library like `loadable-components`.

{% highlight javascript %}
import React from 'react';
import loadable from '@loadable/component'
import LoadingComponent from './LoadingComponent';

const AvatarComponent = 
  loadable(() => import('./AvatarComponent'), {
    LoadingComponent: () => LoadingComponent
  });
{% endhighlight %}

Notice how loading components can also be used here as indicators while the main component is still being fetched. 

<aside>
<p>There are a <a href="https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/">few things</a> you'll need to set up in order to make <code>loadable-components</code> work with SSR.</p>
</aside>

<aside>
<h4>Where should you begin code splitting?</h4>
<p>The easiest way to start splitting your bundle is to begin at the <strong>route-level</strong>. The React <a href="https://reactjs.org/docs/code-splitting.html#route-based-code-splitting">docs</a> explain how this can work using React Router.</p>
</aside>

Another handy library that provides a wrapper around `loadable-components` and Intersection Observer is [`react-loadable-visibility`](https://github.com/stratiformltd/react-loadable-visibility). You can use it to load components as they become visible within the device viewport when the user scrolls the page.

{% highlight javascript %}
import React from 'react';
import loadableVisibility from 'react-loadable-visibility/loadable-components'

const AvatarComponent = loadableVisibility(() => import('./my-component'), {
  LoadingComponent: Loading,
})
{% endhighlight %}

Although these tools make the process of easier for everyone, frameworks like [Next.js](https://nextjs.org/) take this a step further by taking it out of the hands of the developer by **automatically** code splitting where possible.

### Cache things worth caching

A service worker is a web worker that runs in the background of your browser when you view a webpage. The idea behind service workers is to include specific functionality off the main thread that can improve the user experience. This includes caching files that are important so that when your users make a repeat visit, the browser can make a request to the service worker instead of all the way to the server resulting in improved loading speeds.

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/service-worker-vid.webm" type="video/webm">
  <source src="/assets/progressive-react/service-worker-vid.mp4" type="video/mp4">
</video>

[Workbox](https://developers.google.com/web/tools/workbox/) is a set of libraries built by the Google Chrome team that can make it easier to include service workers into an application without actually building one from scratch. With Create React App 2.0, you only need to remove 2 characters in `src/index.js` to have a workbox-powered service worker up and running with basic caching functionality.

<pre>
  <code class="language-javascript hljs" data-lang="javascript">
  import React from 'react';
  
  //...

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.<strong><s>un</s></strong>register();
  </code>
</pre>

<aside>
For a more detailed breakdown of service workers and the Workbox library, refer to my <a href="https://houssein.me/thinking-prpl#service-workers">previous article</a>.
</aside>

### Streaming SSR

The basic idea of server-side rendering for an rendered on the client-side with JavaScript involves shipping an HTML document from the server that the client would eventually produce. This allows us to display content to the user much sooner than them waiting for the JS bundle to finish executing.

To make sure this works well, you need to make sure that the browser re-uses the server-rendered DOM instead of re-creating the markup ([`hydrate()`](https://reactjs.org/docs/react-dom.html#hydrate)). This makes things _seem_ like a page has loaded faster, but it can delay time-to-interactive significantly.

With React 16, you can take advantage of streaming while server-side rendering your views. Instead of using `renderToString` to return an HTML string, you can use `renderToNodeStream` to return a Node `Readable` stream of bytes. Streaming from a server allows a client to receive and hydrate different parts of the HTML document instead of all at once. Although SSR should always improve First Paint times in your application, this would reduce that number even further. 

<aside>
If you're using React to build a static site, use <a href="https://reactjs.org/docs/react-dom-server.html#rendertostaticnodestream"><code>renderToStaticNodeStream</code></a> instead to shave a few bytes off.
</aside>

### Can't SSR? Pre-render instead

There are many different ways servers can ship some, instead of all, the static content needed for a specific URL and how a client can hydrate it.

### Extract critical CSS-in-JS styles

Many developers in the React community use CSS-in-JS libraries like [emotion](https://emotion.sh/) and [styled-components](https://www.styled-components.com/) for a multitude of reasons (component-scoped styles, automatically generated selectors adjusted properties based on props, etc...). If you're not entirely careful however, you can run into the issue of having all the styles being computed at runtime. This means that the styles only get applied when the JavaScript bundle finishes executing which can affect performance and trigger a flash of unstyled content. Like most performance concerns, this gets exemplified if your user happens to have a weaker mobile device and/or poorer network connection.

<img alt="Flash of unstyled content" title="Flash of unstyled content" data-src="/assets/progressive-react/runtime-cost-styled.png" class="lazyload shadow" />

If you've already incorporated some sort of server-side rendering into your application, you can fix this by extracting critical styles. Both [`emotion`](https://emotion.sh/docs/ssr) and [`styled-components`](https://medium.com/styled-components/v3-1-0-such-perf-wow-many-streams-c45c434dbd03#35df) support this out of the box where you can extract your styles into a `Readable` node stream. Glamor has a separate [library](https://github.com/threepointone/glamor-stream) that allows you to do the same thing as well.

Extracting critical styles can improve things quite substantially for users with weaker devices or network connections:

<video class="shadow" autoplay loop muted playsinline>
  <source src="/assets/progressive-react/css-in-js-updates.webm" type="video/webm">
  <source src="/assets/progressive-react/css-in-js-updates.mp4" type="video/mp4">
</video>

<aside>
If you really just want component-scoped styles without any of the overhead that a CSS-in-JS library might add to your application, consider using a library like <a href="https://github.com/4Catalyzer/astroturf">astroturf</a>. You may not get all the features that you would in a more typical CSS-in-JS library, but you still get the benefits of controllable, component-scoped styles without any runtime cost.
</aside>

### Make things accessible

The term "progressive" in the context of web pages usually means that an attempt was made to ensure that **all** users have the opportunity to access at least some content of the site, if not all of it. If you don't ensure that your site is accessible to users with a disability, it is definitely not progressive.

Lighthouse is a good first step to identify any accessibility concerns on a web page. To find issues that are more specific to React elements, [`React A11y`](https://github.com/reactjs/react-a11y) can help here.

[IMAGE of console]

You can also consider to use [react-axe](https://github.com/dequelabs/react-axe) to audit the final, rendered DOM instead of just the JSX in your application.

### Let users install the site to their home screen

Does your React site work well on mobile? Do you have a service worker that caches core content so that it still works offline? Is your application useful enough that you would think people would like to access it on their phone?

If you answered _yes_ to all these questions, add a [web app manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) file to your site so that your users can get a better mobile experience when it's "installed" on their device homescreen. This lets you change a number of settings including the app icon, background color and theme color.

Create React App already sets up a default manifest for you when you create a new app:

```
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### Conclusion

When a tool like React is used by so many developers, it's only natural to expect two things:

* Improved APIs in React to make building applications easier
* Third-party tooling to make building applications easier

