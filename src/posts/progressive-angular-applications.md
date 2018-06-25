![angular 2 hn banner](assets/progressive-angular-applications/angular-progressive-banner.png 'Progressive Angular'){: .article-image-with-border }

**_Among other things, this post goes through how I set up offline support using the `sw-precache` and `sw-toolbox` libraries. Many updates and changes have been made to Angular tooling with regard to PWA support since this article was written, so please refer to my [newer post](assets/progressive-angular-applications/angular-progressive-banner.png) for more up to date information._**

Progressive Web Apps (PWA) have been the talk of the town in 2016. In short, they are applications that use modern web capabilities to provide a user experience similar to that of mobile and native apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in some.

An earlier post of mine (see [here]({{ site.url }}/angular2-hacker-news)) revolved around building a Hacker News client from scratch using [Angular CLI](https://cli.angular.io/). In this post, we're going to look into how we can make it faster and more reliable by making it a PWA.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](assets/progressive-angular-applications/angular2-hn-mobile.png 'Angular 2 HN Preview'){: .article-image-with-border }

Let's go through some of the main concepts of progressive applications.

- They are **progressive**, meaning that they work for every user in every browser
- Although they may provide a mobile-like experience, they are **responsive** and work on every device and screen size
- [Push notifications](https://developers.google.com/web/fundamentals/getting-started/codelabs/push-notifications/) and [offline support](https://developers.google.com/web/fundamentals/getting-started/codelabs/offline/) are both features that can be included
- They can be **installed** to the home screen of your device
- They can be accessed directly with just a URL

# The case for Progressive Web

![installing](assets/progressive-angular-applications/xkcd-installing.png){: .article-image }

{:installing: .image-source}
[XKCD - Installing](http://xkcd.com/1367/)
{: installing}

Although installing an app is usually a fast and simple process, when was the last time you were about to install something but decided not to? Maybe you felt like you didn't want to go through the hassle of installing it, or maybe you just didn't want use to up any more memory. Whatever the reason, almost every single mobile user has experienced this at some point.

However, most people feel a lot less _restricted_ to open up a browser and just type in to the address bar. The convenience, security and simplicity of just typing a URL into an address bar is a powerful advantage of the web, and PWAs combine this with the feel of native applications.

# Lighthouse

[Lighthouse](https://github.com/GoogleChrome/lighthouse) is an open-source auditing tool that you can use to test and improve your webpage. It runs a number of tests and generates a report on how well the page did. You can install Lighthouse as a [Chrome extension](https://github.com/GoogleChrome/lighthouse#install-chrome-extension) or use its [Node CLI tool](https://github.com/GoogleChrome/lighthouse#install-cli-).

Here's a snippet of the report before I added a number of progressive elements to the app.

![Lighthouse Report](assets/progressive-angular-applications/lighthouse-before.png){: .article-image-with-border }

The report consists of a number of audits that validate the aspects of a PWA. Let's go over each of these audits and how we can improve each of these areas in our application.

**Note: This tutorial will reference my Hacker News client as we add a number of different tools to improve it. However, you can easily follow along and include each tool in your app if you already have an application built with Angular CLI. If you don't and would like to know how, my [previous post]({{ site.url }}/angular2-hacker-news) can help.**

# Network connection is secure

A number of progressive web technologies, such as service workers (which we'll go over in a bit), require a **HTTPS** connection in order to work. The '**S**' at the end, which stands for secure, ensures that the content that you retrieve is secure and cannot be tampered with.

There are a number of hosting platforms that are protected with HTTPS by default which makes it easy to have your website or application protected. Our Hacker News client is hosted on Firebase and this website is hosted on Github Pages: both allow **HTTPS** encryption.

I also wrote a [post]({{ site.url }}/continuous-integration-angular-firebase-travisci) that explains how you can deploy your Angular CLI app with Firebase so please take a look if you're interested.

# Page load performance is fast

Let's take a look at how our app loads without any configuration. To represent mobile users more fairly, we'll use simulated conditions of **a 3G Network** and **a CPU Throttle of 2X slower** thanks to Chrome's Developer Tools.

![Network - No Configuration](assets/progressive-angular-applications/network-first.png){: .article-image }

Humans are impatient creatures, and [53% of us will give up if a site takes longer than 3 seconds to load](https://developers.google.com/web/progressive-web-apps/#fast). Even under these simulated conditions, no webpage should take this long to load if we can prevent it.

## Ahead-of-Time compilation

Components, along with their HTML templates, are the foundation of any Angular application. By default, this is all converted into viable JavaScript when you run the application in the browser. In other words, compilation happens **_Just-in-Time_**.

One way we can make an Angular app load faster is to run its compiler under **_Ahead-of-Time_** conditions. This means that the compiler only runs once during the build step. The app does not have to compile when you try to load it in the browser.

With Angular CLI, creating a production build is as simple as a terminal command.

```bash
ng build --prod
```

Creating a production build with AOT compilation is also just as simple (this really goes to show the amazing work the CLI team has done to make our lives easier).

```bash
ng build --prod --aot
```

And that's it. Now let's see how our app loads under the same conditions.

![Network - Ahead-of-Time](assets/progressive-angular-applications/network-aot.png){: .article-image }

The app now loads 55% faster. That's a pretty big difference for such a quick adjustment. The bundled file sizes were also reduced by [roughly 40%](https://twitter.com/beeman_nl/status/808180209719582720).

**Note: If you would like to understand how AOT works in more detail, Juri does an awesome job explaining it in this [screencast](https://juristr.com/blog/2016/12/configure-aot-with-angular-cli/).**

## Application Shell

An application shell (or App Shell) is the minimal HTML, CSS and JS responsible for providing the user with the _shell_ of the user interface. A toolbar is a good example of something that would be encapsulated in this shell. In a PWA, the App Shell can be cached so it loads as quickly as possible when a user decides to return to the webpage. With this, we can provide the user with something meaningful **immediately** even if the actual content has not rendered yet.

![App Shell](assets/progressive-angular-applications/app-shell-content.png){: .article-image-with-border }

We can see that the App Shell in this application just consists of a header, navigation and loading icon that shows while the content is being fetched over the network. To cache our shell in order to load faster on repeat visits, we'll need to add a **Service Worker** to our application.

## Service Worker

A service worker is a script that runs in the background of your browser when you view a webpage. It is entirely separate from the webpage itself and can only communicate with it.

We can register a service worker to our application by adding the following to `index.html`.

```javascript
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
```

All this does is check to see if the browser supports service workers and if so, register it's file path. Let's run our application locally with `ng serve` or `ng serve --prod`, open it in a Chromium browser (Google Chrome, Firefox or Opera) and check the console.

![App Shell](assets/progressive-angular-applications/service-worker-fail-local.png){: .article-image-with-border }

We can see that it can't retrieve the service worker file, `service-worker.js`, since it doesn't exist. There's a few ways we can set up this file:

1.  Create the file and write out the logic to open a cache, cache all the static files (HTML, CSS, JS, images, etc..) and return the cached resources when the user returns to the page. Here's an [excellent introduction](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) to setting up a service worker.
2.  Use **Service Worker Precache**.

## Service Worker Precache

[Service Worker Precache](https://github.com/GoogleChrome/sw-precache#service-worker-precache) (`sw-precache`) is a module that generates a service worker responsible for caching all the static resources in your application. It integrates right into the build system you're using and, with some simple configurations, creates the service worker on the fly. We can begin by installing its package.

```bash
npm install --save-dev sw-precache
```

Now in your `package.json` file, let's add a `precache` script that runs a simple command: `sw-precache`.

```json
"scripts": {
"ng": "ng",
"start": "ng serve",
"lint": "tslint \"src/\*_/_.ts\"",
"test": "ng test",
"pree2e": "webdriver-manager update --standalone false --gecko false",
"e2e": "protractor",
"precache": "sw-precache"
}
```

Now just run the following script.

```bash
npm run precache
```

![Service worker output](assets/progressive-angular-applications/service-worker-output.png){: .article-image-with-border }

It generates a `service-worker.js` file right in your root folder. You can see the output also includes the total size and number of assets that are cached. This corresponds to the total number of resources that your application shell contains.

Furthermore, if you take a look at the actual file, you'll see logic that `installs` and `activates` your service worker. You can also find where it caches and returns requests (`fetch` event).

Now this is all pretty cool and everything, but having the service worker in the root of our application isn't going to help us. This is because when you run a production build with the CLI (`ng build --prod` or `ng build --prod --aot`), it generates the compiled, bundled and minifed code in a `dist/` subdirectory which we deploy and host. We can update our `precache` script to make this happen.

```json
"scripts": {
// ...
"precache": "sw-precache --root=dist --verbose"
}
```

Now running the script should generate the service worker right inside the `dist/` directory. We've added `verbose` so we can see a logged output in the terminal for each and every resource that's precached. Let's run `ng build --prod --aot` to set up a production build followed with `npm run precache`.

![Service worker dist output](assets/progressive-angular-applications/service-worker-dist-output.png){: .article-image-with-border }

We can see that our service worker file was generated in the `dist/` folder which is perfect. We can also see that each and every static resource in our dist folder is precached by default. This is a bit overkill since not every one of those files are requested when you run the application. Now if we wanted to just precache our HTML files, we can use the following command instead.

```json
"scripts": {
// ...
"precache": "sw-precache --root=dist --verbose --static-file-globs='dist/\*\*.html'"
}
```

We're adding quite a bit to our script now. To make things simpler, we can set up a separate file to specify what configurations we would like for our service worker. Let's create a `sw-precache-config.js` file right at the root of our application and move our current configurations there.

```javascript
module.exports = {
  staticFileGlobs: ['dist/**.html'],
  root: 'dist',
};
```

We can now simplify our script to just refer to that file.

```json
"scripts": {
// ...
"precache": "sw-precache --verbose --config=sw-precache-config.js"
}
```

Now let's run `npm run precache` once more.

![Service worker dist HTML](assets/progressive-angular-applications/service-worker-only-html.png){: .article-image-with-border }

As expected, the only HTML file in our production folder, `index.html`, is cached. Remember that Angular is a Single Page Application, where the final output consists of a single HTML file that dynamically changes based on the JavaScript we have. Now that we have a decent understanding of how `sw-precache` allows us to set up a service worker, let's add some more configurations to `sw-precache-config.js`.

```javascript
module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/assets/images/*',
    'dist/assets/icons/*',
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html',
};
```

1.  We can precache all our static files (HTML, JS and CSS) along with our assets folder which contains our icons and images (we'll go over generating icons for our application in a bit)
2.  Since our built app lives solely in the `dist` folder, we use `stripPrefix` to remove it from the beginning of any file paths that may be referenced
3.  When the app attempts to fetch a request not found in the cache, we use `navigateFallback` to set `index.html` as our _fallback_ (couldn't think of another word :P)

Now that we have all our static resources set up for precaching, we need to make sure to generate our service worker right before we deploy the app to our hosting platform. For example, if we were hosting our application on Firebase, we would do the following:

1.  `ng build --prod --aot`
2.  `npm run precache`
3.  `firebase deploy`

Once deployed, let's take a look at the network requests when we load the application **on a repeat visit**.

![Requests with sw-precache](assets/progressive-angular-applications/requests-sw-precache.png){: .article-image-with-border }

You can see that every precached resource was retrieved from the service worker! The only data transferred was our third party call to get the list of stories from the Hacker News API. Let's take a look at the captured sequences on reload.

![Network with sw-precache](assets/progressive-angular-applications/network-sw-precache.png){: .article-image }

Not bad at all. You can see that the static resources load a lot faster since they're now being retrieved from the service worker. This significantly reduces our [Time to Interactive](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive).

## Service Worker Webpack Plugin

To make this entire procedure a lot simple, there's a Webpack plugin for service workers, [`SWPrecacheWebpackPlugin`](https://www.npmjs.com/package/sw-precache-webpack-plugin), that you can include in your Webpack configuration. When I built this application, Angular CLI [did not support](https://github.com/angular/angular-cli/issues/1656) overriding Webpack configurations. However, the team has recently included the ability to [eject](https://github.com/angular/angular-cli/blob/3ad2856b27889a50a742c9dca9554a190c8509bf/CHANGELOG.md#100-beta32-2017-02-17) and modify your configurations so using this plugin may probably make things even smoother (and I look forward to trying this soon).

## Continuous Integration

It's important to remember that because we're doing this manually, we need to make sure we generate our service worker every time we create a new build. For example, this app is hosted on Firebase and I use a simple command line, `firebase deploy` to host `dist/`. So that means I need to always run the following in order when I make updates to my app.

1.  `ng build --prod --aot`
2.  `npm run precache`
3.  `firebase deploy`

There's been quite a few times I forgot to run that command, so I set up a simple continuous integration script that automatically runs a build, generates a new service worker and deploys to Firebase every time I just `push` to my repository. My previous [post]({{ site.url }}/continuous-integration-angular-firebase-travisci) explains how I set this up as well.

# App can load on offline/flaky connections

Now that we understand how we can set up an App Shell using `sw-precache`, let's look at another important factor of progressive web applications, **working with unavailable or poor network connections**. We'll be using another library for this, [Service Worker Toolbox](https://github.com/GoogleChrome/sw-toolbox) (`sw-toolbox`).

Although this is a different tool, `sw-precache` is capable of including this just by adding a new configuration, `runtimeCaching`, to our config file. Although this may [change in the future](https://github.com/GoogleChrome/sw-precache/issues/147), this lets us easily integrate dynamic network caching into our service worker.

<blockquote>
  <p>We wanted to make it easier for developers to use the two libraries together. Because sw-precache has to be directly integrated with your build environment and must be responsible for outputting your top-level service worker file, it made the most sense as an integration point to give sw-precache the ability to include the sw-toolbox code and configuration alongside its own configuration.</p>
  <footer><a href="https://github.com/GoogleChrome/sw-precache/blob/master/sw-precache-and-sw-toolbox.md">sw-precache? sw-toolbox? What's the difference?</a></footer>
</blockquote>

## runtimeCaching

Let's look at how we can add this configuration to `sw-precache-config`.

```javascript
runtimeCaching: [
  {
    urlPattern: /node-hnapi\.herokuapp\.com/,
    handler: 'networkFirst',
  },
];
```

And that's pretty much all I needed to do for my application. The configuration consists of an array with each object referencing a separate `urlPattern`. You can see that I have a **RegExp** here referencing the [unofficial API](https://github.com/cheeaun/node-hnapi) I'm using to power my application. You can also use a string among other route types (the [docs](https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage.html) give a clear overview of the different route styles you can use).

`handler` is also required and you can see that I'm using `networkFirst`. There are a total of five built-in handlers that allow you to modify your network strategy. For `networkFirst`, the toolbox will try to handle the request first by retrieving from the network and if that succeeds, it will **cache the response**. When this fails (flaky/unavailable network), it will fetch directly from the cache.

The [documentation](https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-api.html) also explains the different handler types clearly. To get a better understanding of each of the network strategies, [The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/) is an excellent read.

Now when we run the application offline, requests previously fetched are now retrieved from the cache. This means that the user can now use the app with pages they have previously visited.

![Network with sw-toolbox](assets/progressive-angular-applications/network-sw-toolbox.png){: .article-image-with-border }

Someone was nice enough to open an [issue](https://github.com/{{site.github_username}}/angular2-hn/issues/21) and mention that for failing requests (both cache and network), it makes more sense to show an error message instead of a loading indicator. Consider the following two scenarios:

1.  The API fails through the network and is not cached (first-time viewing that page)
2.  The API works, however the user is offline but navigates to a page that they have not yet visited

In either of these scenarios, an appropriate warning message would be nice so the user isn't confused when nothing is loading, **especially on a mobile device**.

![Request error message](assets/progressive-angular-applications/request-error-message.png){: .article-image-with-border .fix-small }

{:CSS Skull: .image-source}
[Awesome minimalist skull CSS](https://codepen.io/MyXoToD/pen/HFeda) by [Max](https://codepen.io/MyXoToD/) on Codepen
{: CSS Skull}

# Site is progressively enhanced

One of the primary principles behind progressively enhanced web pages is that anyone and everyone should be able to access its basic content at the very least. So far we've overlooked those who browse the web with _JavaScript disabled_.

## Working without JavaScript

Some think that always developing an application for users with their JavaScript disabled [doesn't make much sense](http://tomdale.net/2013/09/progressive-enhancement-is-dead/). If you think about it, SPA's _rely_ on client JS in order to work. That's how we end up with a single `index.html` file that dynamically changes based on user events.

But how would we go about having a SPA to work without client side JS in the first place? We can do this by **server-side rendering** some (or all) of our content. [Angular Universal](https://universal.angular.io/) allows us to do this in Angular applications, which can give your application a better perceived performance and make it more SEO friendly.

I haven't had the chance to try this (and hopefully I will soon), but in the meantime we can at least insert a `<noscript>` tag in `index.html` to warn the user that JavaScript is required.

![JS disabled message](assets/progressive-angular-applications/js-disabled.png){: .article-image-with-border }

![Better than nothing](assets/progressive-angular-applications/better-than-nothing.png){: .article-image-with-border }

# Design is mobile-friendly

If you plan on building a web application and not expect any users to access it through their mobile device, than you may not be concerned with how it looks with smaller screens whatsoever. However, more and more users access the web through their phones and if you intend on building an app with progressive enhancement in mind, you most likely want to make sure it sizes correctly to all screen sizes.

In this area, Lighthouse will check to see if your HTML has a `<meta name="viewport">` in order to optimize your app for mobile devices. Fortunately, Angular CLI includes this by default.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

# User can be prompted to Add to Homescreen

We can give users the ability to install the application to their homescreen in order to feel more like a native application.

![Installed to homescreen](assets/progressive-angular-applications/app-installed-phone.png){: .article-image .no-padding }

This is done by adding a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), a JSON file that contains specific information about your app. We can begin by adding a `link` to the head of our `index.html`.

```html
<link rel="manifest" href="/manifest.json">
```

Since we need this file as we build our app into the `dist` directory, we'll need to add it as an asset in `angular-cli.json`.

```json
"assets": [
"assets",
"favicon.ico",
"manifest.json"
]
```

Now let's create `manifest.json` in our `src` folder.

```json
{
  "name": "Angular 2 HN",
  "short_name": "Angular 2 HN",
  "icons": [
    {
      "src": "assets/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "display": "standalone",
  "start_url": "./?utm_source=web_app_manifest"
}
```

Many of these configurations are self explanatory, but this [resource](https://developer.mozilla.org/en-US/docs/Web/Manifest) from MDN does a great job explaining each one.

Since our manifest has a `short_name`, a `start_url` and an icon larger than **144px**, our application will show an install banner to prompt the user to install the app to their home page. This banner shows if the user visits your site at least twice with five minutes between each visit.

![App install banner](assets/progressive-angular-applications/install-to-home-screen.png){: .article-image .no-padding }

# Installed web app will launch with custom splash screen

Another thing that a manifest file allows for is a custom splash screen when you open the app through your home screen. This is useful because it can reduce the _perceived_ load time of your application (even if it loads in the same amount of time). To do this, we'll need to flush out our manifest file a little more.

```json
{
  "name": "Angular 2 HN",
  "short_name": "Angular 2 HN",
  "icons": [
    {
      "src": "assets/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/android-chrome-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ],
  "theme_color": "#b92b27",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "./?utm_source=web_app_manifest"
}
```

You can see that we've added two new attributes, `theme_color` and `background_color`. The manifest needs to contain this along with `name` and an icon of at least 192px (we added a new one of 256px) in order to serve a splash screen.

![Mobile splash screen](assets/progressive-angular-applications/mobile-whitebg-combined.png){: .article-image }

## Icons

To simply generate a number of icons needed not just for Android, but for Windows and iOS devices as well, I used [RealFaviconGenerator](http://realfavicongenerator.net/). It shows you how your icons will look in each device as well previews of the splash screen in Android. It then provides the markup you can include in your `index.html` along with all the icons you need (which I put in `assets/icons`).

![Assets icons folder](assets/progressive-angular-applications/assets-icons-folder.png){: .article-image-with-border .fix }

## Installing with iOS

Like Chromium browsers (Chrome, Firefox, Opera) on Android, Safari on iOS allows you to install to homescreen and provide an icon. However, splash screens are not supported.

Moreover, with the presence of a web manifest, the URL bar is automatically removed giving the user a full-screen experience on Android devices. This is not the case on iOS, but there are [supported meta tags](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html) that we can add to fix this (credits to [Bram Borggreve](https://github.com/beeman), I didn't know this was possible until he put up a PR for this <i class="fa fa-smile-o" aria-hidden="true"></i>). With this, we can have a rich full-screen experience on iOS as well.

![iPhone Demo](assets/progressive-angular-applications/iphone-demo.gif){: .article-image-with-border }

{:full-screen iOS: .image-source}
Recording by Bram Borggreve
{: full-screen iOS}

# Best Practices

Along with audits that measure the aspects of a PWA, Lighthouse provides a list of recommendations to improve your webpage in terms of best practices. Although these don't affect your score, it's still fun/handy to tick them off the list as you work on your application. Some examples:

1.  Site opens external links using `rel="noopener"`
2.  Every image element has an alt attribute

# Conclusion

![Conclusion](assets/progressive-angular-applications/conclusion.png){: .article-image-with-border }

Although Angular Mobile Toolkit may eventually make creating a PWA a smooth and simple process with the CLI, it's still very possible to integrate a number of progressive elements to your application without adding much overhead at all.

I hope this tutorial helped you and if it did, please [tweet it forward](https://twitter.com/intent/tweet?text={{ page.title }}&url={{ site.url }}{{ page.url }}&via={{ site.twitter_username }}&related={{ site.twitter_username }}") and [star the repo](https://github.com/housseindjirdeh/angular2-hn)! You can also [follow me](https://twitter.com/intent/user?screen_name=hdjirdeh) on Twitter if you haven't had enough of me rambling <i class="fa fa-smile-o" aria-hidden="true"></i>.

```

```
