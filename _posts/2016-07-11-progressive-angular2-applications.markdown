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
3. To allow the user to see different story types, we'll add navigation using the Angular Component Router.
4. Once we're done, we'll go over bundling and deployment to show you how to get the complete application in production using the [Firebase CLI](https://firebase.google.com/docs/cli/).

This visual tutorial should make you feel more comfortable building an Angular 2 application from small modular parts as well as building an app from start all the way to production. As usual, I'll explain what and why we're doing each and every step as we go along.

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

![app setup](https://files.slack.com/files-tmb/T0LA4NDHS-F27V871NZ-c531c0b4a6/pasted_image_at_2016_09_03_01_51_am_720.png "App Setup"){: .article-image }

Pretty cool huh? Angular CLI uses [SystemJS](https://github.com/systemjs/systemjs) as the module bundler and loader. Now using SystemJS has its quirks, and this includes long loading times and [a lengthy process just to add third party libraries](https://github.com/angular/angular-cli/wiki/3rd-party-libs). To make things simpler and faster, the Angular CLI team are in the process of moving the build system from [SystemJS to Webpack!](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#100-beta11-webpack-2016-08-02)

Although this is not 100% complete, we can still begin using Webpack by upgrading to it's preview build. This will only be necessary since the Webpack migration is still in its alpha state. Once the team narrows everything down and makes an official release, installing Angular CLI will only use Webpack as its default module loader.

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

Understanding RC5
==================
For this application, we'll be using [Angular's RC5 release](http://angularjs.blogspot.se/2016/08/angular-2-rc5-ngmodules-lazy-loading.html). Quite a few changes have been made for the update to RC5, but the biggest one would most probably be the introduction of `@NgModule`. Let's take a quick look at our `app.module.ts` file.

{% highlight javascript %}
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

So what exactly is happening here? The `@NgModule` decorator is specifying all the declarations (components, directives and pipes), library imports (such as `FormsModule` and `HttpModule`) and providers (a single-instance service for example) that we'll be using in our application. 

You can probably already see how much more organized it is to not need to specify all our module-level components, directives, pipes and so forth in each of our components.

Let's get ready to rumble
==================
Let's set up [Sass](http://sass-lang.com/) as our CSS preprocessor. We can do this for the following command for a project that's already been set up.

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











* They are **progressive**, meaning that they work for every user in every browser
* Although they may provide a mobile-like experience, they are **responsive** and work on every device and every screen size
* Push notifications, background syncing and offline capability are all features that can be included
* They can be **installed** to the home screen of your device
* They can be accessed directly with just a URL

As you can see, the line between web and app is becoming less distinct.

The case for Progressive Web
==================
![installing]( http://imgs.xkcd.com/comics/installing.png "Installing"){: .article-image }

{:installing: .image-source}
[XKCD - Installing](http://xkcd.com/1367/)
{: installing}

Although installing an app is usually a fast and simple process, when was the last time you were about to install something but decided not to? Maybe you felt like you didn't want to go through the hassle of installing it, or maybe you just didn't want use to up any more memory. Whatever the reason, almost every single mobile user has experienced this at some point. 

However, most people feel a lot less *restricted* to open up a browser and just type in to the address bas. You may have not really thought of this, but the convenience, security and simplicity of just typing a URL into an address bar is a powerful advantage of the web. Progressive Web Apps combine this with the best of native applications.

Angular and Progressive Enhancement
==================
<blockquote>
  <p>Progressive Web Apps are like normal web applications that get superpowers with browsers that have all of this functionality. Angular is the superheroic JavaScript framework, so we think they fit just perfectly together.</p>
  <footer><a href="https://twitter.com/synalx">Alex Rickabaugh</a></footer>
</blockquote>

You don't need a specific library or framework to build a progressive application. To really learn more about how 

Progressive Hacker News Client
==================
Let's get cracking!

Steps:
* https://github.com/angular/mobile-toolkit/blob/master/guides/cli-setup.md
* npm install -g angular-cli
* ng new angular2-hn --mobile
* cd angular2-hn
* git remote add origin http://IP/path/to/repository (actually initializes git already, all you'll need to set up git)
* ng serve

* If you see error Cannot read property 'makeCurrent' of undefined then do the following (http://stackoverflow.com/questions/38195887/cannot-read-property-makecurrent-of-undefined-in-angular-mobile)
* * update package.json 
* * "angular2-broccoli-prerender": "0.11.3",
* * "angular2-universal": "0.104.4",
* * add
* * "child-process-promise": "^2.0.2",
* * "optimist": "^0.6.1"
* * npm update
* * * If you see the error The Broccoli Plugin: [Funnel] failed with:
* * * Error: watch /home/houssein/Dev/angular/angular2-hn/src ENOSPC 
* * * http://unix.stackexchange.com/questions/13751/kernel-inotify-watch-limit-reached
* * * Raised the value to 10000 (temporarily)

* Now we got it set up, let's create our Application Shell
* * Explain Application Shell
* * Diagram
* * Mention cant use templateurl and styleurl (https://github.com/angular/angular-cli/issues/810)

* * Set up header, content and footer components
* * Sweet scaffolding tool: ng generate component header
* * Add default to export classes (and remove onInit for now)
* * Remove test files for now
* * Show directory structure

* * Set up header, npm install angular material toolbar, update angular-cli-build.js, update src/system-config.ts, import md-toolbar (after npm install you'll need to run ng build, why?)
* * Set up contenr and footer components
* * Explain how fast Application Shell renders
* * Talk about how it will be nice to have a progress indicator before the routed page renders
* * Explain shellRender and shellNoRender
* * Set up loading indicator component
* * Set up loading icon, npm install angular material progress bar, update src/system-config.ts, import progress bar
* 
* * Awesome, we have the app shell set up. Now looking at the JSON structure of Hacker News api (https://github.com/HackerNews/API), set up for one
* * Briefly explain pipes, how they seem to break app shell (I opened a issue: https://github.com/angular/mobile-toolkit/issues/88). Domain name function, time UNIX from now method, comments length.

* * Now let's get some the real data. Explain the HackerNews API
* * Explain RxJS, reactive programming, oservables
* * Set up a service to just populate ids
* * splice from 0 to 30
* * set method to change splice number when more link is clicked
* * set observable and function in service for each id (explain object observable cannto use async pipe)
* * Things are coming together, wrap up prev and more nav links

* * Now mention how we need to add links to header
* * Because it'll be a pain to implement routing ofr all story types because we can't share templateUrls and styleUrls, can we just use input component method to communicate and send information from header comp to main-content component?
* * * Nope, because they're sibling components not parent-child (show component tree diagram)
* * So how can we communicate between such components? Usng a shared service??
** Or routing?
