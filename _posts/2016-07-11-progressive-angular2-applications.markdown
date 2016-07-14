---
layout: post
title:  "Build Progressive Web Applications with Angular 2"
date:   2016-07-11 9:30:00 -0400
categories: progressive angular2
description: Progressive Web Applications have been the talk of the town in the past few months. In short, they use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers...
tags:
- progressive
- angular2
comments: true
type: post
image: angular2-redux.jpg
permalink: /:title
---
Progressive Web Applications have been the talk of the town in the past few months. In short, they  are applications that use modern web capabilities to provide a user experience similar to that of mobile apps. Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers. In other words, they are built with [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement#section3) in mind.

This post will explain how you can build a progressive web application using the Angular 2 framework.

The breakdown
==================
In this post, we'll go over the basic concepts of a Progressive Web App and what makes them different from regular applications. We'll then build a complete progressive application with Angular 2.

<div class="button-center">
  <a class="blog-button" href="">View App</a>
  <a class="blog-button" href="">Source Code</a>
</div>

![contact list]({{ site.url }}/public/contact-list.gif "Contact Link Example"){: .article-image }

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
![installing]( http://imgs.xkcd.com/comics/installing.png "Installing"){: .article-image }

{:installing: .image-source}
[XKCD - Installing](http://xkcd.com/1367/)
{: installing}

Although installing an app is usually a fast and simple process, when was the last time you were about to install something but decided not to? Maybe you felt like you didn't want to go through the hassle of installing it, or maybe you didn't want use up any more memory on your device. Whatever the reason, almost every single mobile user has experienced this at some point. 

However, most people feel a lot less *restricted* to open up a browser and just type in a URL. You may have not really thought of this, but the convenience, security and simplicity of just typing into an address bar is a powerful advantage of the web. Progressive Web Apps combine this with the best of native applications.

Angular and Progressive Enhancement
==================
<blockquote>
  <p>Progressive Web Apps are like normal web applications that get superpowers with browsers that have all of this functionality. Angular is the superheroic JavaScript framework, so we think they fit just perfectly together.</p>
  <footer><a href="https://twitter.com/synalx">Alex Rickabaugh</a></footer>
</blockquote>

You don't need a specific library or framework to build a progressive application. To really learn more about how 
