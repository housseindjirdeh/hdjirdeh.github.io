---
layout: post
title:  "Thinking PRPL - A Progressive Web Pattern"
date:   2018-01-14 07:30:00
categories: prpl pwa performance
description: The PRPL pattern is not a specific technology or tool, but rather a methodology for building web applications that load fast and reliably...
tags:
- prpl
- pwa
- performance
comments: true
type: post
image: assets/thinking-prpl/banner.png
permalink: /:title
---
![PRPL Pattern](assets/thinking-prpl/banner.png "PRPL Pattern"){: .article-image-with-border }

***Although modified to include additional information, this article is a write-up of a talk I gave at Fluent Conf. You can watch it [here]() if you happen to be interested.***

The PRPL pattern is not a specific technology or tool, but rather a methodology for building web applications that load fast and reliably.

* First and foremost, you send (or **push**) the most critical resources to your users. 
* You do this in order to **render** your initial route as soon as possible. 
* Then, you **pre-cache** remaining assets.
* Finally, you can consider **lazy loading** your routes.

Although the techniques that make up the pattern aren't new, the term `PRPL` was coined by the [Polymer team](https://www.youtube.com/watch?v=J4i0xJnQUzU).

# Mobile Web

It's probably safe to say that the majority of individuals who read this article own a mobile device of some sort. Although what we do in our mobile devices can vary day-to-day, there's no denying that the amount of time that we spend on our smartphones and tablets have only increased year after year.

![comScore 2017 U.S. Mobile App Report](assets/thinking-prpl/comScore-app-report.png "comScore 2017 U.S. Mobile App Report"){: .article-image-with-source-border }

{:comscore app report: .image-source}
[Source: comScore 2017 U.S. Mobile App Report](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/The-2017-US-Mobile-App-Report)
{: comscore app report}

In comScore's 2017 U.S. Mobile App Report, it was found that the average user spends 16x more time on popular native apps than the mobile web. As mobile device consumers, we are far more likely to spend more time on native apps than we do on the mobile browser. However, mobile web pages still received over _twice as many_ unique monthly visitors than native apps. This is due to a multitude of reasons, including the convenience, security and simplicity of just typing a URL into an address bar instead of installing an entire app.

So how can we make sure that the users that discover our web pages on their mobile phones, or any device for that matter, have a great experience? There are many different ways, and we'll go through how applying the techniques behind the PRPL pattern can help. But before we dive into specific techniques and browser resource hints, let's take a little time talking about how the web works for a bit.

When we open a web browser on a mobile device (or tablet or desktop) and type something into the URL address bar and press `Enter`, a request is sent to a remote server somewhere. 

![Request to remote server](assets/thinking-prpl/request.png "Request to remote server"){: .article-image-with-border }

After a certain period of time, the server responds with the content that the browser needs. This is usually in the shape of an HTML document. The underlying application protocol used by the web (HTTP) works using this _request-response_ pattern.

Once the browser retrieves the initial HTML document, the next thing it needs to do is parse through the contents of the file in order to determine what other resources it needs. For each external resource it finds, it has to make a separate request. These resources can include CSS files for styling, JavaScript for dynamic content or even static images for example.

![Requests and responses](assets/thinking-prpl/request-response.gif "Requests and responses"){: .article-image-with-border }

With a typical webpage - multiple _round trips_ are usually needed in order to get all of the content that the user needs to see.

# Link Preload

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

