---
layout: post
title:  "Progressive Web Apps with Angular: Part 3 - Angular Service Worker"
date:   2018-07-16 07:30:00
categories: angular pwa javascript
description: In Part 1 of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This post will dive into building a PWA using Angular version 6.0 in order to understand how to use newer technologies provided by the platform....
tags:
- angular
- pwa
- javascript
comments: true
type: post
image: assets/progressive-angular-applications-2/banner.jpg
permalink: /:title
published: false
---

![Progressive Angular Banner](assets/progressive-angular-applications-2/banner.jpg 'Progressive Angular Banner'){: .article-image-with-border }

In [Part 1]({{ site.url }}/progressive-angular-applications) of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This article (as well as the next in the series) will dive into a number of different topics relevant to building a PWA with Angular. This post will focus on **lazy-loading**.

# The case for Progressive Angular

A lot has changed in the Angular ecosystem in the past year and there have been significant improvements to the toolchain to simplify the process of building a PWA. Let's take a look at some of the things that have changed:

* With the release of version 4.0, Angular introduced View Engine as an update to its rendering pipeline. This was done to improve how builds were created with Ahead-of-Time (AOT) compilation in order to generate smaller bundle sizes. In some cases, reductions greater than 50% were noticed.
* Development on [Angular Mobile Toolkit](https://github.com/angular/mobile-toolkit), which was accessed using the `--mobile` flag when creating a new project with Angular CLI, was [discontinued](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). This was done in favour of baking progressive technologies (such as `@angular/service-worker`) directly into the CLI.
* [Ivy](https://github.com/angular/angular/issues/21706), the third rendering engine for the platform, is currently under development. Again, the idea here is to simplify the development of faster and smaller-sized applications without introducing _any_ breaking changes whatsoever.

Aside from updates to Angular tooling, there have also been changes to other external libraries as well. When Part I of this article was released, Angular's service worker efforts were still in progress under the Mobile Toolkit project. For that reason, we went with caching static and dynamic assets using the [`sw-precache`](https://github.com/GoogleChromeLabs/sw-precache) and [`sw-toolbox`](https://github.com/GoogleChromeLabs/sw-toolbox) libraries respectively. Although both these libraries still exist, the Google Chrome team have worked on developing [Workbox](https://developers.google.com/web/tools/workbox/), a newer collection of tools aimed to simplify the process of adding offline support to web applications. We'll briefly cover this library later in this article.