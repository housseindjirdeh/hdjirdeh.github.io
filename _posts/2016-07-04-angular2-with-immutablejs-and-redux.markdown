---
layout: post
title:  "Building Angular 2 applications with Immutable.js and Redux"
date:   2016-07-04 9:30:00 -0400
categories: redux immutablejs angular2
description: If you have done any JavaScript development in the past year, then you may have already heard of Redux. Popularized with the use of React, some developers claim it's the most exciting thing happening in JavaScript at the moment, revolutionizing the way we build our applications and even helping us prevent global warming for good...
tags:
- redux
- immutablejs
- angular2
comments: true
type: post
image: angular2-redux.jpg
---
![angular2 redux]({{ site.url }}/public/angular2-redux.jpg "Angular 2 and Redux"){: .article-image-with-source }

If you have done any JavaScript development in the past year, then you may have already heard of [Redux](http://redux.js.org/). Popularized with the use of React, some developers claim it's the most exciting thing happening in JavaScript at the moment, revolutionizing the way we build our applications and even helping us prevent global warming for good.

Okay, I got a little carried away there. But seriously, Redux does sort of change the way you can build your applications. This post will explain how you can integrate it with Angular 2 alongside another library, [Immutable.js](https://facebook.github.io/immutable-js/).

The breakdown
==================
In this post, we'll go over the basic concepts of the Flux architecture and Redux. We'll then go over a simple contact list application step by step, building the basic setup first, adding immutability then finally creating a Redux state container.

<div class="button-center">
  <a class="blog-button" href="https://embed.plnkr.co/ns1tfi/">View Demo</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-redux-contact-list">Source Code</a>
</div>

![contact list]({{ site.url }}/public/contact-list.gif "Contact Link Example"){: .article-image }

As we go along, I'll do my best to explain why we're doing each and every step. The final application will not be complicated but will hopefully be enough for you to grasp the main concepts.

Redux and Flux Architecture
==================
Flux is simply an architectural pattern to build user interfaces. It's not a framework or library, it's a design pattern for building client side applications.

![flux architecture](https://facebook.github.io/flux/img/flux-simple-f8-diagram-1300w.png "The Flux Architecture"){: .article-image-with-source }

{:flux architecture: .image-source}
[Source: Flux Documentation - Structure and Data Flow](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow)
{: flux architecture}

Redux is an implementation of Flux created by [Dan Abramov](https://medium.com/@dan_abramov). Although Flux is not a library on its own, Facebook has created a [Dispatcher library](https://github.com/facebook/flux) in which a Flux-centered application can leverage. Redux follows the same architecture, but aims to make certain abstractions simpler. 

<blockquote>
  <p>Redux preserves all the benefits of Flux (recording and replaying of actions, unidirectional data flow, dependent mutations) and adds new benefits (easy undo-redo, hot reloading) without introducing Dispatcher and store registration.</p>
  <footer><a href="http://stackoverflow.com/a/32920459">Dan Abramov</a></footer>
</blockquote>

Let's look at its basic principles.

1) Everything that changes in your application is contained in a single JavaScript object, known as the **store**. <br>
2) The store acts as the container for the application state.<br>
3) The state is read-only and it cannot be modified (i.e. it is **immutable**).<br>
4) To make changes to the state (this can be a user event or an API interaction), you need to send a JavaScript object describing the change. In other words, you need to **dispatch** an **action**.<br>
6) Data is transferred from the store to the **view** and never the other way around. This means that the view cannot alter the state in any way.

As we mentioned, state mutations cannot alter the current state. In Redux, this means that a new JSON object must get returned everytime a mutation occurs. For this to happen, changes to the state need to be triggered through the use of **pure functions**. A pure function is a function that always returns the same value given the same input. In other words, it cannot modify anything outside of its own scope. This means it can't alter external variables or make calls to a database.

{% highlight javascript %}
function pureFunction(object){
  return object.a * 100;
}

var x = { a: 1 };
pureFunction(x);
console.log(x);
// x = { a: 1 }
{% endhighlight %}

{% highlight javascript %}
function impureFunction(object){
  object.a = object.a * 100;
  return object.a;
}

var x = { a: 1 };
impureFunction(x);
console.log(x);
// x = { a: 100 }
{% endhighlight %}

In Redux, these are known as **reducers** and are responsible for determining how the application state changes in response to the actions.

Don't worry if all of this isn't crystal clear yet. It'll make more sense as you go through this post and see how reducers, actions and the store are used in a real example.

