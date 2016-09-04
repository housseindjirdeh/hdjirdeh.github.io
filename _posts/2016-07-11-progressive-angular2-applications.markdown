---
layout: post
title:  "Building Hacker News with Angular 2 CLI, Webpack and RxJS Observables"
date:   2016-08-05 9:30:00 -0400
categories: angular2 rxjs webpack
description: If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team has rolled out Angular CLI, a command line interface that makes creating and scaffolding an application significantly easier...
tags:
- angular2
- rxjs
- webpack
comments: true
type: post
image: angular2hn.png
permalink: /:title
---
![angular 2 hn banner](https://files.slack.com/files-pri/T0LA4NDHS-F27HW9N0P/angularhn.jpg "Angular 2 HN Banner"){: .article-image-with-source }

If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team has rolled out [Angular CLI](https://cli.angular.io/), a command line interface that makes creating and scaffolding an application significantly easier.

In this post, we'll build an entire [Hacker News](https://news.ycombinator.com/) client using Angular CLI and RxJS Observables using Webpack as our module loader.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](http://i.imgur.com/6QquRtl.gif "Angular 2 HN Preview"){: .article-image }

Here's a rundown of what we'll be doing.

1. We'll start by building our basic setup first, the front page of Hacker News. <br>
2. We'll then wrap an Observable Data Service to load data asynchronously from the official [Hacker News API](https://github.com/HackerNews/API)<br>
3. To allow the user to see different story types, we'll add navigation using the [Angular Component Router](https://angular.io/docs/ts/latest/guide/router.html).
4. Once we're done, we'll go over bundling and deployment to show you how to get the complete application in production using the [Firebase CLI](https://firebase.google.com/docs/cli/).

This visual tutorial should make you feel more comfortable building an Angular 2 application from small modular parts as well as building an app from scratch all the way to production. As usual, I'll explain what and why we're doing each step as we go along.

Getting Started
==================
Once you have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), you can install the CLI. 

{% highlight bash %}
npm install -g angular-cli
{% endhighlight %}

You can then start your application.

{% highlight bash %}
ng new angular2-hn
cd angular2-hn
ng serve
{% endhighlight %}

Yep, it's that simple. If you now open `http://localhost:4200/`, you'll see the application running. 

![app setup](https://files.slack.com/files-pri/T0LA4NDHS-F27V871NZ/pasted_image_at_2016_09_03_01_51_am.png "App Setup"){: .article-image }

Pretty cool huh? Angular CLI uses [SystemJS](https://github.com/systemjs/systemjs) as the module bundler and loader. Now using SystemJS has its quirks, and this includes long loading times and [a lengthy process just to add third party libraries](https://github.com/angular/angular-cli/wiki/3rd-party-libs). To make things simpler and faster, the Angular CLI team are in the process of moving the build system from [SystemJS to Webpack](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#100-beta11-webpack-2016-08-02)

Although this is not 100% complete, we can still begin using Webpack by upgrading to it's preview build. This will only be necessary since the Webpack migration is still in its alpha stage. Once the team narrows everything down and makes an official release, installing Angular CLI will only use Webpack as its default module loader.

First, you'll need to update globally.

{% highlight bash %}
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@webpack
{% endhighlight %}

Then you'll need to update locally.

{% highlight bash %}
rm -rf node_modules dist tmp typings
npm install --save-dev angular-cli@webpack
{% endhighlight %}

Now if you run `ng serve`, you should see the app launch once again.

NgModule
==================
For this application, we'll be using [Angular's RC5 release](http://angularjs.blogspot.se/2016/08/angular-2-rc5-ngmodules-lazy-loading.html). Quite a few changes have been made for the update to RC5, but the biggest one would most probably be the introduction of `@NgModule`. Let's take a quick look at our `app.module.ts` file.

{% highlight javascript %}
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{% endhighlight %}

So what exactly is happening here? The `@NgModule` decorator specifies all declarations (components, directives and pipes), library imports (such as `FormsModule` and `HttpModule`) and providers (a single-instance service for example) that we'll be using in our application. 

You can probably already see how much more organized it is to not need to specify all our module-level components, directives, pipes and so forth in each of our components.

Let's get ready to rumble
==================
Let's set up [Sass](http://sass-lang.com/) as our CSS preprocessor. For a project that has already been set up, we can do this with the following command.

{% highlight bash %}
ng set defaults.styleExt scss
{% endhighlight %}

Now that we have everything set up, we can create our first few components. To start things off, we'll create a `HeaderComponent`.

{% highlight javascript %}
ng g component Header
{% endhighlight %}

You'll notice that a `header` folder is immediately created and scaffolded. Take a look at `app.module.ts` once again and you'll notice that it is now declared there as well.

{% highlight javascript %}
// ...
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
//...
{% endhighlight %}

If you take a look at `header.component.ts`, you can see that its component selector is `app-header`. Let's add this in our root component.

{% highlight html %}
<!-- app.component.html -->

<app-header></app-header>
{% endhighlight %}

Running the application will show you that the header component loads successfully.

![header loads](https://files.slack.com/files-pri/T0LA4NDHS-F2804R2V9/pasted_image_at_2016_09_03_02_20_pm.png "Header Loads"){: .article-image }

Sweet, now let's add some markup and styling to both the root and header components.

Our app component.

{% highlight html %}
<!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
</div>
{% endhighlight %}

The styling for `app.component.scss` can be found [here](). And now let's work on the header. 

{% highlight html %}
<!-- header.component.html -->

<header id="header">
  <a class="home-link" href="/">
    <img class="logo" src="/assets/images/angular2-hn.png">
  </a>
  <div class="header-text">
    <div class="left">
      <h1 class="name">
        <a href="/">Angular 2 HN</a>
      </h1>
      <span class="header-nav">
        <a href="">new</a>
        <span class="divider">
          |
        </span>
        <a href="">show</a>
        <span class="divider">
          |
        </span>
        <a href="">ask</a>
        <span class="divider">
          |
        </span>
        <a href="">jobs</a>
      </span>
    </div>
    <div class="info">
      Built with <a href="https://cli.angular.io/" target="_blank">Angular CLI</a>
    </div>
  </div>
</header>
{% endhighlight %}

And similarly, you can find the styling for this component [here](). Running the application gives us the following result.

![header](https://files.slack.com/files-tmb/T0LA4NDHS-F28351WRG-36a0aaf209/pasted_image_at_2016_09_03_10_04_pm_1024.png "Header"){: .article-image }

View Encapsulation
==================
Since we're trying to make this application as responsive as possible to give it a native feel, it's important to check how it looks with different screen sizes regularly. Let's adjust our viewport to see how it would look on a mobile device.

![header mobile](https://files.slack.com/files-pri/T0LA4NDHS-F282PJG06/pasted_image_at_2016_09_03_10_26_pm.png "Header Mobile"){: .article-image }

As you can see, there seems to be an offset from the edge of the page. This is because the **body** element has a bult-in offset (through `margin`) that shows in almost all modern browsers. 

![body margin](https://files.slack.com/files-pri/T0LA4NDHS-F28377QGJ/pasted_image_at_2016_09_03_10_39_pm.png "body margin"){: .article-image }

But if you take a look at `app.component.scss`, we explicity set `margin: 0` for screen sizes less then 768px.

{% highlight css %}
// app.component.scss

$mobile-only: "only screen and (max-width : 768px)";

body {
  margin-bottom: 0;

  @media #{$mobile-only} {
    margin: 0;
  }
}

// ...
{% endhighlight %}

So why isn't this rendering the way it should? This is because Angular *encapsulates* CSS styles onto a component. I won't be going into too much detail, but there are three different ways Angular does this.

- `None`: Angular doesn't do anything. No encapsulation and no Shadow DOM, this is just like adding styles regularly. Adding a style will apply to the entire document.
- `Emulated`: Angular *emulates* Shadow DOM behaviour. This is defaulted.
- `Native`: Angular uses the browser's native Shadow DOM completely.

In our root component, we're trying to add styles to the `body` element which really doesn't make sense if you think about it. Our root component is within `body`, not the other way around, hence why it's styles will not be affected. We can work around this by telling Angular to not do any view encapsulation in this component whatsoever.

{% highlight javascript %}
// app.component.ts

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
}
{% endhighlight %}

Take a look at our application once more and you'll notice that the styles have now been applied to `body`. This is because all of the styles in this component now affect the entire document. (warning)*

![header fixed](https://files.slack.com/files-pri/T0LA4NDHS-F283AD90A/pasted_image_at_2016_09_03_11_33_pm.png "Header Fixed"){: .article-image }

Multiple Components
==================
Let's create two more components, `Stories` and `Footer`. Stories represent posts in Hacker News, so our `Stories` component will just contain the ordered list of posts. We'll start out with a skeleton just to get an ordered list in place.

{% highlight bash %}
ng g component Stories
{% endhighlight %}

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol start="0">
    <li *ngFor="slice:0:0 + 30; let i = index" class="post">
      Story #{{i}}
    </li>
  </ol>
  <div class="nav">
    <a href="" class="prev">
      ‹ Prev
    </a>
    <a href="" class="more">
      More ›
    </a>
  <div>
</div>
{% endhighlight %}

Click [here]() to take a look at the CSS for `Stories`. Our footer is straightfoward (and it's Sass file can be found [here]()).

{% highlight bash %}
ng g component Footer
{% endhighlight %}

{% highlight html %}
<!-- footer.component.html -->

<footer id="footer">
    <p>Show this project some ❤ on <a href="https://github.com/hdjirdeh/angular2-hn" target="_blank">GitHub</a></p>
</footer>
{% endhighlight %}

We'll need to update our root component to show these components.

{% highlight html %}
!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
  <app-stories></app-stories>
  <app-footer></app-footer>
</div>
{% endhighlight %}

Let's see what our page is looking like.
