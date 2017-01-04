---
layout: post
title:  "Progressive Web Apps with Angular"
date:   2017-09-16 9:20:00 -0400
categories: angular progressive web app javascript
description: Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: assets/progressive-angular-applications/angular-progressive-banner.png
permalink: /:title
published: false
---
![angular 2 hn banner](assets/progressive-angular-applications/angular-progressive-banner.png "Progressive Angular"){: .article-image }

Progressive Web Apps (PWA) have been the talk of the town in 2016. In short, they are applications that use modern web capabilities to provide a user experience similar to that of mobile and native apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in some.

My last blog post (see [here](http://houssein.me/angular2-hacker-news)) revolved around building a Hacker News client from scratch using Angular CLI. In this post, we're going to look into how we can make it faster and more reliable by making it a PWA.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](assets/progressive-angular-applications/angular2-hn-mobile.png "Angular 2 HN Preview"){: .article-image }

Let's go through some of the concepts behind a PWA.

* They are **progressive**, meaning that they work for every user in every browser
* Although they may provide a mobile-like experience, they are **responsive** and work on every device and every screen size
* Push notifications, background syncing and offline capability are all features that can be included
* They can be **installed** to the home screen of your device
* They can be accessed directly with just a URL

As you can see, the line between web and app is becoming less distinct.

The case for Progressive Web
==================
![installing](assets/progressive-angular-applications/xkcd-installing.png){: .article-image }

{:installing: .image-source}
[XKCD - Installing](http://xkcd.com/1367/)
{: installing}

Although installing an app is usually a fast and simple process, when was the last time you were about to install something but decided not to? Maybe you felt like you didn't want to go through the hassle of installing it, or maybe you just didn't want use to up any more memory. Whatever the reason, almost every single mobile user has experienced this at some point.

However, most people feel a lot less *restricted* to open up a browser and just type in to the address bar. The convenience, security and simplicity of just typing a URL into an address bar is a powerful advantage of the web, and PWAs combine this with the best of native applications.

Lighthouse
==================
<blockquote>
  <p>Lighthouse analyzes web apps and web pages, collecting modern performance metrics and insights on developer best practices.</p>
  <footer><a href="https://github.com/GoogleChrome/lighthouse">Lighthouse</a></footer>
</blockquote>

[Lighthouse](https://github.com/GoogleChrome/lighthouse) is an open-source auditing tool that you can use to test and improve your webpage. It runs a number of tests and generates a report on how well the page did. You can install Lighthouse as a [Chrome extension](https://github.com/GoogleChrome/lighthouse#install-chrome-extension) or use its [Node CLI tool](https://github.com/GoogleChrome/lighthouse#install-cli-), whichever you prefer.

Here's a snippet of the report before I added a number of progressive elements to the app.

![Lighthouse Report](assets/progressive-angular-applications/lighthouse-before.png){: .article-image }

The report consists of a number of audits that validate the aspects of a PWA. Let's go over each of these audits and how to improve each of these aspects in your application.

Page load performance is fast
==================
Let's take a look at how our app loads without any configuration. To represent the mobile experience, this is simulated under conditions of **3G (Network)** and **CPU Throttle of 2X slower** thanks to Chrome's Developer Tools.

![Network - No Configuration](assets/progressive-angular-applications/network-first.png){: .article-image }

Humans are impatient creatures, and [53% of us will give up if a site takes longer than 3 seconds to load](https://developers.google.com/web/progressive-web-apps/#fast). Even under these emulated conditions, no webpage should take this long to load if we can prevent it.

Ahead-of-Time compilation
-
One way we can make an Angular app load faster is to take advantage of running it's compiler under Ahead-of-Time conditions...

We used Angular CLI to build our application and creating a production build is just a simple terminal command.

{% highlight bash %}
ng build --prod
{% endhighlight %}

To trigger a production build with AOT compilation is just as simple (this really goes to show the amazing work the CLI team has done to make our lives easier).

{% highlight bash %}
ng build --prod --aot
{% endhighlight %}

And that's it. Now let's see how fast our app loads under the same emulated conditions.

![Network - Ahead-of-Time](assets/progressive-angular-applications/network-aot.png){: .article-image }

Woah, the app now loads 55% faster! The bundled file sizes were also reduced by [roughly 40%](https://twitter.com/beeman_nl/status/808180209719582720).

Application Shell
-
An application shell (or App Shell) is the minimal HTML, CSS and JS responsible for providing the user with the *shell* of the user interface. A toolbar is a good example of something that would be encapsulated in this shell. In a PWA, the App Shell can be cached so it loads as quickly as possible when a user decides to return to the webpage. With this, we can provide the user with something meaningful **immediately** even if the actual content has not rendered yet.

Let's take a look at how this can translate in our application.

![App Shell](assets/progressive-angular-applications/app-shell-content.png){: .article-image }

We can see that our App Shell mainly consists of a toolbar and a loading icon that shows while the content is being fetched over the network. In order to cache our shell in order to load faster on repeat visits, we'll need to add a Service Worker to our application.

Service Workers
-
A service worker is a script that runs in the background of your browser when you view a webpage. To be clear, it's separate from the webpage itself and can only communicate with it.

App can load on offline/flaky connections
==================
