---
layout: post
title:  "Two-way data binding in Angular 2"
date:   2016-05-29 7:13:00 -0400
categories: javascript, angular 2
preview: Two-way data binding is one of the most useful properties of Angular 1.x and although Angular 2 is one-way bound by default, applying two-way data logic is actually not that much different...
tags:
- javascript
- angular 2
comments: true
type: post
---

Two-way data binding is one of the most useful properties of Angular 1.x and although Angular 2 is one-way bound by default, applying two-way data logic is actually not that much different. 

What is two-way data binding?
------------------
In Angular, data binding describes the **synchronization between model and view**. Two-way data binding explains how the *view* updates when the *model* changes and vice-versa. This always happens immediately which means that the model and view are always in-sync. In other words, you can think of the view as an instant projection of the model.

![two way]({{ site.url }}/public/two_way_data_binding.png "Two Way Data Binding")