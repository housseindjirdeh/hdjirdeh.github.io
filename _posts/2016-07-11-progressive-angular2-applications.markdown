---
layout: post
title:  "Building Progressive Web Applications with Angular 2"
date:   2016-07-11 9:30:00 -0400
categories: progressive angular2
description: If you have done any JavaScript development in the past year, then you may have already heard of Redux. Popularized with the use of React, some developers claim it's the most exciting thing happening in JavaScript at the moment, revolutionizing the way we build our applications and even helping us prevent global warming for good...
tags:
- progressive
- angular2
comments: true
type: post
image: angular2-redux.jpg
permalink: /:title
---
Progressive Web Applications have been the talk of the town in the past few months. In short, **they use modern web capabilities to provide a user experience similar to that of mobile apps.** Still a relatively new concept, these applications work for every user in every browser but are enhanced in modern browsers. Progressive Web Apps are built with [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement#section3) in mind.

This post will explain how you can build a progressive web application using the Angular 2 framework.

The breakdown
==================
In this post, we'll go over the basic concepts of a Progressive Web App and what makes them different from regular applications. We'll then build a complete progressive application with Angular 2.

<div class="button-center">
  <a class="blog-button" href="">View App</a>
  <a class="blog-button" href="">Source Code</a>
</div>

![contact list]({{ site.url }}/public/contact-list.gif "Contact Link Example"){: .article-image }

By going through the entire application from the ground up, you should hopefully get a decent grasp on how to build a progressive web application. And as usual, I'll explain why we're doing each and every step as we go along.

Progressive Web Applications
==================
Let's break down the main concepts of a Progressive Web App.

<ul class="inline-list">
<li>Progressive</li>
<li>Responsive</li>
<li>Connectivity independent</li>
<li>App-like</li>
<li>Installable</li>
<li>Linkable</li>
</ul>

Angular and Progressive Enhancement
==================
<blockquote>
  <p>Progressive web apps are like normal web applications that get superpowers with browsers that have all of this functionality. Angular is the superheroic JavaScript framework, so we think they fit just perfectly together.</p>
  <footer><a href="https://twitter.com/synalx">Alex Rickabaugh</a></footer>
</blockquote>