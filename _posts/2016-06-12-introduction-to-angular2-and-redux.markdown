---
layout: post
title:  "building angular 2 applications with immutable.js and redux"
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

If you've done any JavaScript development in the past year, then you've probably already heard of [Redux](http://redux.js.org/). Popularized with the use of React, some developers claim that it's the most exciting thing happening in JavaScript at the moment, revolutionizing the way we build our applications and even helping us prevent global warming for good.

Okay, I got a little carried away there. But seriously, Redux does sort of change the way you can build your applications, and this post will explain how you can integrate it into your Angular 2 applications alongisde another library, [Immutable.js](https://facebook.github.io/immutable-js/).

The breakdown
------------------
In this post, we will go over the basic concepts of the Flux architecture and the Redux state container. We'll then go over a simple contact list example step by step. The final application will not be complicated but will hopefully be enough for you to grasp the main concepts.

![contact list]({{ site.url }}/public/contact-list.gif "Contact Link Example"){: .article-image }

Flux
------------------
Flux is simply an architectural pattern to build user interfaces. It's not a framework or library, it's a design pattern that changes how we can build client side applications. Let's look at its basic principles.

1) Everything that changes in your application is contained in a single JavaScript object, known as the **store**. <br>
2) The store acts as the container for the application **state**.<br>
3) The state is read-only and it cannot be modified (i.e. it is **immutable**).<br>
4) To make changes to the state (this can be a user event or an API interaction), you need to send a JavaScript object describing the change. In other words, you need to **dispatch** an **action**.<br>
6) Data is transferred from the store to the **view** and never the other way around. This means that the view cannot alter the state in any way.

![flux architecture](https://facebook.github.io/flux/img/flux-simple-f8-diagram-1300w.png "The Flux Architecture"){: .article-image-with-source }

{:flux architecture: .image-source}
[Source: Flux Documentation - Structure and Data Flow](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow)
{: flux architecture}

If you haven't noticed already, the main premise of Flux is its **unidirectional data flow**. Actions are sent to a dispatcher (the central hub) which then reports it to the store. This then creates a newer version of the state which gets rendered in the view. This is a simple explanation of Flux but it covers all the main points of the pattern.

Redux
------------------
Redux is an implementation of Flux created by [Dan Abramov](https://medium.com/@dan_abramov). Although Flux is not a library on its own, Facebook has created a [Dispatcher library](https://github.com/facebook/flux) in which a Flux-centered application can leverage. Redux follows the same architecture, but aims to make certain abstractions simpler.

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

Contact List Example
------------------
Let's build a simple version of the contact list application with purely Angular elements.

![contact list basic]({{ site.url }}/public/contact-list.gif "Contact Link Example"){: .article-image }

We'll start with a contact store to handle the logic of our application.

{% highlight javascript %}
// Contact Store

export class Contact {
  name: String;
  star: boolean;
}

export class ContactStore {
  contacts: Contact[];

  constructor() {
    this.contacts = [];
  }

  addContact(newContact: String) {
    this.contacts.push({
      name: newContact,
      star: false
    });
  }

  removeContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
    this.contacts.splice(index, 1);
  }

  starContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
    this.contacts[index].star = !this.contacts[index].star;
  }
}
{% endhighlight %}

This is very similar to how we would set up a service in Angular, however I wanted to mimick the store logic found in Flux applications. The `ContactStore` controls the *state* of the application where we have methods to add, remove and favourite contacts.

Now let's take a look at the component.

{% highlight javascript %}
// Contact List Component

import { Component } from '@angular/core';
import { ContactStore } from './contact-store';

@Component({
  selector: 'contact-list',
  templateUrl: 'app/contact-list.html',
  styleUrls: ['app/contact-list.css'],
})

export class ContactList {
  constructor(private store: ContactStore) { }

  addContact(contact) {
    this.store.addContact(contact);
  }

  removeContact(contact) {
    this.store.removeContact(contact);
  }

  starContact(contact) {
    this.store.starContact(contact);
  }
}
{% endhighlight %}

{% highlight html %}
<!-- Contact List HTML -->

<input #newContact placeholder="Add Contact" 
  (keyup.enter)="addContact(newContact.value); newContact.value='' ">
<ul>
  <li *ngFor="let contact of store.contacts">
    {% raw %}{{ contact.name }}{% endraw %}
    <button (click)="starContact(contact)">
      <i class="fa fa-2x" 
        [class.fa-star]="contact.star" 
        [class.fa-star-o]="!contact.star"></i>
    </button>
    <button (click)="removeContact(contact)">
      <i class="fa fa-trash fa-2x"></i>
    </button>
  </li>
</ul>
{% endhighlight %}

In here, we have a constructor that defines a private `store` property and identifies it as a `ContactStore` injection site. The input property methods, `addContact`, `removeContact` and `starContact`, all link to their respective methods in the `ContactStore`.

So far we've built something simple which works, so that's a good start. The source code for this can be found [here.](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/basic-setup)

