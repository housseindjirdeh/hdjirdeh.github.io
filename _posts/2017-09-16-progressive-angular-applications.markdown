---
layout: post
title:  "Progressive Web Apps with Angular CLI"
date:   2016-09-16 9:20:00 -0400
categories: angular progressive web app javascript
description: Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: angular-progressive.png
permalink: /:title
---
![angular 2 hn banner](https://i.imgur.com/6huokkl.png "Angular 2 HN Banner"){: .article-image }

Progressive Web Apps have been the talk of the town in 2016. In short, they are applications that use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in some. In other words, they are built with [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement#section3) in mind.

My last blog post (see [here](http://houssein.me/angular2-hacker-news)) revolved around building a Hacker News client from scratch using Angular CLI. In this post, we're going to look into how we can make it faster and more reliable.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](https://i.imgur.com/tAKYveK.jpg "Angular 2 HN Preview"){: .article-image }

Here's a rundown of what we'll be covering.

1. Isomorphic Fetch
2. Ahead-of-Time compilation
3. Lighthouse
4. Finally, we'll add routes to allow the user to navigate to item comments and user profiles.

This visual tutorial should make you feel a little more comfortable building an Angular 2 application from small modular parts as well as creating an app from scratch all the way to completion. We'll also briefly go over some important topics and understand how they apply to an actual application, which includes:

1. The `NgModule` decorator<br>
2. View Encapsulation<br>
3. RxJS

Progressive Web Applications
==================
Let's break down the main concepts of Progressive Web Applications.

* They are **progressive**, meaning that they work for every user in every browser
* Although they may provide a mobile-like experience, they are **responsive** and work on every device and every screen size
* Push notifications, background syncing and offline capability are all features that can be included
* They can be **installed** to the home screen of your device
* They can be accessed directly with just a URL

As you can see, the line between web and app is becoming less distinct.

The case for Progressive Web
==================
![installing](http://imgs.xkcd.com/comics/installing.png "Installing"){: .article-image }

{:installing: .image-source}
[XKCD - Installing](http://xkcd.com/1367/)
{: installing}

Although installing an app is usually a fast and simple process, when was the last time you were about to install something but decided not to? Maybe you felt like you didn't want to go through the hassle of installing it, or maybe you just didn't want use to up any more memory. Whatever the reason, almost every single mobile user has experienced this at some point.

However, most people feel a lot less *restricted* to open up a browser and just type in to the address bar. You may have not really thought of this, but the convenience, security and simplicity of just typing a URL into an address bar is a powerful advantage of the web. Progressive Web Apps combine this with the best of native applications.

Angular and Progressive Enhancement
==================
<blockquote>
  <p>Progressive Web Apps are like normal web applications that get superpowers with browsers that have all of this functionality. Angular is the superheroic JavaScript framework, so we think they fit just perfectly together.</p>
  <footer><a href="https://twitter.com/synalx">Alex Rickabaugh</a></footer>
</blockquote>

You don't need a specific library or framework to build a progressive application. To really learn more about how
