---
layout: post
title:  "Progressive Web Apps with Angular: Part 3 - Angular Service Worker"
date:   2018-08-06 07:30:00
description: In Part 1 of this series, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. Some of these enhancements included adding a service worker to allow for faster repeat visits and improved reliability for poor network connections. Instead of using a third-party library, we'll explore how to add service worker functionality using a built-in Angular package, `@angular/service-worker`, in this article.
type: post
image: assets/progressive-angular-applications-2/banner.jpg
permalink: /:title
published: false
---
In [Part 1]({{ site.url }}/progressive-angular-applications) of this series, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. Some of these enhancements included adding a service worker to allow for faster repeat visits and improved reliability for poor network connections. Instead of using a third-party library, we'll explore how to add service worker functionality using a built-in Angular package, `@angular/service-worker`, in this article.

<aside>
<p>Angular CLI version 6.0.3 is used in this article. If you happen to be using a much later version, please keep in mind that there may have been some changes to the API.</p>
</aside>

## The breakdown

In this article, we'll be adding a service worker to [Tour of Thrones](https://tour-of-thrones.firebaseapp.com/), an Angular app that lists houses from the Game of Thrones series.

<img alt="Tour of Thrones" title="Tour of Thrones" data-src="/assets/progressive-angular-applications-3/tour-of-thrones.png" class="lazyload shadow" />

<div class="flex items-center justify-center h3">
  <a class="f6 fw6 link dim ph3 pv2 mb2 dib white bg-red ttu br2 mr2" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="f6 fw6 link dim ph3 pv2 mb2 dib white bg-red ttu br2" href="https://github.com/gitpoint/git-point">Source Code</a>
</div>

We explored how to build this application from scratch in [Part 2]({{ site.url }}/progressive-angular-applications-2) of the series as well as add some lazy loading capabilities. If you are interested, feel free to read that article as well! 

## The case for Progressive Angular

A lot has changed in the Angular ecosystem in the past year and there have been significant improvements to the toolchain to simplify the process of building a PWA. Let's take a look at some of the things that have changed:

* With the release of version 4.0, Angular introduced View Engine as an update to its rendering pipeline. This was done to improve how builds were created with Ahead-of-Time (AOT) compilation in order to generate smaller bundle sizes. In some cases, reductions greater than 50% were noticed.
* Development on [Angular Mobile Toolkit](https://github.com/angular/mobile-toolkit), which was accessed using the `--mobile` flag when creating a new project with Angular CLI, was [discontinued](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). This was done in favour of baking progressive technologies (such as `@angular/service-worker`) directly into the CLI.
* [Ivy](https://github.com/angular/angular/issues/21706), the third rendering engine for the platform, is currently under development. Again, the idea here is to simplify the development of faster and smaller-sized applications without introducing _any_ breaking changes whatsoever.

Aside from updates to Angular tooling, there have also been changes to other external libraries as well. When Part I of this article was released, Angular's service worker efforts were still in progress under the Mobile Toolkit project. For that reason, we went with caching static and dynamic assets using the [`sw-precache`](https://github.com/GoogleChromeLabs/sw-precache) and [`sw-toolbox`](https://github.com/GoogleChromeLabs/sw-toolbox) libraries respectively. Although both these libraries still exist, the Google Chrome team have worked on developing [Workbox](https://developers.google.com/web/tools/workbox/), a newer collection of tools aimed to simplify the process of adding offline support to web applications. 

<aside>
<p>I explain how to use Workbox's CLI tool in a <a href="{{ site.url }}/thinking-prpl#service-workers">separate post</a> if you happen to be interested.</p>
</aside>

## Service Worker

Although we explain the concept behind service workers in Part 1, we'll explain things again here. A _service worker_ is a script that runs in the background of your browser when you view a webpage. It is a web worker and acts completely separate from the webpage itself. It can only communicate with it.

By intercepting network requests, service workers can act like a proxy between the browser and the network it interfaces with. This can be useful to _cache_ certain files or data for later use. The first types of resources we can consider for this use case are the files that make up our *Application Shell*. This represents the shell of the UI of an application.

<img alt="Flipkart App Shell" title="Flipkart App Shell" data-src="/assets/progressive-angular-applications-3/flipkart-app-shell.png" class="lazyload" />

{:Flipkart App Shell: .image-source}
[Flipkart App Shell](https://www.flipkart.com/)
{: Flipkart App Shell}

Having a service worker cache the files that make up this shell can allow for faster repeat visits. This is because the browser can now retrieve these assets from the service worker rather than make the trip to the network.

Service workers also allow us to cache third-party content that can change over time. An example of this could be the list of top stories you see when you open [Hacker News](https://news.ycombinator.com/). By using different caching strategies, we can show stale data to our users when they have a poor/flaky network connection instead of nothing at all.

## Getting Started

In this article, we'll be exploring how to add a service worker to the application we built [Part 2]({{ site.url }}/progressive-angular-applications-2) of this series. Regardless of whether you've read that post or not, the same principles can apply to any Angular application that you are currently building.

We can add a service worker to our application with the following command:

{% highlight bash %}
ng add @angular/pwa
{% endhighlight %}

The CLI command simplifies a lot of the process needed to modify all the necessary files by doing it for you. Let's step through what gets changed, beginning with `package.json`:

{% highlight json %}
// package.json

{
  "name": "tour-of-thrones",
  "version": "0.0.0",
  "scripts": {
    // ...
  },
  "private": true,
  "dependencies": {
    // ...
    "@angular/pwa": "^0.6.8",
    "@angular/service-worker": "^6.0.2"
  },
  "devDependencies": {
    // ...
  }
}
{% endhighlight %}

Two new dependencies are added, `@angular/pwa` and `@angular/service-worker`. A configurations file for the service worker is also created at the root of the application, `ngsw-config.json`:

{% highlight json %}
// ngsw-config.json

{
  "index": "/index.html",
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": [
        "/favicon.ico",
        "/index.html",
        "/*.css",
        "/*.js"
      ]
    }
  }, {
    "name": "assets",
    "installMode": "lazy",
    "updateMode": "prefetch",
    "resources": {
      "files": [
        "/assets/**"
      ]
    }
  }]
}
{% endhighlight %}

