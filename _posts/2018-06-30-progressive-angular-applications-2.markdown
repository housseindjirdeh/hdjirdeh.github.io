---
layout: post
title:  "Progressive Web Apps with Angular (Part II)"
date:   2017-01-17 07:30:00
categories: angular progressive web app javascript
description: A lot has changed in the Angular ecosystem in the past year. Among a number of changes to the platform, there have been significant improvements to the toolchain to simplify the process of building progressive web applications...
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: assets/progressive-angular-applications-2/banner.jpg
permalink: /:title
---
![Progressive Angular Banner](assets/progressive-angular-applications-2/banner.jpg "Progressive Angular Banner"){: .article-image-with-border }

In [Part I]({{ site.url }}/progressive-angular-applications)) of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and this post will dive into building a newer PWA with version 6.0 in order to understand how to use newer technologies provided by the platform.

<div class="button-center">
  <a class="blog-button" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/tour-of-thrones">Source Code</a>
</div>

![angular 2 hn preview](assets/progressive-angular-applications/angular2-hn-mobile.png "Angular 2 HN Preview"){: .article-image-with-border }

The breakdown
==================


Progressive Angular
==================

A lot has changed in the Angular ecosystem in the past year. Among a number of changes to the platform, there have been significant improvements to the toolchain to simplify the process of building a progressive web application (PWA). Let's take a look at some of the things that have changed within the ecosystem in the past year:

* With the release of version 4.0, Angular introduced View Engine as an update to its rendering pipeline. This was done to improve how builds were created with Ahead-of-Time (AOT) compilation in order to generate smaller bundle sizes. In some cases, reductions greater than 50% were noticed.
* Development on [Angular Mobile Toolkit](https://github.com/angular/mobile-toolkit), which was accessed using the `--mobile` flag when creating a new project with Angular CLI, was [discontinued](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). This was done in favour of baking progressive technologies (such as `@angular/service-worker`) directly into the CLI.
* [Ivy](https://github.com/angular/angular/issues/21706), the third rendering engine for the platform, is currently under development. Again, the idea here is to allow for faster and smaller-sized applications without introducing *any* breaking changes whatsoever.



