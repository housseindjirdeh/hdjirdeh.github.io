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
  
  changeName() {
    this.firstname = 'Houssein';
  }
}
{% endhighlight %}

<iframe src="https://embed.plnkr.co/uz7glTDWzw8D2UiyTXPG/"></iframe>

Notice how the **target event** `(click)` is in parentheses. In Angular 1.x, this would have looked like  `ng-click="changeName()"`.

Class Binding
------------------
Class binding allows you to add or remove classes based on variables or expressions. There are two ways to do this:

`[class.class-name]` This is a great way to add or remove a *single class*.<br> 
`[ngClass]` This directive is prefered when you need to add or remove *multiple classes*. 

Here are two examples illustrating each of the methods.

{% highlight html %}
{% raw %}<h1 [class.awesome]="isHoussein()">{{firstname}}</h1>{% endraw %}
Name: <input type="text" [(ngModel)]="firstname">
<button (click)="changeName()">Change Name</button>
{% endhighlight %}

{% highlight javascript %}
export class MyApp {
  firstname: string = 'Jimmy';
  
  changeName() {
    this.firstname = 'Houssein';
  }
  
  isHoussein() {
    return this.firstname === 'Houssein';
  }
}
{% endhighlight %}

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

`[class.awesome]` binds to the specific *awesome* class when the template expression, `isHoussein()`, is truthy. As you can see from the function, this happens when `firstname` is Houssein. Try changing the name through the input field or by clicking the button.

Now let's see how it would like if we wanted to add multiple classes.  

Style Binding
------------------