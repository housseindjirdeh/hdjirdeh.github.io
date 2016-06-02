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

{% highlight html %}
{% raw %}<h1>{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
{% endhighlight %}

{% highlight javascript %}
export class MyApp {
  firstname: string = 'Jimmy';
}
{% endhighlight %}

<iframe src="https://embed.plnkr.co/HpQHJ6ljGFrHy8abCPuh/"></iframe>

We can see that the HTML is extremely similar to what you would see in Angular 1.x. However, the two way binding syntax, `[(ngModel)]`, is slightly different. 

Just as you would expect, changing the input value changes the interpolation automatically which is evidence that the value is flowing to the model and vice-versa.

Event Binding
------------------
Now let's add a click event to make things a little more exciting.

{% highlight html %}
{% raw %}<h1>{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
{% endhighlight %}

{% highlight javascript %}
export class MyApp {
  firstname: string = 'Jimmy';
  
  changeName () {
    this.firstname = 'Houssein';
  }
}
{% endhighlight %}

Notice how the *target event*, `(click)` is in parentheses. In Angular 1.x, this would have looked like  `ng

<iframe src="https://embed.plnkr.co/uz7glTDWzw8D2UiyTXPG/"></iframe>

Class Binding
------------------
Add to it - add and remove class

Style Binding
------------------