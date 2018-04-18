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

It's probably safe to say that the majority of individuals who read this article own a mobile device of some sort. Although what we do in our mobile devices can vary day-to-day, there's no denuing that the amount of time that we spend on our smartphones and tablets have only increased year after year.

In [comScore's]() 2017 U.S. Mobile App Report, they concluded that the average user spends 16x more time on popular native apps than the mobile web. As mobile device consumers, we are far more likely to spend more time on native apps than we do on the mobile browser. However, mobile web pages still received over _twice as many_ unique monthly visitors than native apps. This is due to a multitude of reasons, including the convenience, security and simplicity of just typing a URL into an address bar instead of installing an entire app.

So how can we make sure that the users that discover our web pages on their mobile phones, or any device for that matter, have a great experience? There are many different ways, and we'll go through how applying the techniques behind the PRPL pattern can help. But before we dive into specific techniques and browser resource hints, let's take a little time talking about how the web works for a bit.

When we open a web browser on a mobile device (or tablet or desktop) and type something into the URL address bar and press `Enter`, a request is sent to a remote server somewhere. 

![Request to remote server](assets/thinking-prpl/request.png "Request to remote server"){: .article-image-with-border }

After a certain period of time, the server responds with the content that the browser needs. This is usually in the shape of an HTML document. With any webpage or resource, the web works using this _request-response_ pattern.

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

{% highlight javascript %}
import(/* webpackPreload: true */ "PreloadedLibrary")

import(/* webpackPrefetch: true */ "PrefetchedLibrary")
{% endhighlight %}

* If you happen to be using an older version of webpack:
    * [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin) is a webpack plugin built by the Chrome team that allows you to define dynamically generated chunks (as a result of code-splitting) as preloaded or prefetched resources. This plugin is supposed to be used alongside [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).
    * [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) is an extension of [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) and can be used to attach custom attributes and resource hints to generated chunks, including `preload` and `prefetch`.
