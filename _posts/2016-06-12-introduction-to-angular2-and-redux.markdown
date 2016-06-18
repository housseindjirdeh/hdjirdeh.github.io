---
layout: post
title:  "building angular 2 applications with redux"
date:   2016-06-12 7:13:00 -0400
categories: redux angular2
description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries...
tags:
- redux
- angular2
comments: true
type: post
---
![angular2 redux]({{ site.url }}/public/angular2-redux.jpg "Angular 2 and Redux"){: .article-image-with-source }

If you've been involved with JavaScript development in the past year in any way, then you most definitely heard about the new kid on the block, **Redux**. Popularized with the use of React, some developers claim that it is the most exciting thing happening in JavaScript at the moment, revolutionizing the way we build our applications and even helping us prevent global warming for good.

Okay, I got a little carried away there. But seriously, Redux does sort of change the way you can build your applications and this post will explain how exactly. However, a few points on the subject before you dive in;

• Although popularized with the use of React, you can use Redux with any other view library or framework, including Angular 2. <br>
• Flux is a term you've already probably heard before. React isn't the same thing as Flux, it's an implementation of the Flux system.<br>
• Redux isn't the only way to build Angular 2 or React applications, neither is it the best way. It's one way to build applications and it can make things easier **under certain circumstances** (which I'll get to later). <br>

Flux
------------------
Flux is simply an architectural pattern to build user interfaces. It's not a framework or library, it's a design pattern that changes how we can build client side applications. Let's look at it's basic principles.

1) Everything that changes in your application is contained in a single JavaScript object, known as the **store**. <br>
2) The store acts as the container for the application **state**.<br>
3) The state is read-only and it cannot be modified (i.e. it is **immutable**).<br>
4) To make changes to the state (this can be a user event or an API interaction), you need to send a JavaScript object describing the change. In other words, you need to **dispatch** an **action**.<br>
6) Data is transferred from the store to the **view** and never the other way around. This means that the view cannot alter the state in any way.

![flux architecture](https://facebook.github.io/flux/img/flux-simple-f8-diagram-1300w.png "The Flux Architecture"){: .article-image-with-source }

{:flux architecture: .image-source}
[Source: Flux Documentation - Structure and Data Flow](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow)
{: flux architecture}

If you haven't noticed already, the main premise of Flux is it's **unidirectional data flow**. Actions are sent to a dispatcher (the central hub) which then reports it to the store. This then creates a newer version of the state which gets rendered in the view. This is a simple explanation of Flux but it covers all the main points of the pattern.

Redux
------------------
Redux is an implementation of Flux created by [Dan Abramov](https://medium.com/@dan_abramov). Although Flux is not a library on it's own, Facebook has created a [Dispatcher library](https://github.com/facebook/flux) in which a Flux-centered application can leverage. Redux follows the same architecture, but aims to make certain abstractions simpler.

<blockquote>
  <p>Redux preserves all the benefits of Flux (recording and replaying of actions, unidirectional data flow, dependent mutations) and adds new benefits (easy undo-redo, hot reloading) without introducing Dispatcher and store registration.</p>
  <footer>Dan Abramov</footer>
</blockquote>

One of the main differences of Redux is that there is only a single store that actions are dispatched to directly, where in Flux, multiple stores can compute changes to the state.

As we mentioned previously, state mutations cannot alter the current state. In Redux, this means that a new JSON object must get returned everytime a mutation occurs. For this to happen, changes to the state need to be triggered through the use of **pure functions**. A pure function is a function that always returns the same value given the same input. In other words, it cannot modify anything outside of its own scope. This means it can't alter external variables or make calls to a database.

{% highlight javascript %}
function pureFunction (array) {
  return array.map(Math.sqrt);
}
{% endhighlight %}

{% highlight javascript %}
function impureFunction (array) {
  array = array.map(Math.sqrt);
  return array;
}
{% endhighlight %}

Shopping Cart Example
------------------
To demonstrate how Redux can be used with Angular 2, let's go through a simple shopping cart example step by step. The final application will be simple but will help you grasp the main concepts.

You can find the full code at : 





Setting Up
------------------
You can use any structure for the action, but it must have a type property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     