You'll notice that a few default configurations are already set up for some assets. We'll come back to this in a bit.

Our root module, `app.module.ts`, is also modified to include the newly generated service worker:

{% highlight javascript %}
// app.module.ts

//...
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const routePaths: Routes = [
  //...
];

@NgModule({
  imports: [
    //...
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  declarations: [
    //...
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
{% endhighlight %}

`ServiceWorkerModule` is used to register a service worker as soon as our application is loaded with the settings defined in our configurations file. An `enabled` flag is used to only have our service worker enabled after a production build. The boolean is obtained from our environment variable files within `environment/`. Development (`environment.ts`) and production (`environment.prod.ts`) environment files are already set up and included into a newly bootstrapped Angular CLI application. Creating a production build with `ng build --prod` will use variables from `environment.prod.ts`.

And that's all that's needed to set up a service worker! A number of other files have also been added or modified to include a site manifest to our application. For progressive web applications, a site manifest includes a number of details about an application in a JSON file and can allow for a smoother experience on mobile. For browsers and devices that support a manifest file, the user can be prompted to add the application to their homescreen as well as have a custom splash screen show during initial loading.

<aside>
<p>If you would like to learn a little more about how web app manifests work, feel free to read my section on it in <a href="{{ site.url }}/progressive-angular-applications#user-can-be-prompted-to-add-to-homescreen">Part 1</a> of this series.</p>
</aside>

The web app manifest file generated is `src/manifest.json`:

{% highlight json %}
{
  "name": "tour-of-thrones",
  "short_name": "tour-of-thrones",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
{% endhighlight %}

A number of base attributes are included here including a number of icon references of different sizes. Each of these icons have also been included to our application in the `assets/icons/` directory.

A new link tag has also been added to `index.html` to link to the manifest file:

{% highlight html %}
<link rel="manifest" href="manifest.json">
{% endhighlight %}

And finally, the manifest file location is added to an `assets` attribute in `angular.json` to ensure that it carries forward to that final build folder:

{% highlight json %}
// angular.json

{
  //...
  "projects": {
    "tour-of-thrones": {
      //...
      "architect": {
        "build": {
            //...          
            "options": {
              //...
              "assets": [
                //...
                "src/manifest.json"
              ],
              //....
           },
          //...
        },
        //...
      }
    },
    //...
  },
}
{% endhighlight %}

### Try it out

The service worker will not work when locally running the application with `ng serve`. You can use any HTTP server (such as `http-server`) to view service worker updates locally.

After deploying the application (or viewing it locally with a local server), reloading the app shows a number of assets being retrieved from the service worker:

<img alt="Service Worker Caching" title="Service Worker Caching" data-src="/assets/progressive-angular-applications-3/service-worker-app-shell.png" class="lazyload shadow" />

## Static asset caching

The HTML, CSS and JS that make up our application are already precached by our service worker, and our default configurations have already set that up:

{% highlight json %}
// ngsw-config.json

{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**"]
      }
    }
  ]
}
{% endhighlight %}

* The `index` attribute is used to identify the index, or root, page of the application.
* `assetGroups` represents an array of resource groups that can be precached. In here, we already have two separate asset groups:
    * `app` is the collection of all the files that make up our application shell
    * `assets` consists of all the files within the `assets` directory 
    
For each asset group, two other fields are also used to identify how to handle installing and updating them. 

* `installMode` is used to determine how to cache these assets as soon as the application loads.
    * A value of `prefetch` means each of these assets are requested by the service worker and cached as soon as the application loads, regardless of whether they are actually being used for the current page. This ensures these files are cached immediately and they can be retrieved even if the network connection fails.
    * `lazy` does not immediately cache these files, but only caches them as they are requested by the browser. This is more useful for resources that do not need to be immediately cached.
* `updateMode` is used to determine how to update an already cached resource.
  * If `prefetch` is used, the service worker will go ahead and update that resource as soon as possible
  * `lazy` only updates the resource if another request is made for it. This can only be used if `installMode` is also `lazy`.

## Dynamic asset caching

If you try running the Tour of Thrones application now with the base service worker configurations set up offline, you'll notice that the assets that make up our app shell still load:

<img alt="App Offline" title="App Offline" data-src="/assets/progressive-angular-applications-3/offline.png" class="lazyload" />

We haven't handled the failed API request to retrieve the list of houses and that explains why that request just fails normally without a working network connection. We can take care of caching results from dynamic resources using a `dataGroups` attribute in our service worker settings file:


{% highlight json %}
// ngsw-config.json

{
  "index": "/index.html",
  "assetGroups": [
    //...
  ],
  "dataGroups": [
    {
      "name": "iceandfire",
      "urls": ["/houses"],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1d",
        "timeout": "1m",
        "strategy": "performance"
      }
    }
  ]
}
{% endhighlight %}

The `cacheConfig` attribute allows us to control how we would like to cache a specific data group by defining the maximum number of cached entries (`maxSize`), the maximum length of time a resource can be cached (`maxAge`) and how long a service worker can wait for a request to complete before timing out and relying on the cached resource (`timeout`). The `strategy` attribute allows us to define one of two separate network caching strategies:

* `performance`: If a resource has a cached version, display that to the user instead of serving the result from the network. This allows for faster results but is more suited to data that is not supposed to change frequently.
* `freshness`: Fetch the results from the network and if that happens to fail, than serve cached information to the user. This is more suited for data groups that change often and adds a safeguard for when the user has no working network connection.

If you try reloading the application offline with these settings, you'll notice that cached data from the third party API request made to retrieve the list of houses will show:

<img alt="App offline with dynamic caching" title="App offline with dynamic caching" data-src="/assets/progressive-angular-applications-3/offline-with-dynamic-caching.png" class="lazyload" />

It's important to remember that we have an infinite scrolling pattern applied to our application where paginated responses from the `houses/` endpoint are fired. If you scroll to a certain point with a working network connection, that same point can be reached with the application opened offline since all those API requests from the same location have been cached. 

<aside>
<p>For more detail on all the possible service worker configuration settings, take a look at the <a href="https://angular.io/guide/service-worker-config">documentation.</a></p>
</aside>

## Conclusion

Hopefully this has been a useful read on getting a service worker up and running for your Angular application. As always, please don't hesitate to reach out if you have any questions, comments, or suggestions!
