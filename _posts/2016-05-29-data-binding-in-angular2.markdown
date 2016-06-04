---
layout: post
title:  "Data binding in Angular 2"
date:   2016-05-29 7:13:00 -0400
categories: javascript, angular2
preview: Two-way data binding is one of the most useful properties of Angular 1.x and although Angular 2 is one-way bound by default, applying two-way data logic is actually not that much different...
tags:
- javascript
- angular2
comments: true
type: post
---

In Angular, data binding describes the **synchronization between model and view**. This is 

Property Binding
------------------

Two-way Data Binding
------------------
Two-way data binding explains how the view updates when the model changes **and vice-versa**. This happens immediately which means that the model and view are always in-sync. In other words, you can think of the view as an instant projection of the model.

![two way]({{ site.url }}/public/two_way_data_binding.png "Two Way Data Binding"){: .article-image-with-source }

{:two way: .image-source}
[Source: AngularJS Developer Guide - Data Binding](https://docs.angularjs.org/guide/databinding)
{: two way}

Lets look at a simple example of how this works.

<pre>
<code class="language-markup">
{% raw %}<h1>{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
</code>
</pre>

<pre>
<code class="language-typescript">
export class MyApp {
  firstname: string = 'Jimmy';
}
</code>
</pre>

<iframe src="https://embed.plnkr.co/HpQHJ6ljGFrHy8abCPuh/"></iframe>

We can see that the HTML is similar to what you would see in Angular 1.x. However, the two way binding syntax, `[(ngModel)]`, is slightly different. 

Just as you would expect, changing the input value changes the interpolation automatically which is evidence that the value is flowing to the model and vice-versa.

Event Binding
------------------
Now let's add a click event to make things a little more exciting.

<pre>
<code class="language-markup">
{% raw %}<h1>{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
</code>
</pre>

<pre>
<code class="language-typescript">
export class MyApp {
  firstname: string = 'Jimmy';
  
  changeName() {
    this.firstname = 'Houssein';
  }
}
</code>
</pre>

<iframe src="https://embed.plnkr.co/uz7glTDWzw8D2UiyTXPG/"></iframe>

Notice how the **target event** `(click)` is in parentheses. In Angular 1.x, this would have looked like  `ng-click="changeName()"`.

Style Binding
------------------
Angular 2 allows us to conditionally add styles to an element with a few different ways, and a style binding is a simple method.

<pre>
<code class="language-markup">
{% raw %}<h1 [style.color]="isHoussein() ? 'red': 'black'">{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
</code>
</pre>

<pre>
<code class="language-typescript">
export class MyApp {
  firstname: string = 'Jimmy';
  
  changeName() {
    this.firstname = 'Houssein';
  }
  
  isHoussein() {
    return this.firstname === 'Houssein';
  }
}
</code>
</pre>

<iframe src="http://embed.plnkr.co/Z3owwZ7QmBAa52maGwCR/"></iframe>

You can see that the style binding syntax is similar to property binding, where `style` is preceded with the name of a CSS style property: `[style.color]`. Based on the conditional property, the color style property binds to the template expression, `isHoussein()`. Try changing the name to *Houssein* through the input field or by clicking the button.

Now what if we wanted to set multiple inline styles? That's where the directive `ngStyle` comes in where we can have multiple style properties each connected to their own condition through a key:value object.

<pre>
<code class="language-markup">
{% raw %}<h1 [ngStyle]="setStyles()">{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
</code>
</pre>

<pre>
<code class="language-typescript">
export class App {
  firstname: string = 'Jimmy';
  
  changeName () {
    this.firstname = 'Houssein';
  }
  
  isHoussein() {
    return this.firstname === 'Houssein';
  }
  
  isDaniel() {
    return this.firstname === 'Daniel';
  }
  
  setStyles() {
    let styles = {
      'color':  this.isHoussein() ? 'red' : 'black',
      'font-size':  this.isDaniel() ? '4em' : '2em',
    };
    return styles;
  }
}
</code>
</pre>

<iframe src="http://embed.plnkr.co/gnp3hK0wPweSCHHUthWF/"></iframe>

Notice how we can have multiple styles each connected their condition through a key:value object.

Class Binding
------------------
Similary to style binding, class binding allows you to add or remove classes based on variables or expressions.

Here's an example of adding a conditional-based class.

<pre>
<code class="language-markup">
{% raw %}<h1 [class.awesome]="isHoussein()">{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
</code>
</pre>

<pre>
<code class="language-css">
.awesome {
  color: red;
}
</code>
</pre>

<pre>
<code class="language-typescript">
export class MyApp {
  firstname: string = 'Jimmy';
  
  changeName() {
    this.firstname = 'Houssein';
  }
  
  isHoussein() {
    return this.firstname === 'Houssein';
  }
}
</code>
</pre>

<iframe src="https://embed.plnkr.co/BEwduasMI8xotkJKRUsN/"></iframe>

As you can see, `[class.awesome]` binds to the specific *awesome* class when the template expression, `isHoussein()`, is truthy. This happens when `firstname` is Houssein. Try changing the name through the input field or by clicking the button.

Now let's see how we can use `ngClass` to add multiple classes at the same time.