Multiple Components
------------------
Since Angular 2 is component based, it makes more sense to have another component for each of the contacts. 

{% highlight javascript %}
// Contact List Component

import { Component } from '@angular/core';
import { ContactStore } from './contact-store';
import Contact from './contact';

@Component({
  selector: 'contact-list',
  templateUrl: 'app/contact-list.html',
  styleUrls: ['app/contact-list.css'],
  directives: [Contact]
})

export class ContactList {
  constructor(private store: ContactStore) { }

  addContact(contact) {
    this.store.addContact(contact);
  }
}
{% endhighlight %}

{% highlight html %}
<!-- Contact List HTML -->

<input #newContact placeholder="Add Contact" 
  (keyup.enter)="addContact(newContact.value); newContact.value='' ">
<ul>
  <li *ngFor="let contact of store.contacts">
    {% raw %}{{ contact.name }}{% endraw %}
    <contact [contact]="contact"></contact>
  </li>
</ul>
{% endhighlight %}

{% highlight javascript %}
// Contact Component

import { Component, Input } from '@angular/core';
import { ContactStore, Contact as ContactModel} from './contact-store';

@Component({
  selector: 'contact',
  templateUrl: 'app/contact.html',
  styleUrls: ['app/contact.css'],
})

export default class Contact {
  @Input()
  contact: ContactModel;

  constructor(private store: ContactStore) { }

  removeContact(contact) {
    this.store.removeContact(contact);
  }

  starContact(contact) {
    this.store.starContact(contact);
  }
}
{% endhighlight %}

As you can see, the store instance was injected to both the parent and child components. Things are looking a little cleaner now. The source code for this can be found [here.](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/child-contact-component)

Change Detection
------------------
In Angular 2, each and every component has its own **change detector** responsible for bindings in their own template. For example, we now have the `{% raw %}{{ contact.name }}{% endraw %}` binding for which the `Contact` component is responsible for. In other words, the change detection behind `Contact` projects the data for `contact.name` as well as **its change.**  

So what really happens when an event is triggered? In Angular 1.x, when a digest cycle is fired, every binding is triggered in the entire application. Similarly in Angular 2, every single component is checked because the application state may have changed. Now wouldn't it be cool to tell Angular to run change detection on a component only if one of its input properties change as opposed to every time an event happens? We can by using `ChangeDetectionStrategy` on our component level.

{% highlight javascript %}
import {..., ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: 'app/contact.html',
  styleUrls: ['app/contact.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
{% endhighlight %}

It's as simple as that! Now the change detection for this component will only fire if changes occur to bindings within the component.

Now does this really matter in a simple application like this? Not really, there aren't that many bindings in the entire application in the first place. But for a larger application, this can help significantly reduce the number of bindings to consider when an event is triggered.

The case for Immutability
------------------
To take advantage of this change detection strategy, we need to ensure that the state is indeed immutable. However, the nature of JavaScript objects are by default, mutable. We can solve this by using Immutable.js, a library created by Facebook.

<blockquote>
  <p>Immutable collections should be treated as values rather than objects. While objects represents some thing which could change over time, a value represents the state of that thing at a particular instance of time.</p>
  <footer>Immutable.js - The case for Immutability</footer>
</blockquote>

Simply put, immutable objects are essentially objects that cannot change. If we wanted to modify them, we'll create a new referenced object with that change and keep the original intact. Immutable.js provides a number of immutable data structures so let's see how we can include it into our application.

Firstly, you can install immutable using npm: `npm install immutable`. Once that's complete, you may have to update your SystemJS configuration. If you've set up your application following the Angular 2 Quick Start, then this would be in your `systemjs.config.js` file. You'll just need to add a map field to look for the right file when `immutable` is referenced.

{% highlight javascript %}
/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
    'immutable':                  'node_modules/immutable/dist/immutable.js'
  };
// ...
{% endhighlight %}

And that's it! Now let's get to updating the `ContactStore`.

{% highlight javascript %}
// Contact List Component

import Immutable = require('immutable');

export class Contact {
  name: String;
  star: boolean;
}

export class ContactStore {
  contacts = Immutable.List(Contact);

  addContact(newContact: String) {
    this.contacts = this.contacts.push({
      name: newContact,
      star: false
    });
  }

  removeContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
    this.contacts = this.contacts.delete(index);
  }

  starContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
    this.contacts = this.contacts.update(index, function(contact) {
      return {
        name: contact.name,
        star: !contact.star
      };
    });
  }
}
{% endhighlight %}

Here's the [link](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/immutable-store) to the source code.

Including Redux
------------------


and this post will explain how. However, a few points on the subject before you dive in;

• Although popularized with the use of React, you can use Redux with any other view library or framework, including Angular. <br>
• Flux is a term you've already probably heard before. React isn't the same thing as Flux, it's an implementation of Flux.<br>
• Redux isn't the only way to build Angular applications, neither is it the best way. It's one way and it can make things easier under certain circumstances (which I'll get to later). <br>