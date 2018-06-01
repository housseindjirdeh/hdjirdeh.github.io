---
layout: post
title:  "Progressive Web Apps with Angular (Part II)"
date:   2017-01-17 07:30:00
categories: angular progressive web app javascript
description: In Part I of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This post will dive into building a PWA using Angular version 6.0 in order to understand how to use newer technologies provided by the platform....
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: assets/progressive-angular-applications-2/banner.jpg
permalink: /:title
---

![Progressive Angular Banner](assets/progressive-angular-applications-2/banner.jpg 'Progressive Angular Banner'){: .article-image-with-border }

In [Part I]({{ site.url }}/progressive-angular-applications) of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This post will dive into building a PWA using Angular version 6.0 in order to understand how to use newer technologies provided by the platform.

# The breakdown

In this post, we'll explore how to build a relatively small application called **Tour of Thrones**.

![Tour of Thrones](assets/progressive-angular-applications-2/tour-of-thrones.png 'Tour of Thrones'){: .article-image-with-border }

<div class="button-center">
  <a class="blog-button" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/tour-of-thrones">Source Code</a>
</div>

The app will use [An API of Ice and Fire](https://anapioficeandfire.com/) (an unofficial, community-built API for Game of Thrones) to list houses from the book series and provide information about them. While building the application, we'll explore a number of topics including:

* Bootstrapping an application with Angular CLI
* Workbox
* Angular Service Worker
* Auxillary routes
* Lazy loading

<aside>
  <p>If you happen to be a fan of the book series and/or show, there are no spoilers in this application or article if you happen to be concerned :).</p>
</aside>

# The case for Progressive Angular

A lot has changed in the Angular ecosystem in the past year and there have been significant improvements to the toolchain to simplify the process of building a PWA. Let's take a look at some of the things that have changed:

* With the release of version 4.0, Angular introduced View Engine as an update to its rendering pipeline. This was done to improve how builds were created with Ahead-of-Time (AOT) compilation in order to generate smaller bundle sizes. In some cases, reductions greater than 50% were noticed.
* Development on [Angular Mobile Toolkit](https://github.com/angular/mobile-toolkit), which was accessed using the `--mobile` flag when creating a new project with Angular CLI, was [discontinued](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). This was done in favour of baking progressive technologies (such as `@angular/service-worker`) directly into the CLI.
* [Ivy](https://github.com/angular/angular/issues/21706), the third rendering engine for the platform, is currently under development. Again, the idea here is to simplify the development of faster and smaller-sized applications without introducing _any_ breaking changes whatsoever.

Aside from updates to Angular tooling, there have also been changes to other external libraries as well. When Part I of this article was released, Angular's service worker efforts were still in progress under the Mobile Toolkit project. For that reason, we went with caching static and dynamic assets using the [`sw-precache`](https://github.com/GoogleChromeLabs/sw-precache) and [`sw-toolbox`](https://github.com/GoogleChromeLabs/sw-toolbox) libraries respectively. Although both these libraries still exist, the Google Chrome team have worked on developing [Workbox](https://developers.google.com/web/tools/workbox/), a newer collection of tools aimed to simplify the process of adding offline support to web applications. We'll briefly cover this library later in this article.

# Getting Started

Before we continue talking about libraries and tooling in more detail, let's start building our application. If we already have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), we can proceed to installing the CLI if we haven't already:

{% highlight bash %}
npm install -g @angular/cli
{% endhighlight %}

We can then create a new application:

{% highlight bash %}
ng new tour-of-thrones --style=scss
cd tour-of-thrones
npm start
{% endhighlight %}

Adding `--style=scss` bootstraps our application with predefined Sass files for styling. You should now see the "Hello World" of our app.

![Hello World](assets/progressive-angular-applications-2/hello-world.png 'Hello World'){: .article-image-with-border }

Our application will consist of two parts:

* A `home` base route that lists all the Game of Thrones houses:

![Home Route](assets/progressive-angular-applications-2/home-route.png 'Home Route'){: .article-image-with-border }

* A `house` auxillary route that shows information for a particular house in a modal:

![House Route](assets/progressive-angular-applications-2/house-route.png 'House Route'){: .article-image-with-border }

## Base Route

Let's begin by building the first few components in our application, starting with the `HeaderComponent` which responsible for showing the name of the app in our `home` route. We'll create a separate `components/` directory to contain this component among others:

{% highlight html %}
<!-- src/app/component/header/header.component.html -->

<div id="header">
  <div class="item"></div>
  <h1>
    Tour Of Thrones
  </h1>
  <div class="item">
    <i class="arrow down"></i>
  </div>
</div>
{% endhighlight %}

{% highlight javascript %}
// src/app/component/header/header.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
{% endhighlight %}

You can get the styles for the component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/header/header.component.scss).

To simplify how we import components throughout the application, we can have named exports in the same directory for each component in an `index.ts` file:

{% highlight javascript %}
// src/app/component/header/index.ts

export { HeaderComponent } from './header.component';
{% endhighlight %}

Similarly, we can re-export these components one level higher in an `index.ts` file within the `components/` directory:

{% highlight javascript %}
// src/app/component/index.ts

export { HeaderComponent } from './header';
{% endhighlight %}

<aside>
  <p> Normally, we would import multiple components from other files to a parent component in this manner:</p>

<figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-a'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentB <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-b'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-c'</span><span class="token punctuation">;</span></code></pre></figure>
  
  <p><code>index.ts</code> files that re-export components (or any exports) are sometimes referred to as <i>barrel</i> files and allow us to simplify how we can import exports into something like this:</p>

  <figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA<span class="token punctuation">,</span> ComponentB<span class="token punctuation">,</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component'</span><span class="token punctuation">;</span></code></pre></figure>

  <p>There is no <i>correct</i> way to export and import modules/components/services/etc... in an application and it is always a matter of preference. However, we'll be using this pattern throughout this article.</p>
</aside>

By default, Angular CLI allows us to import from different files using absolute imports (for example: `import ComponentA from 'src/app/component'`). Since all of our files live within the `app` directory, we can modify our `baseUrl` in `tsconfig.json` to import directly from `app` and not `src/app`:

{% highlight javascript %}
// tsconfig.json

{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "src",
    // ...
  }
}
{% endhighlight %}

The only component (`app.component.ts`) and module (`app.module.ts`) scaffolded when we created the project live in the `src` directory. Let's modify `AppComponent` to include `HeaderComponent`:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
</div>
{% endhighlight %}

You can see the styling for this component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/app.component.scss).

In order to be able to reference this component in `AppComponent`, we also have to make sure it's _declared_ in `AppModule`:

{% highlight javascript %}
// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HeaderComponent } from 'app/component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
{% endhighlight %}

The last thing we'll do here before taking a quick look at our progress so far is add some global styles to our application which also includes our font. All global styles in an Angular application go to the `styles.scss` file at the root of the `src/` directory and you can copy them over [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/styles.scss).

<aside>
  <p>If you want to use the same Game of Thrones font (created by <a href="https://charliesamways.carbonmade.com/">Charlie Samways</a>), make sure to download it <a href="https://charliesamways.carbonmade.com/projects/4420181#7">here</a> (it is free for personal use). Otherwise, feel free to remove the <code>@font-face</code> in the styles file.</p>
</aside>

If you want to use the same Game of Thrones font (created by ), make sure to download it 
