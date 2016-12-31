---
layout: post
title:  "Progressive Web Apps with Angular"
date:   2017-09-16 9:20:00 -0400
categories: angular2 progressive web app javascript
description: Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...
tags:
- angular2
- progressive web app
- javascript
comments: true
type: post
image: angular-progressive.png
permalink: /:title
published: false
---
![angular 2 hn banner](https://i.imgur.com/6huokkl.png "Angular 2 HN Banner"){: .article-image }

Progressive Web Applications have been the talk of the town in the past few months. In short, they  are applications that use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers. In other words, they are built with [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement#section3) in mind.

The breakdown
==================
If you've ever built an Angular 2 application before, you'll know that setting up and bootstrapping the application can take a significant amount of time.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](https://i.imgur.com/tAKYveK.jpg "Angular 2 HN Preview"){: .article-image }

By going through the entire application from the ground up, you should hopefully get a decent understanding of how a Progressive Web Application works and how to build one with Angular 2. As usual, I'll explain why we're doing each and every step as we go along.

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
