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

In Angular, data binding describes the **synchronization between model and view**.

One-way Binding
------------------
One way binding - Angular 1
Propery binding - Angular 2

Two-way Data Binding
------------------
Two-way data binding explains how the view updates when the model changes **and vice-versa**. This happens immediately which means that the model and view are always in-sync. In other words, you can think of the view as an instant projection of the model.

![two way]({{ site.url }}/public/two_way_data_binding.png "Two Way Data Binding"){: .article-image-with-source }

{:two way: .image-source}
[Source: AngularJS Developer Guide - Data Binding](https://docs.angularjs.org/guide/databinding)
{: two way}

In Angular 1.x
------------------
Lets look at a simple example of how this works in Angular 1.3.

{% highlight html %}
<html ng-app="myApp">
  <body ng-controller="appCtrl as vm">
  {% raw %}  <h1>{{vm.firstname}}</h1>{% endraw %}
    Name: <input ng-model="vm.firstname">
  </body>
</html>

<script>
var appCtrl = function(){
  var vm = this;
  vm.firstname = 'Jimmy';
};

angular.module('myApp', []).controller('appCtrl', appCtrl);
</script>
{% endhighlight %}

<iframe src="https://embed.plnkr.co/vCkXc3qlrIupUBkvKUxn/"></iframe>

As you can see, the *ng-model* directive is used to bind the input value to a variable. If you change the input value, the binded variable changes as well.

In Angular 2
------------------

Event Binding
------------------
Add to it
ng-click - Angular 1
(click) - Angular 2

Class Binding
------------------
Add to it - add and remove class

Style Binding
------------------