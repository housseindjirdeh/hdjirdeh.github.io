---
layout: post
title:  "Asynchronous JavaScript: Callbacks"
date:   2016-05-10 18:36:55 -0400
categories: javascript
preview: Functions in Javascript are treated as first-class objects. This means that they have a type of *Object* and can be referenced like any other first-class object, such as `Date`, `Number`, `String` and so forth. This may seem obvious, but it's important to remember that the nature of functions in Javascript are quite different then, for example, methods in Ruby.
tags:
- javascript
---
Functions in Javascript are treated as first-class objects. This means that they have a type of `Object` and can be referenced like any other first-class object, such as `Date`, `Number`, `String` and so forth. This may seem obvious, but it's important to remember that the nature of functions in Javascript are quite different then, for example, methods in Ruby.

So what does this mean? Since functions are actually objects, they can be assigned to variables and passed as arguments to functions. 

For example, take a look at the following snippet.

{% highlight javascript %}
function functionFirst(){
  console.log( 'Damn Daniel');
}

function functionSecond(){
  console.log( 'Back at it again with the white Vans!');
}

functionFirst();
functionSecond();
{% endhighlight %}

The result might be what you expect.

`Damn Daniel` <br>
`Back at it again with the white Vans!`

Asynchronous JavaScript
------------------
Now let's add a timeout to the first function. 

{% highlight javascript %}
function functionFirst() {
 setTimeout(function() {
  console.log('Damn Daniel');
 }, 3000);
}

function functionSecond(){
 console.log( 'Back at it again with the white Vans!');
}

functionFirst();
functionSecond();
{% endhighlight %}

Running this will give you:

`Damn Daniel` <br>
`undefined`

And three seconds later, this will pop up: `Back at it again with the white Vans!`

Why? Javascript is of **a single threaded nature**. This means it executes one piece of code at a time (each piece of code, or operation, is queued along this single thread). Notice how `functionFirst()` triggers `setTimeout`, which queues an operation to run after a certain delay (in this case, after 3 seconds). The concept of *running after a certain time* is exactly what **asynchronous** means.

Disclaimer: The only reason I used `setTimeout` was to simulate an operation that takes a certain time. Examples of such operations could be reading from a text file, downloading things or performing an HTTP request.

Callbacks
------------------
Now, for obvious reasons, we want the text `Back at it again with the white Vans!` to appear only after `Damn Daniel` is shown. To do so, we can store `functionSecond()` as a **callback**.

{% highlight javascript %}
function functionFirst(callback) {
 setTimeout(function() {
  console.log('Damn Daniel');
  callback();
 }, 3000);
}

function functionSecond() {
 console.log('Back at it again with the white Vans!');
}

functionFirst( function(){
 functionSecond();
});

console.log('DAMN!');
{% endhighlight %}

The output:

`DAMN!` 

Followed by a three second delay, then:

`Damn Daniel` <br>
`Back at it again with the white Vans!`

Observing the snippet, we can see that `functionFirst` accepts `functionSecond` as an argument, or callback, and this means that `functionFirst` is a **higher-order function**. In other words, `functionFirst` will *call the second function back later* once its operation is complete.

So why is this useful? Say you send off an HTTP request and you need to do something with the response. Instead of holding up your browser, you can use a callback to handle the response *whenever it arrives*. Another example could be when your application is dependent on user input. 

Conclusion
------------------