We can see that there's a Stylesheet that's being referenced as well as a JavaScript file. One thing we can do in order to help the fact that multiple requests are needed for a web page to load, is to leverage [preload](https://w3c.github.io/preload/):

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

It's a [`<link>`](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) element where we define the location of the file as an `href` attribute. We define the `preload` keyword using the `rel` attribute and the _type of file_ we're trying to load using `as`. In this case, we're attempting to preload a JavaScript file - hence why we've defined `as="script"`.

![Preload](assets/thinking-prpl/preload.png "Preload"){: .article-image-with-border }

Using preload allows us to inform the browser a resource that is needed immediately after the page loads. Simply put, we’re telling the browser that this is a critical resource so please start loading it as soon as you can.

Although we can specify preload tags for resources defined in the `head` or `body` of root HTML file, you're more likely to get the most bang for your buck using preload for resources that might be discovered much later. An example of this could be a specific font tucked deep in one of your CSS files.

JavaScript files are not the only type of resource we can pre-emptively fetch using preload, but [other types of content](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded) can be preloaded as well.

## Link Prefetch

Instead of preload, we can also make use of a `<link>` [prefetch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) tag for some of our resources. The difference here is that link prefetch is suited for resources needed for a different navigation route and not for the current page. This means that the browser will know to fetch and cache this resource once it's completed loading the current page. 

<aside>
  <p>For a deeper dive into how Chrome prioritizes preloaded and prefetched resources as well as some real-world preload statistics, you can refer to Addy Osmani's write-up: <a href="https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf">Preload, Prefetch And Priorities in Chrome</a>.</p>
</aside>

Although it may seem straightforward to add `<link rel="preload">` and `<link rel="prefetch">` tags to the head of your HTML document for static sites, it can be a little tricker if you happen to be using a module bundler for a single-page application. Fortunately, there are a number of potential tools that can make this easier:

* webpack 4.6.0 [provides support]((https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)) for prefetching and preloading resources using 'magic' comments:

<div class="highlight-in-list">
{% highlight javascript %}
import(/* webpackPreload: true */ "PreloadedLibrary")

import(/* webpackPrefetch: true */ "PrefetchedLibrary")
{% endhighlight %}
</div>

* If you happen to be using an older version of webpack:
    * [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin) is a webpack plugin built by the Chrome team that allows you to define dynamically generated chunks (as a result of code-splitting) as preloaded or prefetched resources. This plugin is supposed to be used alongside [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).
    * [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) is an extension of [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) and can be used to attach custom attributes and resource hints to generated chunks, including `preload` and `prefetch`.

## Browser Support

At the time of writing this article, the browser support for preload is as follows:

* Shipped:
  * [Chrome](https://www.chromestatus.com/features/5757468554559488)
  * [Safari](https://webkit.org/status/#specification-preload)
  * [Firefox](https://platform-status.mozilla.org/#link-rel-preload)

* In development:
  * [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/preload/)

# HTTP/2 Server Push

We've just covered how we can use `<link rel="preload">` to load critical resources as early as possible, but another useful point of topic is HTTP/2 Server Push. In short, [HTTP/2](https://http2.github.io/) is a revision of HTTP and aims to provide a number of performance improvements. For the purpose of this article, we're only going to focus on server push here.

The idea behind server push is that when we send down the initial HTML document during our first request/response interaction - we can also send critical assets at the same time. These are assets we know the browser will need before it even knows it itself.

![Server Push](assets/thinking-prpl/server-push.png "Server Push"){: .article-image-with-border }

One of the primary benefits of using server push is that it can minimize round trips to the server. With this, we can remove the time it takes the browser to parse the contents of the HTML file and fire subsequent requests for any assets that it finds. This means we can cut down page load times.

One thing we didn't mention earlier about `<link rel="preload">` is that instead of using HTML tags, we can also specify HTTP headers: 

{% highlight html %}
Link: </app/style.css>; rel=preload; as=style
Link: </app/script.js>; rel=preload; as=script
{% endhighlight %}

One thing that is important to mention is that many hosting platforms that support HTTP/2 Push will attempt to push assets down the wire when it sees that you've preloaded them using Link HTTP headers. An example is [Firebase Hosting](https://firebase.google.com/docs/hosting/), where you can simply [add Link Headers](https://firebase.googleblog.com/2016/09/http2-comes-to-firebase-hosting.html) to the `firebase.json` configuration file.

<aside>
  <p>Although pushing assets automatically with the use of Link Headers is useful for not having to do any additional work in order to leverage server push, there may be cases where you may only want to preload your assets. If that's the case, you can use a `nopush` directive:</p>
  <figure class="highlight"><pre class=" language-html"><code class=" language-html" data-lang="html">Link: &lt;/app/style.css&gt;; rel=preload; as=style; nopush
Link: &lt;/app/script.js&gt;; rel=preload; as=script</code></pre></figure>
</aside>

## Server Push is experimental

Although page load times can be reduced with Server Push, it can actually harm performance if not used correctly. There are a number of reasons why this can happen:

* **Pushing unused assets:** The server has no idea which resources are being used by the client, and pushing assets that aren't used can waste user bandwidth.
* **Pushing too many assets:** Pushing too many assets can cause performance hits, and 
* **Pushing assets already cached by the browser:** Ideally, we would want the browser to reject pushed resources if it already has it stored in one of it's caches. Although the client can use [settings](https://tools.ietf.org/html/rfc7540#section-8.2.2) to make this possible, each browser behaves differently and this can get a little tricky. Jake Archibald covers this in a little more detail in his excellent [write-up](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/#the-browser-can-abort-pushed-items-if-it-already-has-them) about the nuances of HTTP/2 Push between different browsers.

<aside>
  <p>For some more information about the subject, you can refer to Jeremy Wagner's <a href="https://www.smashingmagazine.com/2017/04/guide-http2-server-push/">guide</a> to HTTP/2 Server Push.</p>
</aside>

# Service Workers

Now let's shift gears a bit and talk about the _pre-cache_ concept in PRPL. I've briefly addressed service workers in my previous [post]({{ site.url }}/progressive-angular-applications) about building progressive Angular applications, but we'll dive a little deeper here.

A service worker is a script that runs in the background of your browser when you view a webpage. We can either create the service worker file and write the logic ourselves, or we can use libraries that can make this process easier. Built the Google Chrome team, [Workbox](https://developers.google.com/web/tools/workbox/) provides a suite of libraries and tools that we can use. One of the tools it provides is a CLI, which can be installed globally:

{% highlight bash %}
npm install workbox-cli --global
{% endhighlight %}

We can then use `workbox wizard` to start the process:

![Workbox wizard](assets/thinking-prpl/workbox-wizard.gif "Workbox wizard"){: .article-image-with-border }

Workbox asks you a series of questions in order to set up a service worker with the correct configurations for your project:

1. _What is the root of your web app?_ If you're using a module bundler or have a build step in your application, you most likely have a final folder that you deploy (for example: `dist/` or `build/`).
2. _Which file types would you like to precache?_ You can decide which file types you would like your service worker to precache.
3. _Where would you like your service worker file to be saved?_ You most likely would need to have your service worker saved in the folder you deploy. However, you have the option to decide where exactly.
4. _Where would you like to save these configuration settings?_ Workbox saves these settings into a separate configurations file (and you can decide where to save it). The default answer is `workbox-config.js` at the root of your application.

Once we have our configurations file saved, simply running the following command creates a new service worker file:

{% highlight bash %}
workbox generateSW workbox-config.js
{% endhighlight %}

Although this creates a service worker file where we've asked it to, we still need to tell the browser to register it. We can do this by adding a `<script>` tag in our `index.html` file:

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

