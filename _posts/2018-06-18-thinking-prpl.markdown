---
layout: post
title:  "Thinking PRPL - A Progressive Web Pattern"
date:   2018-06-18 07:30:00
categories: prpl progressive web app performance
description: The PRPL pattern is not a specific technology or tool, but rather a methodology for building web applications that load fast and reliably...
tags:
- prpl
- progressive web app
- performance
comments: true
type: post
image: assets/thinking-prpl/banner.png
permalink: /:title
---
<aside>
<p>Although modified to include additional information, this article is a write-up of a talk I gave at .concat() and Fluent. You can watch it <a href="https://www.youtube.com/watch?v=RcHWKieBslk">here</a> if you happen to be interested.</p>
</aside>

The PRPL pattern is not a specific technology or tool, but rather a methodology for building web applications that load fast and reliably.

* First and foremost, you send (**push**) the most critical resources to your users. 
* You do this in order to **render** your initial route as soon as possible. 
* You then **pre-cache** remaining assets.
* Finally, you can consider **lazy loading** your routes.

The term `PRPL` was coined by the Polymer team in their [talk at Google I/O 2016](https://youtu.be/J4i0xJnQUzU?t=2032).

## Mobile Web

It is probably safe to assume that the majority of individuals who read this article own a mobile device, and the amount of time that we spend on our smartphones and tablets have only increased year after year.

<img alt="comScore 2017 U.S. Mobile App Report" title="comScore 2017 U.S. Mobile App Report" data-src="/assets/thinking-prpl/comScore-app-report.png" class="lazyload shadow" />

In comScore's [2017 U.S. Mobile App Report](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/The-2017-US-Mobile-App-Report), it was found that the average user spends 16x more time on popular native apps than the mobile web. As mobile device consumers, we are far more likely to spend more time on native apps than we do on the mobile browser. However, mobile web pages still received over _twice as many_ unique monthly visitors than native apps. This is due to a multitude of reasons, including the convenience, security and simplicity of just typing a URL into an address bar instead of installing an entire application.

So how can we ensure that users who discover our web pages have a great experience regardless of what device they use? There are quite a few ways, and we'll go through some specific techniques and resource hints in this article. But before we do that, let's take a little time to talk about how the web works first.

When we open a browser on a mobile device (or tablet or desktop) and type something into the address bar and press `Enter`, a request is sent to a remote server somewhere. 

<img alt="Request to remote server" title="Request to remote server" data-src="/assets/thinking-prpl/request.png" class="lazyload shadow" />

After a certain period of time, the server responds with content that the browser needs. This usually takes shape of an HTML document. The underlying application protocol used by the web (HTTP) works using this request-response pattern.

Once the browser retrieves the initial HTML document, the next thing it does is parse through the contents of the file in order to determine what other resources it needs. For each external resource that it finds, it submits a separate request for it. These resources can include CSS files for styling, JavaScript for dynamic content or even static images.

<img alt="Request and responses" title="Request and responses" data-src="/assets/thinking-prpl/request-response.gif" class="lazyload shadow" />

Multiple round trips are usually needed for a typical webpage in order to get all of the content that the user needs to see.

## Link Preload

Let's assume that the following markup represents the HTML document that our browser receives on the initial request:

{% highlight html %}
<html lang="en">
   <head>
      <link rel="stylesheet" href="styles.css">
   </head>
   <body>
      <!--(>'-')> <('-'<)-->
      <script src="script.js"></script>
   </body>
</html>
{% endhighlight %}

We can see that there's a style sheet file that is referenced as well as a JavaScript file. One thing we can do in order to help the fact that multiple requests are needed is to leverage [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content):

{% highlight html %}
<html lang="en">
   <head>
      <link rel="preload" as="script" href="script.js">
      <link rel="stylesheet" href="styles.css">
   </head>
   <body>
      <!--(>'-')> <('-'<)-->
      <script src="script.js"></script>
   </body>
</html>
{% endhighlight %}

The preload hint has a syntax that a lot of us may already be familiar with:

{% highlight html %}
<link rel="preload" as="script" href="script.js">
{% endhighlight %}

It's a `<link>` element where we define the location of the file as an `href` attribute. We specify the `preload` keyword using the `rel` attribute and the type of file we're trying to load using `as`. In this case, we're trying to preload a JavaScript file - hence why we've defined `as="script"`.

Using preload allows us to inform the browser that a resource is needed immediately after the page loads. In other words, we’re telling the browser that this is a critical resource so please start loading it as soon as you can.

<img alt="Preload" title="Preload" data-src="/assets/thinking-prpl/preload.png" class="lazyload shadow" />

Although we can specify preload tags for resources defined in the `head` or `body` of our root HTML file, you're more likely to get the most bang for your buck using preload for resources that might be discovered much later. An example of this could be a specific font tucked deep in one of your CSS files.

Style sheet and JavaScript files are not the only types of resources we can pre-emptively fetch using preload. [Other types of content](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded) can be preloaded as well.

### Link Prefetch

Instead of preload, we can also make use of a [prefetch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) tag for some of our resources. The difference here is that prefetch is more suited for resources needed for a different navigation route. This means that the browser will know to fetch and cache this resource once it has completed loading the current page. 

<aside>
  <p>For a deeper dive into how Chrome prioritizes preloaded and prefetched resources as well as some real-world preload statistics, you can refer to Addy Osmani's write-up: <a href="https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf">Preload, Prefetch And Priorities in Chrome</a>.</p>
</aside>

Although it may seem straightforward to add `<link rel="preload">` and `<link rel="prefetch">` tags to the head of your HTML document for static sites, it can be a little tricker if you happen to be using a module bundler for a single-page application. Fortunately, there are a number of potential tools that can make this easier:

* webpack 4.6.0 [provides support](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c) for prefetching and preloading resources using 'magic' comments:

{% highlight javascript %}
import(/* webpackPreload: true */ "PreloadedPage")

import(/* webpackPrefetch: true */ "PrefetchedPage")
{% endhighlight %}

* If you happen to be using an older version of webpack:
    * [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin) is a webpack plugin that allows you to define dynamically generated chunks (as a result of code-splitting) as preloaded or prefetched resources. This plugin is supposed to be used alongside [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).
    * [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) is an extension of [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) and can be used to attach custom attributes and resource hints to generated chunks, including `preload` and `prefetch`.

### Browser Support

At the time of writing this article, the browser support for preload is as follows:

* Shipped:
  * [Chrome](https://www.chromestatus.com/feature/5757468554559488)
  * [Safari](https://webkit.org/status/#specification-preload)
  * [Firefox](https://platform-status.mozilla.org/#link-rel-preload)

* In development:
  * [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/preload/)

## HTTP/2 Server Push

We've just covered how we can use `<link rel="preload">` to load critical resources as early as possible, but another useful point of topic is HTTP/2 Server Push. In short, [HTTP/2](https://http2.github.io/) is a revision of HTTP and aims to provide a number of performance improvements. For the purpose of this article, we're only going to focus on Server Push.

The idea behind Server Push is that when we send down the initial HTML document during our first request/response interaction, we can also send down (or push) critical assets at the same time. These are assets we know the browser will need before it even knows it needs them itself.

<img alt="Server Push" title="Server Push" data-src="/assets/thinking-prpl/server-push.png" class="lazyload shadow" />

One of the primary benefits of using Server Push is that it can minimize round trips to the server. We can remove the time it takes the browser to parse the contents of the HTML file and fire subsequent requests for any assets that it finds which can result in shorter page load times.

One thing we didn't mention earlier about preload is that instead of using HTML tags, we can also specify HTTP headers: 

{% highlight html %}
Link: </app/style.css>; rel=preload; as=style
Link: </app/script.js>; rel=preload; as=script
{% endhighlight %}

Many hosting platforms that support HTTP/2 Push will attempt to push assets down the wire when it sees that you've preloaded them using Link HTTP headers. Examples include [Firebase Hosting](https://firebase.googleblog.com/2016/09/http2-comes-to-firebase-hosting.html) and [Netlify](https://www.netlify.com/blog/2017/07/18/http/2-server-push-on-netlify/).

<aside>
  <p>Although having Server Push instantiated automatically for assets where we've declated Link Headers can be useful, there may be cases where you may only want to preload your assets and not rely on Push whatsoever. In those cases, you can use a <code>nopush</code> attribute:</p>
  <figure class="highlight"><pre class=" language-html"><code class=" language-html" data-lang="html">Link: &lt;/app/style.css&gt;; rel=preload; as=style; nopush
Link: &lt;/app/script.js&gt;; rel=preload; as=script</code></pre></figure>
<p>The result here is the same as using a preload link HTML tag.</p>
</aside>

### Server Push is experimental

Although page load times can be reduced with Server Push, it can actually harm performance if not used correctly. There are a number of reasons why this can happen:

* **Pushing unused assets:** The server has no idea which resources are being used by the client, and pushing assets that aren't used can waste user bandwidth.
* **Pushing too many assets:** Pushing too many assets can cause performance hits. There's no specific number of files you should be pushing and it can vary depending on how many resources the browser is trying to load. It is important to keep in mind that Server Push can overwrite the browser's prioritization logic and you should try pushing assets with the correct order of loading.
* **Pushing assets already cached by the browser:** Ideally, we would want the browser to reject pushed resources if it already has it stored in one of its caches. Although the client can use [settings](https://tools.ietf.org/html/rfc7540#section-8.2.2) to make this possible, each browser behaves differently and this can get a little tricky. Jake Archibald covers this in a little more detail in his excellent [write-up](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/#the-browser-can-abort-pushed-items-if-it-already-has-them) about the nuances of HTTP/2 Push between different browsers.

<aside>
  <p>For more information on Server Push, you can refer to Jeremy Wagner's <a href="https://www.smashingmagazine.com/2017/04/guide-http2-server-push/">guide.</a></p>
</aside>

## Service Workers

Now let's shift gears a bit and talk about the _pre-cache_ concept in PRPL. I've briefly addressed service workers in my previous [post]({{ site.url }}/progressive-angular-applications) about building progressive Angular applications, but we'll dive a little deeper here.

A service worker is a script that runs in the background of your browser when you view a webpage. We can either create the service worker file and write the logic ourselves, or we can use libraries that can make this process easier. One example is [Workbox](https://developers.google.com/web/tools/workbox/), which provides a suite of libraries and tools that we can use. One of the tools that it provides is a CLI which we can install globally:

{% highlight bash %}
npm install workbox-cli --global
{% endhighlight %}

We can then use `workbox wizard` to start the process:

<img alt="Workbox wizard" title="Workbox wizard" data-src="/assets/thinking-prpl/assets/thinking-prpl/workbox-wizard.gif" class="lazyload shadow" />

Workbox asks a series of questions in order to set up a service worker with the correct configurations:

1. <code>What is the root of your web app?</code> If you're using a module bundler or have a build step in your application, you most likely have a final folder that you'll need to deploy (for example: `dist/` or `build/`).
2. <code>Which file types would you like to precache?</code> You can decide which file types you would like to precache.
3. <code>Where would you like your service worker file to be saved?</code> You most likely would need to have your service worker saved in the folder you deploy, but you can specify where exactly.
4. <code>Where would you like to save these configuration settings?</code> Workbox saves these settings into a separate configurations file (and you can decide where to save it). The default answer is `workbox-config.js` at the root of your application and the file generated looks like this:

<div class="highlight-in-list">
{% highlight javascript %}
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{js,png,svg,html,json}'],
  swDest: 'dist/service-worker.js',
};
{% endhighlight %}
</div>

Once we have our configurations file saved, simply running the following command creates a new service worker file:

{% highlight bash %}
workbox generateSW workbox-config.js
{% endhighlight %}

Although this creates a service worker file where we've asked it to, we still need to tell the browser to register it. We can do this by adding a `<script>` tag in `index.html`:

{% highlight html %}
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js').then(function(){
        // Registration was successful
        console.log('ServiceWorker registration successful!');
      }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
</script>
{% endhighlight %}

In here, we check to see if service workers are supported in the browser. If they are, we register our service worker using `navigator.serviceWorker.register()`. To prevent the possibility of the service worker being registered at the same time as other resources are still being loaded to the DOM, we make sure to only register it after `window.onload` is complete with the use of an event listener. At the end, we have logs outputted to our console in the case of a successful registration or a failed one.

### Application Shell

So we briefly covered how to install and register a service worker using Workbox, but we still haven't mentioned how they work. One of the primary benefits of using a service worker is that they allow you to precache the resources that make up the Application Shell. Like the name suggests, the App Shell is the _shell_ of your user interface.

<img alt="App Shell - Twitter Lite" title="App Shell - Twitter Lite" data-src="/assets/thinking-prpl/assets/thinking-prpl/twitter-lite-app-shell.png" class="lazyload shadow" />

{:app shell: .image-source}
[Application Shell - Twitter Lite](https://mobile.twitter.com)
{: app shell}

The App Shell consists of all the HTML, CSS and JS that make up the parts of that application that don't convey actual data (or dynamic data retrieved from a third-party location). Once the app is loaded for the first time, the assets that make up the shell can be retrieved over the network normally. A service worker can act like a middleman between the browser and the network allowing us to to cache these resources as well.

<img alt="Service Worker" title="Service Worker" data-src="/assets/thinking-prpl/assets/thinking-prpl/service-worker.png" class="lazyload shadow" />

Storing the resources that make up the shell in the service worker cache means that when the user loads the application for a second time, the browser can retrieve them from the service worker instead of making network requests. This results in **faster page loads on repeat visits**.

Although using Workbox's CLI can simplify creating a service worker, we would still need to remember to create a new one every time we make a change to our application. In this case, it might make more sense to integrate Workbox into our build system. For example, instead of installing the library globally - we can install it as a dependency:

{% highlight bash %}
npm install workbox-cli --save-dev
{% endhighlight %}

We can then add it as part of our build step:

{% highlight bash %}
// package.json

"scripts": { 
  //...
  "build": "{build} && workbox generateSW workbox-config.js" 
}
{% endhighlight %}

<aside>
  <p>Instead of using the CLI, we also have the option of using an <code class="highlighter-rouge">npm</code> module or webpack plugin provided by Workbox. You can find out more in the <a href="https://developers.google.com/web/tools/workbox/modules/#node-modules">documentation.</a></p>
</aside>

### Dynamic Content

The next thing service workers allow us to do is pre-cache **dynamic content**. Just like the resources that make up the App Shell, this is data that can be retrieved from a third-party network. However, the difference here is that this is content that can change with subsequent page loads.

Let's modify our configurations file, `workbox-config.js`, to add a `runtimeCaching` attribute:

{% highlight javascript %}
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{js,png,svg,html,json}'],
  swDest: 'dist/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/your.api.com\/.*/,
      handler: 'networkFirst'
    }
  ]
};
{% endhighlight %}

With `runtimeCaching`, we can add an array of URL patterns and define a specific caching strategy for each. Different caching strategies allow us to control how our service worker can handle caching results fetched from a URL. In this example, we use the `networkFirst` strategy which means the service worker will always know to retrieve the contents from the network and serve it to the user. However, it will also always update its pre-cached results with the latest data. If the network happens to fail, the service worker will serve its cached information and the user can see older data instead of _no data at all_.

Although extremely useful for applications where data is changing frequently, `networkFirst` isn't the only caching strategy we can use. Let's quickly go over the others:

* `cacheFirst`: If there is no cached data, a network request is made and the results are cached. After that, the cache will only serve its data and no network requests will be made. This can be useful for handling things in an offline-first manner.
* `staleWhileRevalidate`: Mostly suited for serving non-critical data to the user as fast as possible, this approach is used to serve cached data to the user quickly at first. A network request is also made in parallel with the request made to the cache. When the network request is complete, the cache is updated.
* `cacheOnly`: Only retrieve resources from the cache and do not rely on the network at all. However, `cacheFirst` is more commonly used for offline-first patterns.
* `networkOnly`: Only retrieve resources from the network and do not have any data cached. This may not be commonly used but may be suitable for data that cannot be cached.

<aside>
  <p>The Workbox <a href="https://developers.google.com/web/tools/workbox/modules/workbox-strategies">documentation</a> and the <a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/">Offline Cookbook</a> go into more detail about each of the different strategies.</p>
</aside>

### Customize Service Worker

Although using the Workbox CLI can make getting a service worker up and running an extremely simple and straightforward process, there may be scenarios where we would need a little more control on how our service worker is created. This can be for a number of reasons:

* We have more complex pre-caching requirements than what Workbox provides out of the box.
* We want to take advantage of other service worker features (such as [Web Push](https://developer.mozilla.org/en-US/docs/Web/API/Push_API))
* We already have a service worker file and only need to incorporate some Workbox features in addition to it.

For any of these scenarios, we can use the `injectManifest` mode provided by Workbox:

{% highlight javascript %}
workbox injectManifest workbox-config.js
{% endhighlight %}

By using this flag, we not only need to provide a destination service worker location but the location of an existing service worker as a source as well.

<aside>
  <p>There is a common conception that service workers may not be necessary in cases where the majority of users who would open a specific webpage likely have a working network connection. Even though developers who cater to users who are fortunate enough to have reliable network connections all the time may <i>feel</i> like there's no need for offline support, flaky network connections will eventually affect them for varying reasons.</p>

  <img alt="Reliability" title="Reliability" data-src="/assets/thinking-prpl/reliability-tweet.png" class="lazyload small" />

  <p class="image-source no-margin"><a href="https://twitter.com/HenrikJoreteg/status/909632750453321734">Tweet Source</a></p>
</aside>

### Browser Support

At the time of writing, service workers are supported in all major browsers:

* Shipped:
  * [Chrome](https://www.chromestatus.com/feature/6561526227927040)
  * [Safari](https://webkit.org/status/#specification-service-workers)
  * [Firefox](https://platform-status.mozilla.org/#service-worker)
  * [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/serviceworker)

## Bundles

Front-end development has changed a lot in the past few years. A large number of JavaScript libraries and frameworks have allowed us to add more client-side logic and functionality than ever before. Unfortunately, this can come at a cost of [larger bundle sizes](https://twitter.com/slightlylate/status/834507657209733121).

Although adding more and more JavaScript code to a large application will inevitably make our bundle sizes grow and grow, we can incorporate _code splitting_ into our application to help. The idea behind code splitting is that instead of providing users with all of the code that makes up our application as soon as they navigate to the first page, we can try to give them _pieces_ of the entire bundle that are only relevant to their current route. The browser can then make requests for more chunks of the bundle as the user navigates through the application. The concept of loading different pieces of a bundle on demand is called _lazy loading_.

Code splitting and lazy loading allow us to send smaller chunks to our users as well prioritize loading of specific chunks if we need to (with `<link rel="preload">` for example). This can improve loading times significantly. 

Angular's routing framework has lazy loading [built-in](https://angular.io/guide/lazy-loading-ngmodules) where we can use a `loadChildren` attribute to load a feature module on demand:

{% highlight javascript %}
export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'details', loadChildren: 'details/details.module#DetailsModule' }
];
{% endhighlight %}

For React, [React Loadable](https://github.com/jamiebuilds/react-loadable) is an excellent library that allows you to create higher order components to load components asynchronously.

{% highlight javascript %}
// snippet from React Loadable README.md

import Loadable from 'react-loadable';
import Loading from './my-loading-component';

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
{% endhighlight %}

Code splitting at the component level can even allow for more fine-grained control over doing things at the route level.

<blockquote>
  <p>There are many more places than just routes where you can pretty easily split apart your app. Modals, tabs, and many more UI components hide content until the user has done something to reveal it.</p>
  <footer><a href="https://github.com/jamiebuilds/react-loadable">React Loadable README.md</a></footer>
</blockquote>

### Tracking bundle size changes

If you're considering adding code splitting/lazy loading to your application, it's probably a good idea to keep an eye on your bundle size from time to time. There are a number of different community-built tools that can make this easier, such as [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) which shows a visualization of how different parts of your bundle are larger/smaller than others with a treemap.

<img alt="Webpack Bundle Analyzer" title="Webpack Bundle Analyzer" data-src="/assets/thinking-prpl/assets/thinking-prpl/webpack-bundle-analyzer.png" class="lazyload shadow" />

## Metrics

With regards to load times, using metrics can be important to set a baseline on how well our webpage loads for different users. Some important metrics to consider are:

* **First Meaningful Paint**: The time it takes the user to see _meaningful_ content on their device.
* **Time to Interactive (TTI)**: The time it takes for the JavaScript thread to settle and the user can interact with the application.

As developers, many of us have become accustomed to building web applications with healthy network connections and powerful machines. At times, we may not realize how users would experience our applications with lower-end devices and weaker connections. According to a statistic mentioned [here](https://www.thinkwithgoogle.com/_qs/documents/57/mobile-page-speed-new-industry-benchmarks.pdf), the average time it takes to fully load a webpage on mobile is greater than _20 seconds_. This was found by running tests on a globally representative 3G network connection and a Nexus 5 device. Another Google Research statistic mentioned [here](https://www.thinkwithgoogle.com/intl/en-ca/advertising-channels/mobile/mobile-shopping-ecosystem/) found the average load time to be _15.3 seconds_ with a 4G connection.

If a webpage takes longer than 3 seconds to load, [more than half of our users will give up](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/).

<aside>
  <p>For an excellent (and deeper) dive into perfomance metrics, take a look at Philip Walton's article: <a href="https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_meaningful_paint_and_hero_element_timing">User-centric Performance Metrics</a>.</p>
</aside>

## Conclusion

It's important to first spend a little time analyzing the devices of our users before adding performance enhancements that very well may not be necessary (or important as other features our application needs). If we find out our application is not loading as fast it probably should after a little digging, then it may be worthwhile to dive in and try adding some optimizations to our site.