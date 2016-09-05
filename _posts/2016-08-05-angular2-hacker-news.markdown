---
layout: post
title:  "Building Hacker News with Angular 2 CLI, Webpack and RxJS Observables"
date:   2016-08-05 9:30:00 -0400
categories: angular2 rxjs webpack
description: If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team has rolled out Angular CLI, a command line interface that makes creating and scaffolding an application significantly easier...
tags:
- angular2
- rxjs
- webpack
comments: true
type: post
image: angular2hn.png
permalink: /:title
---
![angular 2 hn banner](https://files.slack.com/files-pri/T0LA4NDHS-F27HW9N0P/angularhn.jpg "Angular 2 HN Banner"){: .article-image }

If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team have rolled out [Angular CLI](https://cli.angular.io/), a command line interface that makes creating and scaffolding an application significantly easier.

In this post, we'll build an entire [Hacker News](https://news.ycombinator.com/) client using Angular CLI and RxJS Observables using Webpack as our module loader.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/hdjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](http://i.imgur.com/6QquRtl.gif "Angular 2 HN Preview"){: .article-image }

Here's a rundown of what we'll be doing.

1. We'll start by building our basic setup first, the front page of Hacker News. <br>
2. We'll then wrap an Observable Data Service to load data asynchronously from the official [Hacker News API](https://github.com/HackerNews/API)<br>
3. To allow the user to see different story types, comments and user profiles, we'll add navigation using the [Angular Component Router](https://angular.io/docs/ts/latest/guide/router.html).
4. Once we're done, we'll go over bundling and deployment to show you how to get the complete application in production using the [Firebase CLI](https://firebase.google.com/docs/cli/).

This visual tutorial should make you feel more comfortable building an Angular 2 application from small modular parts as well as building an app from scratch all the way to production. As usual, I'll explain what and why we're doing each step as we go along.

Getting Started
==================
Once you have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), you can install the CLI. 

{% highlight bash %}
npm install -g angular-cli
{% endhighlight %}

You can then start your application.

{% highlight bash %}
ng new angular2-hn
cd angular2-hn
ng serve
{% endhighlight %}

If you now open `http://localhost:4200/`, you'll see the application running. 

![app setup](https://files.slack.com/files-pri/T0LA4NDHS-F27V871NZ/pasted_image_at_2016_09_03_01_51_am.png "App Setup"){: .article-image }

Pretty cool huh? Angular CLI uses [SystemJS](https://github.com/systemjs/systemjs) as the module bundler and loader. Now using SystemJS has its quirks, and this includes long loading times and [a lengthy process just to add third party libraries](https://github.com/angular/angular-cli/wiki/3rd-party-libs). To make things simpler and faster, the Angular CLI team are in the process of moving the build system from [SystemJS to Webpack](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#100-beta11-webpack-2016-08-02)

Although this is not 100% complete, we can still begin using Webpack by upgrading to it's preview build. This will only be necessary since the Webpack migration is still in its alpha stage. Once the team narrows everything down and makes an official release, installing Angular CLI will only use Webpack as its default module loader.

First, you'll need to update globally.

{% highlight bash %}
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@webpack
{% endhighlight %}

Then you'll need to update locally.

{% highlight bash %}
rm -rf node_modules dist tmp typings
npm install --save-dev angular-cli@webpack
{% endhighlight %}

Now if you run `ng serve`, you should see the app launch once again, but this time with Webpack running behind the scenes.

NgModule
==================
For this application, we'll be using [Angular's RC5 release](http://angularjs.blogspot.se/2016/08/angular-2-rc5-ngmodules-lazy-loading.html). Quite a few changes have been made for the update to RC5, but the biggest one would most probably be the introduction of `@NgModule`. Let's take a quick look at our `app.module.ts` file.

{% highlight javascript %}
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{% endhighlight %}

So what exactly is happening here? The `@NgModule` decorator specifies all declarations (components, directives and pipes), library imports (such as `FormsModule` and `HttpModule`) and providers (a single-instance service for example) that we'll be using in our application. 

You can probably already see how much more organized it is to not need to specify all our module-level components, directives, pipes and so forth in each of our components.

Let's get ready to rumble
==================
Let's set up [Sass](http://sass-lang.com/) as our CSS preprocessor. For a project that has already been set up, you can do this with the following command.

{% highlight bash %}
ng set defaults.styleExt scss
{% endhighlight %}

Now that we have everything set up, we can create our first few components. To start things off, we'll create a `HeaderComponent`.

{% highlight javascript %}
ng g component Header
{% endhighlight %}

You'll notice that a `header` folder is immediately created and scaffolded. Take a look at `app.module.ts` once again and you'll notice that it is now declared there as well.

{% highlight javascript %}
// ...
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
//...
{% endhighlight %}

If you take a look at `header.component.ts` inside the `header` folder, you can see that its component selector is `app-header`. Let's add this in our root component.

{% highlight html %}
<!-- app.component.html -->

<app-header></app-header>
{% endhighlight %}

Running the application will show you that the header component loads successfully.

![header loads](https://files.slack.com/files-pri/T0LA4NDHS-F2804R2V9/pasted_image_at_2016_09_03_02_20_pm.png "Header Loads"){: .article-image }

Sweet, now let's add some markup and styling to both the root and header components.

Our app component.

{% highlight html %}
<!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
</div>
{% endhighlight %}

The styling for `app.component.scss` can be found [here](https://github.com/hdjirdeh/angular2-hn/blob/initial-setup/src/app/app.component.scss). Now let's work on the header. 

{% highlight html %}
<!-- header.component.html -->

<header id="header">
  <a class="home-link" href="/">
    <img class="logo" src="/assets/images/angular2-hn.png">
  </a>
  <div class="header-text">
    <div class="left">
      <h1 class="name">
        <a href="/">Angular 2 HN</a>
      </h1>
      <span class="header-nav">
        <a href="">new</a>
        <span class="divider">
          |
        </span>
        <a href="">show</a>
        <span class="divider">
          |
        </span>
        <a href="">ask</a>
        <span class="divider">
          |
        </span>
        <a href="">jobs</a>
      </span>
    </div>
    <div class="info">
      Built with <a href="https://cli.angular.io/" target="_blank">Angular CLI</a>
    </div>
  </div>
</header>
{% endhighlight %}

And similarly, you can find the styling for this component [here](https://github.com/hdjirdeh/angular2-hn/blob/initial-setup/src/app/header/header.component.scss). Running the application gives us the following result.

![header](https://files.slack.com/files-tmb/T0LA4NDHS-F28351WRG-36a0aaf209/pasted_image_at_2016_09_03_10_04_pm_1024.png "Header"){: .article-image }

View Encapsulation
==================
Since we're trying to make this application as responsive as possible to give it a native feel, it's important to check how it looks with different screen sizes regularly. Let's adjust our viewport to see how it would look on a mobile device.

![header mobile](https://files.slack.com/files-pri/T0LA4NDHS-F282PJG06/pasted_image_at_2016_09_03_10_26_pm.png "Header Mobile"){: .article-image }

As you can see, there seems to be an offset from the edge of the page. This is because the **body** element has a bult-in offset (through `margin`) that shows in almost all modern browsers. 

![body margin](https://files.slack.com/files-pri/T0LA4NDHS-F28377QGJ/pasted_image_at_2016_09_03_10_39_pm.png "body margin"){: .article-image }

But if you take a look at `app.component.scss`, we explicity set `margin: 0` for screen sizes less then 768px.

{% highlight css %}
// app.component.scss

$mobile-only: "only screen and (max-width : 768px)";

body {
  margin-bottom: 0;

  @media #{$mobile-only} {
    margin: 0;
  }
}

// ...
{% endhighlight %}

So why isn't this rendering the way it should? This is because of the way Angular *encapsulates* CSS styles onto a component. I won't be going into too much detail here, but there are three different ways Angular does this.

- `None`: Angular doesn't do anything. No encapsulation and no Shadow DOM, this is just like adding styles regularly. Adding a style will apply to the entire document.
- `Emulated`: Angular *emulates* Shadow DOM behaviour. This is defaulted.
- `Native`: Angular uses the browser's native Shadow DOM completely.

In our root component, we're trying to add styles to the `body` element which really doesn't make sense if you think about it. Our root component is within `body`, not the other way around, hence why it's styles will not be affected. We can work around this by telling Angular to not do any view encapsulation in this component whatsoever.

{% highlight javascript %}
// app.component.ts

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
}
{% endhighlight %}

Take a look at our application once more and you'll notice that the styles have now been applied to `body`. This is because all of the styles in this component now affect the entire document. (warning)*

![header fixed](https://files.slack.com/files-pri/T0LA4NDHS-F283AD90A/pasted_image_at_2016_09_03_11_33_pm.png "Header Fixed"){: .article-image }

Multiple Components
==================
Let's create two more components, `Stories` and `Footer`. Stories represent posts in Hacker News, and we'll start out with a skeleton just to get an ordered list in place.

{% highlight bash %}
ng g component Stories
{% endhighlight %}

{% highlight javascript %}
// stories.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})

export class StoriesComponent implements OnInit {
  items: number[];

  constructor() { 
    this.items = Array(30).fill().map((x,i)=>i);
  }

  ngOnInit() {
  }
}
{% endhighlight %}

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol>
    <li *ngFor="let item of items; let i = index" class="post">
      Story #{{i}}
    </li>
  </ol>
  <div class="nav">
    <a href="" class="prev">
      ‹ Prev
    </a>
    <a href="" class="more">
      More ›
    </a>
  <div>
</div>
{% endhighlight %}

Click [here](https://github.com/hdjirdeh/angular2-hn/blob/initial-setup/src/app/stories/stories.component.scss) to take a look at the CSS for `Stories`. Our footer is straightfoward (and it's Sass file can be found [here](https://github.com/hdjirdeh/angular2-hn/blob/initial-setup/src/app/footer/footer.component.scss)).

{% highlight bash %}
ng g component Footer
{% endhighlight %}

{% highlight html %}
<!-- footer.component.html -->

<footer id="footer">
    <p>Show this project some ❤ on 
      <a href="https://github.com/hdjirdeh/angular2-hn" target="_blank">
        GitHub
      </a>
    </p>
</footer>
{% endhighlight %}

We'll also need to update our root component to show these components.

{% highlight html %}
<!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
  <app-stories></app-stories>
  <app-footer></app-footer>
</div>
{% endhighlight %}

Let's see what our page is looking like.

![numbered list](https://files.slack.com/files-tmb/T0LA4NDHS-F284M1XLM-c9603362e5/pasted_image_at_2016_09_04_12_20_pm_1024.png "Numbered List"){: .article-image }

Since each story post, or item, will have its own styles and characteristics, it makes sense to create a component for this as well.

{% highlight bash %}
ng g component Item
{% endhighlight %}

Once we start getting real data, we'll need to pass down the item identifier from the story component to it's child item component. In the meantime, let's just pass down the list index as `itemID`.

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol>
    <li *ngFor="let item of items; let i = index" class="post">
      <item class="item-block" itemID=" {% raw %}{{ i + 1 }}{% endraw %}"></item>
    </li>
  </ol>
  <div class="nav">
    <a href="" class="prev">
      ‹ Prev
    </a>
    <a href="" class="more">
      More ›
    </a>
  <div>
</div>
{% endhighlight %}

{% highlight javascript %}
// item.component.ts

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() itemID: number;

  constructor() { }

  ngOnInit() {
  }

}
{% endhighlight %}

{% highlight html %}
<!-- item.component.html -->

<p>Story #{% raw %}{{itemID}}{% endraw %}<p>
{% endhighlight %}

Refreshing the application will give you the same result, showing that the index parameter is successfully being passed down using the `@Input` decoration.

We have a basic skeleton of the home page done and that's a good start. Here's the [link](https://github.com/hdjirdeh/angular2-hn/tree/initial-setup) for the source code for this step.

RxJS and Observables
==================
Before we start fetching real data, let's briefly go over the concept of RxJS and observables.

Angular's [HTTP client](https://angular.io/docs/ts/latest/guide/server-communication.html) allows you to communicate with a server, and you need it to pretty much fetch data from anywhere. To fetch data from a server, the first thing you would most likely do is pass the resource URL through an `http.get` call. But what gets returned exactly?

In Angular 2, we use the [RxJS](https://github.com/Reactive-Extensions/RxJS) library to return an `Observable` of data, or an *asynchronous stream of data*. You may already be familiar with the concept of Promises and how you can use them to retrieve data asynchronously. Observables obtain data just like promises do, but they allow us to subscribe to the stream of data and respond to specific data changes that it emits.

![clicks event stream](https://camo.githubusercontent.com/36c0a9ffd8ed22236bd6237d44a1d3eecbaec336/687474703a2f2f692e696d6775722e636f6d2f634c344d4f73532e706e67 "Clicks Event Stream"){: .article-image-with-source }

{:clicks event stream: .image-source}
[Source: The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
{: clicks event stream}

The diagram above depicts the events that occur when a user clicks on a button. Notice how this stream can emit values (which represent the click events), an error and also a 'completed' event.

The entire concept of using Observables in your application is known as [Reactive Programming.](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

Observable Data Service
==================
Okay, now it’s time to start retrieving some real data. To do this, we’re going to be creating an Observable Data Service and injecting it into our components.

{% highlight bash %}
ng g service hackernews-api
{% endhighlight %}

That nicely creates and scaffolds a service file for us. Now before we dive in, let's try to understand how the [Hacker News API](https://github.com/HackerNews/API) works. If you take a look at the documentation, you'll notice that everything (polls, comments, stories, jobs) is just an item distinguishable though an `id` parameter. This means any item's information can be obtained from their specific URL.

{% highlight javascript %}
// https://hacker-news.firebaseio.com/v0/item/2.json?print=pretty

{
  "by" : "phyllis",
  "descendants" : 0,
  "id" : 2,
  "kids" : [ 454411 ],
  "score" : 16,
  "time" : 1160418628,
  "title" : "A Student's Guide to Startups",
  "type" : "story",
  "url" : "http://www.paulgraham.com/mit.html"
}
{% endhighlight %}

Now if we want to obtain information like front page ranking, we'll need to use another endpoint specific to the type of stories. For example, top stories can be retrieved like this.

{% highlight javascript %}
// https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty

[ 12426766, 12426315, 12424656, 12425725, 12426064, 12427341, 12425692, 12425776, 12425324, 12425750, 12425135, 12427073, 12425632, 12423733, 12425720, 12427135, 12425683, 12423794, 12424987, 12423809, 12424738, 12425119, 12426759, 12425711, 12422891, 12424731, 12423742, 12424131, 12424184, 12422833, 12424421, 12426729, 12423373, 12421687, 12427437 ...]
{% endhighlight %}

So to show the top stories on the front page, we'll need to first subscribe to this endpoint and then subsequently subscribe to each item. Let's dive in.

Since we would want a single instance of the service throughout the entire app, let's include it in the `provider` metadata of `NgModule`.

{% highlight javascript %}
// app.module.ts

//...
import { HackerNewsAPIService } from './hackernews-api.service';

@NgModule({
  declarations: [
    ...
   ],
  imports: [
    ...
  ],
  providers: [HackerNewsAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }

{% endhighlight %}

Now let's add some good stuff to our service.

{% highlight javascript %}
// hackernews-api.service.ts

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HackerNewsAPIService {
  baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = 'https://hacker-news.firebaseio.com/v0';
  }

  fetchStories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/topstories.json`)
                    .map(response => response.json());
  }
}
{% endhighlight %}

As we mentioned previously, the `http.get` call returns an Observable of data. If you look at `fetchStories`, we take in the Observable and then `map` it to a JSON format. Let's see how we handle this Observable in our component.  

{% highlight javascript %}
// stories.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HackerNewsAPIService } from '../hackernews-api.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})

export class StoriesComponent implements OnInit {
  items;

  constructor(private _hackerNewsAPIService: HackerNewsAPIService) {}

  ngOnInit() {
    this._hackerNewsAPIService.fetchStories()
                    .subscribe(
                      items => this.items = items,
                      error => console.log('Error fetching stories'));
  }
}
{% endhighlight %}

In the `ngOnInit` hook, which fires when the component is initialized, we `subscribe` to the data stream. In our view, the only thing we're going to add is a `SlicePipe` to only show 30 list items.

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol>
    <li *ngFor="let item of items | slice:0:30" class="post">
      <item class="item-block" itemID="{{ item }}"></item>
    </li>
  </ol>
  <!-- ... -->
</div>
{% endhighlight %}

Now if you run the application, you'll see a list of item ids populated.

![item id list](https://files.slack.com/files-tmb/T0LA4NDHS-F286ZFEJ3-138525aa2c/pasted_image_at_2016_09_05_12_40_am_1024.png "Item ID List"){: .article-image }

Since we have the item id's being passed down successfully to each of the `item` components, let's set up another Observable subscription for each item to show their details. To do this, let's start by adding a new method to our service.

{% highlight javascript %}
// hackernews-api.service.ts

//...

fetchItem(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/item/${id}.json`)
                  .map(response => response.json());
} 
{% endhighlight %}

And now we need to modify our `item` component a bit.

{% highlight javascript %}
// item.component.ts

import { Component, Input, OnInit } from '@angular/core';

import { HackerNewsAPIService } from '../hackernews-api.service';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() itemID: number;
  item;

  constructor(private _hackerNewsAPIService: HackerNewsAPIService) {}

  ngOnInit() {
    this._hackerNewsAPIService.fetchItem(this.itemID).subscribe(data => {
      this.item = data;
    }, error => console.log('Could not load item' + this.itemID));
  }
}
{% endhighlight %}

{% highlight html %}
<div *ngIf="!item" class="loading-section">
  <!-- Loading bars that show when item hasn't rendered yet -->
</div>
<div *ngIf="item">
  <div class="item-laptop">
    <p> 
      <a class="title" href="{{item.url}}">
        {% raw %}{{item.title}}{% endraw %}
      </a>
      <span class="domain">{% raw %}{{item.url | domain}}{% endraw %}</span>
    </p>
    <div class="subtext">
      {% raw %}{{item.score}}{% endraw %} points by 
      <a href="">{{item.by}}</a>
      {% raw %}{{ (item.time | amFromUnix) | amTimeAgo }}{% endraw %}
      <a href="">
        <span *ngIf="item.descendants !== 0">
          {% raw %}{{item.descendants}}{% endraw %}
          <span *ngIf="item.descendants === 1">comment</span>
          <span *ngIf="item.descendants > 1">comments</span>
        </span>
        <span *ngIf="item.descendants === 0">discuss</span>
      </a>
    </div>
  </div>
  <div class="item-mobile">
    <!-- Markup that shows only on mobile (to give the app a
    responsive mobile feel). Same attributes as above 
    nothing really new here (but refer to the source 
    file if you're interested) -->
  </div>
</div>
{% endhighlight %}

Nice and straightforward. For each item, we're subscribing to their respective stream. In the markup, we can see that when the response hasn't been received yet (`*ngIf="!item"`), we show a loading icon. Once the item loads from the Observable (`*ngIf="!item"`), it's details will show. Click [here](https://github.com/hdjirdeh/angular2-hn/tree/first-page/src/app/item) to see all the files for this component.

*Note: You may be wondering where the `amFromUnix` and `amTimeAgo` pipes came from. The time parameter for each item is in [Unix](https://en.wikipedia.org/wiki/Unix_time) format. To convert this into something we can understand, I use [moment.js](http://momentjs.com/) pipes by importing the [angular2-moment](https://github.com/urish/angular2-moment) library.*

*Note 2: For each item with a link, the entire URL is passed through it's `url` attribute. To only show a concatenated version of the URL, I created a pipe called `domain`. Take a [look](https://github.com/hdjirdeh/angular2-hn/blob/first-page/src/app/domain.pipe.ts) here for the code.*

Now if you run the application, you'll see the first page of Hacker News! Click [here](https://github.com/hdjirdeh/angular2-hn/tree/first-page) for the full source code until this step.

![top stories](https://files.slack.com/files-pri/T0LA4NDHS-F2872D188/pasted_image_at_2016_09_05_02_15_am.png "Top Stories"){: .article-image }

Routing
==================

We've come quite a long way, but before we continue let's map out everything we have left to include in our application.

To allow the user to navigate between all these components, we're going to have to add Routing.

We're almost done now! All that's left now is just to bundle and deploy this bad boy to a production environment.

Bundling and deployment
==================

Using the Firebase CLI.

![that's a wrap]({{ site.url }}/public/thatsawrap.jpg "That's a wrap"){: .article-image }

Wrapping things up
==================

Useful resources
==================
An excellent resource comparing Observables and Promises. [link](https://egghead.io/lessons/rxjs-rxjs-observables-vs-promises)