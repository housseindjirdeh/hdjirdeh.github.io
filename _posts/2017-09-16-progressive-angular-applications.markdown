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

Let's go through some of the main concepts or progressive applications.

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
[Lighthouse](https://github.com/GoogleChrome/lighthouse) is an open-source auditing tool that you can use to test and improve your webpage. It runs a number of tests and generates a report on how well the page did. You can install Lighthouse as a [Chrome extension](https://github.com/GoogleChrome/lighthouse#install-chrome-extension) or use its [Node CLI tool](https://github.com/GoogleChrome/lighthouse#install-cli-), whichever you prefer.

Here's a snippet of the report before I added a number of progressive elements to the app.

![Lighthouse Report](assets/progressive-angular-applications/lighthouse-before.png){: .article-image }

The report consists of a number of audits that validate the aspects of a PWA. Let's go over each of these audits and how we can improve each of these areas in our Hacker News client.

Network connection is secure
==================
A number of progressive web technologies, such as service workers (which we'll go over in a bit) require a **HTTPS** connection in order to work. The '**S**' at the end, which stands for secure, ensures that the content that you retrieve is secure and cannot be tampered with.

Firebase, like many hosting platforms, is protected with HTTPS by default. This makes it simple to have your website or application protected. Our Hacker News client is hosted on Firebase and this website is hosted on Github Pages (which also allows **HTTPS** encryption).

Page load performance is fast
==================
To kick things off, let's take a look at how our app loads without any configuration. To represent the mobile experience, this is simulated under conditions of **3G (Network)** and **CPU Throttle of 2X slower** thanks to Chrome's Developer Tools.

![Network - No Configuration](assets/progressive-angular-applications/network-first.png){: .article-image }

Humans are impatient creatures, and [53% of us will give up if a site takes longer than 3 seconds to load](https://developers.google.com/web/progressive-web-apps/#fast). Even under these emulated conditions, no webpage should take this long to load if we can prevent it.

Ahead-of-Time compilation
-
One way we can make an Angular app load faster is to take advantage of running it's compiler under Ahead-of-Time conditions...

We used Angular CLI to build our application and creating a production build was as simple as a terminal command.

{% highlight bash %}
ng build --prod
{% endhighlight %}

To trigger a production build with AOT compilation is just as simple (this really goes to show the amazing work the CLI team has done to make our lives easier).

{% highlight bash %}
ng build --prod --aot
{% endhighlight %}

And that's it. Now let's see how fast our app loads under the same emulated conditions.

![Network - Ahead-of-Time](assets/progressive-angular-applications/network-aot.png){: .article-image }

The app now loads 55% faster. That's a pretty big difference for such a quick adjustment. The bundled file sizes were also reduced by [roughly 40%](https://twitter.com/beeman_nl/status/808180209719582720).

Application Shell
-
An application shell (or App Shell) is the minimal HTML, CSS and JS responsible for providing the user with the *shell* of the user interface. A toolbar is a good example of something that would be encapsulated in this shell. In a PWA, the App Shell can be cached so it loads as quickly as possible when a user decides to return to the webpage. With this, we can provide the user with something meaningful **immediately** even if the actual content has not rendered yet.

Let's take a look at how this can translate this in our application.

![App Shell](assets/progressive-angular-applications/app-shell-content.png){: .article-image }

We can see that our App Shell just consists of our header, navigation and loading icon that shows while the content is being fetched over the network. To cache our shell in order to load faster on repeat visits, we'll need to add a **Service Worker** to our application.

Service Worker
-

A service worker is a script that runs in the background of your browser when you view a webpage. It's important to note that it is entirely separate from the webpage itself and can only communicate with it...

We can now register the service worker to our application by adding the following to `index.html`.

{% highlight javascript %}
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }
</script>
{% endhighlight %}

This piece of code checks to see if the browser supports service workers and if so, specify where it lives in order to register it. In our case, it's `service-worker.js`. Let's run our application now and check the console.

![App Shell](assets/progressive-angular-applications/service-worker-fail.png){: .article-image }

We can see that it can't retrieve the service worker file, `service-worker.js`, since it doesn't exist. There's a few ways we can set up this file, with one being writing out the logic to open a cache, cache all the static files (HTML, CSS, JS, images, etc..) and return the cached resources when the user returns to the page. Here's an [excellent introduction](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) to setting up a service worker.

But there's a simpler way we can set up our service worker: using  **Service Worker Precache**.

Service Worker Precache
-

[Service Worker Precache (`sw-precache`)](https://github.com/GoogleChrome/sw-precache#service-worker-precache) is a module that generates a service worker responsible for caching all the static resources in your application. It integrates right into the build system you're using and with some simple configurations, it creates the service worker on the fly. We can begin by installing it.

{% highlight bash %}
npm install --save-dev sw-precache
{% endhighlight %}

Now in your `package.json` file, let's add a `precache` script.

{% highlight javascript %}
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "lint": "tslint \"src/**/*.ts\"",
  "test": "ng test",
  "pree2e": "webdriver-manager update --standalone false --gecko false",
  "e2e": "protractor",
  "precache": "sw-precache"
}
{% endhighlight %}

Now just run the following script.

{% highlight bash %}
npm run precache
{% endhighlight %}

After a few minutes you should see the following output.

![Service worker output](assets/progressive-angular-applications/service-worker-output.png){: .article-image }

It generated a `service-worker.js` file right in your root folder! If you take a look at the file, you'll see logic that `installs` and `activates` your service worker. You can also find where it caches and returns requests (`fetch` event).

Now this is all pretty cool and everything, but having the service worker in the root of our application isn't going to help us. This is because when you run a production build with the CLI (`ng build --prod`), it generates the compiled, bundled and minifed code in a `dist/` subdirectory which we deploy and host. We can update our `precache` script to make this happen.

{% highlight javascript %}
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "lint": "tslint \"src/**/*.ts\"",
  "test": "ng test",
  "pree2e": "webdriver-manager update --standalone false --gecko false",
  "e2e": "protractor",
  "precache": "sw-precache --root=dist --verbose"
}
{% endhighlight %}

Now running the script should generate the service worker right inside the `dist/` directory. We've added `verbose` so we can see a logged output in the terminal for each and every resource that's precached. Running `npm run precache` will give us the following.

![Service worker dist output](assets/progressive-angular-applications/service-worker-dist-output.png){: .article-image }

We can see that our service worker file was generated in the `dist/` folder which is perfect. We can also see that each and every static resource in out dist folder is precached by default. This is a bit of an overkill, and that's because not every one of those files are requested when you run the application....

We can *configure*

App can load on offline/flaky connections
==================
