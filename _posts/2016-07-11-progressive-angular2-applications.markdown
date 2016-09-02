---
layout: post
title:  "Building a Hacker News client with Angular 2 CLI and RxJS Observables"
date:   2016-08-05 9:30:00 -0400
categories: angular2 rxjs
description: Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...
tags:
- angular2
- rxjs
comments: true
type: post
image: angular2hn.png
permalink: /:title
---
![angular 2 hn banner](https://files.slack.com/files-pri/T0LA4NDHS-F27HW9N0P/angularhn.jpg "Angular 2 HN Banner"){: .article-image-with-source }

If you've ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team has rolled out [Angular CLI](https://cli.angular.io/), a command line interface, that makes creating and scaffolding an application significantly easier.

The breakdown
==================
In this post, we'll build an entire [Hacker News](https://news.ycombinator.com/) client using Angular CLI and RxJS Observables. We'll start by mapping out the component stucture, building a basic setup first then wrapping an Observable Data Service to load data asynchronously as we build the entire application complete with full page routing.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](http://i.imgur.com/6QquRtl.gif "Angular 2 HN Preview"){: .article-image }

This visual tutorial should make you feel more comfortable building an Angular 2 application from small modular parts. As usual, I'll explain what and why we're doing each and every step as we go along.

Let's get ready to rumble
==================
Once you have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), you can install the CLI. 

{% highlight bash %}
npm install -g angular-cli
{% endhighlight %}

Now you can start your application.

{% highlight bash %}
ng new angular2-hn
cd angular2-hn
ng serve
{% endhighlight %}

It's that simple. If you now open `http://localhost:4200/`, you'll see the app running. 

[image]

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