Contact List Example
==================
Let's start building the contact list example! If you haven't already, you can set up your application using the [Angular 2 QuickStart.](https://angular.io/docs/ts/latest/quickstart.html) I'll remove the unnecessary class definitions and styling elements in the code embeds and just show you what's needed. However, I'll link to the complete source code for each step.

To kick things off, let's build a simple version with purely Angular elements. We'll start with a contact store to handle the logic of our application.

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

This is very similar to how we would set up a service in Angular 1.x. This store now controls the state of the application where we have methods to add, remove and favourite contacts.

Now let's set up our component.

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
==================
Since Angular 2 is component based, it makes more sense to have another component for each of the contacts. So let's set the parent component to be the actual list.

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
    <contact [contact]="contact"></contact>
  </li>
</ul>
{% endhighlight %}

And the child component will just be that of the contact.

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

{% highlight html %}
<!-- Contact HTML -->
<div class="contact-container">
  {% raw %}{{ contact.name }}{% endraw %}
  <button (click)="starContact(contact)">
    <i class="fa fa-2x" 
      [class.fa-star]="contact.star" 
      [class.fa-star-o]="!contact.star"></i>
  </button>
  <button (click)="removeContact(contact)">
    <i class="fa fa-trash fa-2x"></i>
  </button>
</div>
{% endhighlight %}

As you can see, the store instance was injected to both the parent and child components. Things are looking a little cleaner now. The source code for this can be found [here.](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/child-contact-component)

Change Detection Strategy
==================
In Angular 2, each and every component has its own **change detector** responsible for bindings in their own template. For example, we have the `{% raw %}{{ contact.name }}{% endraw %}` binding for which the `Contact` component is responsible for. In other words, the change detection behind the `Contact` component projects the data for `contact.name` as well as **its change.**  

So what really happens when an event is triggered? In Angular 1.x, when a digest cycle is fired, every binding is triggered in the entire application. Similarly in Angular 2, every single component is also checked. Now wouldn't it be cool to tell Angular to run change detection on a component only if one of its input properties changed instead of every time an event happens? We can by using Angular's `ChangeDetectionStrategy` in our component level.

{% highlight javascript %}
// Contact Component

import {..., ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: 'app/contact.html',
  styleUrls: ['app/contact.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
{% endhighlight %}

It's as simple as that! Now the change detection for this component will only fire if changes occur to bindings within the component.

Now does this really matter in a simple application like this? Not really, since there aren't that many bindings in the application in the first place. But for a huge application, this can help significantly reduce the number of bindings to consider when an event is triggered.

The case for Immutability
==================
To take advantage of this change detection strategy, we need to ensure that the state is indeed immutable. However, the nature of JavaScript objects are by default, mutable. We can solve this by using [Immutable.js](https://facebook.github.io/immutable-js/), a library created by the Facebook team.

<blockquote>
  <p>Immutable collections should be treated as values rather than objects. While objects represents some thing which could change over time, a value represents the state of that thing at a particular instance of time.</p>
  <footer><a href="https://facebook.github.io/immutable-js/">Immutable.js - The case for Immutability</a></footer>
</blockquote>

Simply put, immutable objects are essentially objects that cannot change. If we wanted to modify them, we'll create a new referenced object with that change and keep the original intact. Immutable.js provides a number of immutable data structures that we can include into our applications.

You can install immutable with `npm install immutable`. Once that's complete, you may have to update your SystemJS configuration. If you've set up your application following the Angular 2 QuickStart, then this would be in the `systemjs.config.js` file. You'll just need to add another mapped field so the system loader can look for the right file when `immutable` is referenced.

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

And that's it! Now let's update the `ContactStore`.

{% highlight javascript %}
// Contact Store

import Immutable = require('immutable');

export class Contact {
  name: String;
  star: boolean;
}

export class ContactStore {
  contacts = Immutable.List<Contact>();

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
    this.contacts = (<any>this.contacts).update(index, (contact) => {
      return {
        name: contact.name,
        star: !contact.star
      };
    });
  }
}
{% endhighlight %}

As you can see, we changed the instantiation of `contacts` and instead of an array, we're using `List` instead. `List` is similar to the JavaScript array, but is immutable and completely persistent. 

To persist changes to the list, we're using the `push`, `delete` and `update` methods. Similar to an array, `indexOf` is also used to find the selected contact in the list. It's important to remember that for all these methods, the current collection is not mutated but a new immutable collection is generated.

Here's the [link](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/immutable-store) to the source code for this step.

*Note: You may be wondering why `<any>` was used in the `starContact` method. This is just TypeScript type assertion to prevent compiler errors when returning an updated contact object. This is just a workaround due to an issue with type definitions when running methods against a list (discussed [here](https://github.com/facebook/immutable-js/issues/684#issuecomment-153812280)).*

Let's make things spicy with Redux
==================
You can install Redux with `npm install --save redux`. You'll also need to update your system configuration once again.

{% highlight javascript %}
var map = {
  '...':                        '...',
  'redux':                      'node_modules/redux/dist/redux.js'
};
// ...
{% endhighlight %}

Let's add our actions file now.

{% highlight javascript %}
// Actions

import { Contact as ContactModel} from './contact-store';

export interface IContactAction {
  type: string;
  id: number;
  name?: string;
}

export function addContact(name: string, id: number): IContactAction {
  return {
    type: 'ADD',
    id,
    name
  };
}

export function removeContact(id: number): IContactAction {
  return {
    type: 'REMOVE',
    id
  };
}

export function starContact(id: number): IContactAction {
  return {
    type: 'STAR',
    id
  };
}
{% endhighlight %}

As you can see, all the actions are just simple JavaScript objects. For example:

{% highlight javascript %}
{
  type: 'ADD',
  id,
  name
}
{% endhighlight %}

With Redux, actions must have a `type` property which describes the type of the action being executed. It's also recommended that they be defined as string constants. Other than this, you can set up the structure of an action any way you like. I've set it up to include only what's needed for each action, `id` and `name` to add a contact and just `id` to remove or favourite.

You can see that each of the actions are enclosed in functions that create them. 

{% highlight javascript %}
export function addContact(name: string, id: number): IContactAction {
  return {
    type: 'ADD',
    id,
    name
  };
}
{% endhighlight %}

These are known as *action creators*, and each one is defined to the `IContactAction` interface that we created.

Now let's see how we can set up a reducer.

{% highlight javascript %}
// Reducer

import Immutable = require('immutable');
import { IContactAction } from './actions';
import { Contact as ContactModel} from './contact-store';

export function reducer(state: Immutable.List<ContactModel> = Immutable.List<ContactModel>(), action: IContactAction) {
  switch (action.type) {
    case 'ADD':
      return state.push({
        id: action.id,
        name: action.name,
        star: false
      });
    case 'REMOVE':
      return state.delete(findIndexById());
    case 'STAR':
      return (<any>state).update(findIndexById(), (contact) => {
        return {
          id: contact.id,
          name: contact.name,
          star: !contact.star
        };
      });
    default:
      return state;
  }

  function findIndexById() {
    return state.findIndex((contact) => contact.id === action.id);
  }
}
{% endhighlight %}

Remember what we said earlier about pure functions? You can see that our reducer does not mutate the state or perform any side effects. For each of the actions, it just returns the newly generated state.  

Let's make the necessary updates to our store.

{% highlight javascript %}
// Contact Store

import Immutable = require('immutable');
import { createStore } from 'redux';
import { IContactAction } from './actions';
import { reducer } from './reducer';

export class Contact {
  id: number;
  name: String;
  star: boolean;
}

export class ContactStore {
  store = createStore(reducer, Immutable.List<Contact>());

  get contacts(): Immutable.List<Contact> {
    return this.store.getState();
  }

  dispatch(action: IContactAction) {
    this.store.dispatch(action);
  }
}
{% endhighlight %}

Looks nice and straightforward. The `createStore` method creates a Redux store that holds the complete state of the application. For its second argument, the preloaded state of the application, we're injecting the immutable contacts list. The current state is accessed with `getState` and actions are dispatched with the `dispatch` method. 

We also added an `id` field to the `Contact` class. Now let's update our component contact methods.

{% highlight javascript %}
// Contact List Component

// ...
import { addContact } from './actions';

@Component({
// ...
})

export class ContactList {
  contactID: number;

  constructor(private store: ContactStore) {
    this.contactID = 0;
  }

  addContact(contact) {
    this.store.dispatch(addContact(contact, this.contactID++));
  }
}
{% endhighlight %}

As you can see, an incrementing ID value is set to each contact that is added. We import the appropriate action from `actions` and run the action through `dispatch`. Now taking a look at our child component.

{% highlight javascript %}
// Contact Component

// ...
import { removeContact, starContact } from './actions';

@Component({
// ...
})

export default class Contact {
// ...
  removeContact(contact) {
    this.store.dispatch(removeContact(contact.id));
  }

  starContact(contact) {
    this.store.dispatch(starContact(contact.id));
  }
}
{% endhighlight %}

And that's it! That covers up the basics of using Redux in your application. The final source code is [here.](https://github.com/hdjirdeh/angular2-redux-contact-list/tree/master/app)

![that's a wrap]({{ site.url }}/public/thatsawrap.jpg "That's a wrap"){: .article-image }

Wrapping things up
==================

As you may have noticed, implementing immutable collections along with a redux state container adds some complexity to your application. **This isn't the only way to build Angular applications, nor is it the best way.** It's one way and it can make things easier under certain circumstances

Why should I care about immutability?
------------------
By default, Angular's change detection checks every component with any change in the application. Enforcing immutability allows you to use `ChangeDetectionStrategy.OnPush` on some of your components so that they get triggered only when they need to (i.e. when their input properties change). A nice and simple way to enforce this is by using a library like Immutable.js.

When should I use Redux?
------------------
A better question would be, when should I be implementing a Flux style architecture in my application? I can't answer it any better than [this.](https://github.com/petehunt/react-howto/issues/12#issuecomment-169546558)

Further reading
==================

Angular 2 Change Detection
------------------
Some great resources to understand how change detection works in Angular 2.

[Change Detection in Angular 2](http://victorsavkin.com/post/110170125256/change-detection-in-angular-2) - Victor Savkin<br>
[Angular 2 Change Detection Explained](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html) - Thoughtram

Understanding Redux
------------------

Dan Abramov has an absolutely excellent course on egghead.io - [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)

Redux and Angular 2
------------------

Colin Eberhardt goes into some nice detail on integrating Redux with state persistence and time travel - [Angular 2 Time Travel with Redux](http://blog.scottlogic.com/2016/01/25/angular2-time-travel-with-redux.html)