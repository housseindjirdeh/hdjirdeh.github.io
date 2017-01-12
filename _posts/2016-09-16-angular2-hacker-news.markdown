---
layout: post
title:  "Building Hacker News with Angular 2 CLI, RxJS and Webpack"
date:   2016-09-16 9:20:00 -0400
categories: angular rxjs webpack
description: If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team has rolled out Angular CLI, a command line interface that makes creating and scaffolding an application significantly easier...
tags:
- angular
- rxjs
- webpack
comments: true
type: post
image: public/angular2-hn.jpg
permalink: /:title
---
![angular 2 hn banner](https://i.imgur.com/V0tNgEr.jpg "Angular 2 HN Banner"){: .article-image }

If you have ever built an Angular 2 application before, you'll know that setting up and bootstrapping an application can take a significant amount of time. Thankfully, the Angular team have rolled out [Angular CLI](https://cli.angular.io/), a command line interface that makes creating and scaffolding an application significantly easier.

In this post, we'll build an entire [Hacker News](https://news.ycombinator.com/) client using Angular CLI, RxJS Observables and Webpack as our module loader.

<div class="button-center">
  <a class="blog-button" href="https://angular2-hn.firebaseapp.com/">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/angular2-hn">Source Code</a>
</div>

![angular 2 hn preview](https://i.imgur.com/3gIhXqC.gif "Angular 2 HN Preview"){: .article-image }

We'll go through building the entire application step by step. Throughout this post, I'll try my best to explain my thought process as well as some of the mistakes I've made and what I did to fix them.

Here's a rundown of what we'll be doing.

1. We'll start by building our basic setup first, the front page of Hacker News
2. We'll then wrap an Observable Data Service to load data asynchronously
3. To allow the user to navigate between different pages and story types, we'll add routing using the [Angular Component Router](https://angular.io/docs/ts/latest/guide/router.html)
4. Finally, we'll add routes to allow the user to navigate to item comments and user profiles.

This visual tutorial should make you feel a little more comfortable building an Angular 2 application from small modular parts as well as creating an app from scratch all the way to completion. We'll also briefly go over some important topics and understand how they apply to an actual application, which includes:

1. The `NgModule` decorator<br>
2. View Encapsulation<br>
3. RxJS

Getting Started
==================
Once you have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), you can install the CLI through your terminal.

{% highlight bash %}
npm install -g angular-cli
{% endhighlight %}

You can then create and start your application.

{% highlight bash %}
ng new angular2-hn
cd angular2-hn
ng serve
{% endhighlight %}

If you now open `https://localhost:4200/`, you'll see the application running.

![app setup](https://i.imgur.com/4ME0JaW.png "App Setup"){: .article-image }

Pretty cool huh? Angular CLI used to use [SystemJS](https://github.com/systemjs/systemjs) as the module bundler and loader. Using SystemJS had a few quirks including long loading times and a lengthy process just to add third party libraries. So to make things simpler and faster, the Angular CLI team have moved from [SystemJS to Webpack!](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#100-beta11-webpack-2016-08-02)

NgModule
==================
Bootstrapping an application with CLI uses Angular's latest release version, but let's go over one of the biggest changes that happened with the release of [RC5](https://angularjs.blogspot.se/2016/08/angular-2-rc5-ngmodules-lazy-loading.html), the `@NgModule` decorator. We can see it being used in the `app.module.ts` file.

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
Let's set up [Sass](http://sass-lang.com/) as our CSS preprocessor. The CLI makes it simple for a project that's already been started.

{% highlight bash %}
ng set defaults.styleExt scss
{% endhighlight %}

*Note: If you're seeing a weird error here, you can just set the default style extension to `scss` in `angular-cli.json` instead and restart the server. Take a look at this [issue](https://github.com/angular/angular-cli/issues/1900).*

Now that we have everything set up, we can create our first few components. To start things off, we'll create a `HeaderComponent`.

{% highlight bash %}
ng generate component Header
{% endhighlight %}

You'll notice that a `header` folder is immediately created and scaffolded with the following files created.

- `header.component.scss`<br>
- `header.component.html`<br>
- `header.component.ts`<br>
- `header.component.spec.ts`

![Unit Tests](https://i.imgur.com/ET1JQLg.jpg "Unit Tests"){: .article-image }

I'm only joking, unit testing is always important for apps that go to production. We won't be doing them for this tutorial however so feel free to delete/comment out the `spec` files.

Take a look at `app.module.ts` once again and you'll notice that our component is now declared there as well.

{% highlight javascript %}
// app.module.ts

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

If you take a look at `header.component.ts`, you can see that its component selector is `app-header`. Let's add this in our root component, `app.component.ts`.

{% highlight html %}
<!-- app.component.html -->

<app-header></app-header>
{% endhighlight %}

Running the application will show you that the header component loads successfully.

![header loads](https://i.imgur.com/8upqeWW.png "Header Loads"){: .article-image }

Sweet, now let's add some markup and styling.

{% highlight html %}
<!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
</div>
{% endhighlight %}

The styling in `app.component.scss` can be found [here](https://github.com/housseindjirdeh/angular2-hn/blob/initial-setup/src/app/app.component.scss). Now let's work on the header.

{% highlight html %}
<!-- header.component.html -->

<header id="header">
  <a class="home-link" href="/">
    <img class="logo" src="https://i.imgur.com/J303pQ4.png">
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

And similarly, you can find the styling for this component [here](https://github.com/housseindjirdeh/angular2-hn/blob/initial-setup/src/app/header/header.component.scss). Running the application gives us the following result.

![header](https://i.imgur.com/oLAH0EJ.png "Header"){: .article-image }

View Encapsulation
==================
Since we want this application to be as responsive as possible, it's important to check how it looks with different screen sizes regularly. Let's adjust our viewport to see how it would look on a mobile device.

![header mobile](https://i.imgur.com/UGyVSEi.png "Header Mobile"){: .article-image }

As you can see, there seems to be an offset from the edge of the page. This is because the `body` element has a bult-in offset (through `margin`) that shows in almost all modern browsers.

![body margin](https://i.imgur.com/gpogcbO.png "body margin"){: .article-image }

But if you take a look at `app.component.scss`, we explicity set `margin: 0` for screen sizes less then 768px.

{% highlight css %}
$mobile-only: "only screen and (max-width : 768px)";

body {
  margin-bottom: 0;

  @media #{$mobile-only} {
    margin: 0;
  }
}
{% endhighlight %}

So why isn't this rendering the way it should? This is because of the way Angular encapsulates CSS styles onto a component. I won't be going into too much detail here, but there are three different ways Angular does this.

- `None`: Angular doesn't do anything. No encapsulation and no Shadow DOM, this is just like adding styles regularly. Adding a style will apply to the entire document.
- `Emulated`: Angular *emulates* Shadow DOM behaviour. This is the default.
- `Native`: Angular uses the browser's native Shadow DOM completely (make sure you're using a [browser that supports this](http://caniuse.com/#feat=shadowdom).

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

Take a look at our application once more and you'll notice that the styles have now been applied to `body`. This is because all of the styles in this component now affect the entire document.

![header fixed](https://i.imgur.com/SK0RhAr.png "Header Fixed"){: .article-image }

But wait a minute, was all of this really necessary? I see a `styles.css` file in our `src` folder. Isn't this for global styles? Can't we just add a class here to style `body`?

Yes you can, but hey at least we learned something here. <i class="fa fa-smile-o" aria-hidden="true"></i>

![face palm](https://i.imgur.com/WtE1S58.jpg "Face Palm"){: .article-image }

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
    this.items = Array(30);
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
      Story #{% raw %}{{i}}{% endraw %}
    </li>
  </ol>
  <div class="nav">
    <a href="" class="prev">
      ‹ Prev
    </a>
    <a href="" class="more">
      More ›
    </a>
  </div>
</div>
{% endhighlight %}

Click [here](https://github.com/housseindjirdeh/angular2-hn/blob/initial-setup/src/app/stories/stories.component.scss) to take a look at the styles for `Stories`. Our footer is straightfoward (and it's styling can be found [here](https://github.com/housseindjirdeh/angular2-hn/blob/initial-setup/src/app/footer/footer.component.scss)).

{% highlight bash %}
ng g component Footer
{% endhighlight %}

{% highlight html %}
<!-- footer.component.html -->

<div id="footer">
    <p>Show this project some ❤ on
      <a href="https://github.com/housseindjirdeh/angular2-hn" target="_blank">
        GitHub
      </a>
    </p>
</div>
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

![numbered list](https://i.imgur.com/r5cQTZ9.png "Numbered List"){: .article-image }

Since each post, or item, will have its own attributes, it makes sense to create a component for this as well.

{% highlight bash %}
ng g component Item
{% endhighlight %}

Once we start getting real data, we'll need to pass down the item identifier from the story component to it's child item component. In the meantime, let's just pass down the list index as `itemID`.

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol>
    <li *ngFor="let item of items; let i = index" class="post">
      <item class="item-block" itemID="{% raw %}{{ i + 1 }}{% endraw %}"></item>
    </li>
  </ol>
  <div class="nav">
    <a href="" class="prev">
      ‹ Prev
    </a>
    <a href="" class="more">
      More ›
    </a>
  </div>
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

We have a basic skeleton of the home page done and that's a good start. Here's the [link](https://github.com/housseindjirdeh/angular2-hn/tree/initial-setup) for the source code for this step.

RxJS and Observables
==================
Before we start fetching real data, let's briefly go over the concept of RxJS and observables.

Angular's [HTTP client](https://angular.io/docs/ts/latest/guide/server-communication.html) allows you to communicate with a server, and you need it to fetch data from anywhere. To fetch data from a server, the first thing you would most likely do is pass the resource URL through an `http.get` call. But what gets returned exactly?

In Angular 2, we use the [RxJS](https://github.com/Reactive-Extensions/RxJS) library to return an `Observable` of data, or an *asynchronous stream of data*. You may already be familiar with the concept of Promises and how you can use them to retrieve data asynchronously. Observables obtain data just like promises do, but they allow us to subscribe to the stream of data and respond to specific data changes that it emits.

![clicks event stream](https://i.imgur.com/w3cwr9j.png "Clicks Event Stream"){: .article-image-with-source }

{:clicks event stream: .image-source}
[Source: The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
{: clicks event stream}

The diagram above depicts the events that occur when a user clicks on a button. Notice how this stream emits values (which represent the click events), an error as well as a completed event.

The entire concept of using Observables in your application is known as [Reactive Programming.](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

Observable Data Service
==================
Okay, now it’s time to start retrieving some real data. To do this, we’re going to be creating an Observable Data Service and injecting it into our components.

{% highlight bash %}
ng g service hackernews-api
{% endhighlight %}

This creates and sets up a service file for us. Now before we dive in, let's try to understand how the official Hacker News API works. If you take a look at the [documentation](https://github.com/HackerNews/API), you'll notice that everything (polls, comments, stories, jobs) is just an item distinguishable though an `id` parameter. This means any item's information can be obtained from their specific URL.

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
  "url" : "https://www.paulgraham.com/mit.html"
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

Now let's add the request method to our service.

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

In the `ngOnInit` hook, which fires when the component is initialized, we `subscribe` to the data stream and set the `items` attribute to what gets returned. In our view, the only thing we're going to add is a `SlicePipe` to show 30 list items instead of all 500 which gets returned.

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <ol>
    <li *ngFor="let item of items | slice:0:30" class="post">
      <item class="item-block" itemID="{% raw %}{{ item }}{% endraw %}"></item>
    </li>
  </ol>
  <!-- ... -->
</div>
{% endhighlight %}

Now if you run the application, you'll see a list of item ids populated.

![item id list](https://i.imgur.com/Bj2MSeX.png "Item ID List"){: .article-image }

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
<!-- item.component.html -->

<div *ngIf="!item" class="loading-section">
  <!-- You can add a loading indicator here if you want to :) </i> -->
</div>
<div *ngIf="item">
  <div class="item-laptop">
    <p>
      <a class="title" href="{% raw %}{{item.url}}{% endraw %}">
        {% raw %}{{item.title}}{% endraw %}
      </a>
      <span class="domain">{% raw %}{{item.url | domain}}{% endraw %}</span>
    </p>
    <div class="subtext-laptop">
      {% raw %}{{item.score}}{% endraw %} points by
      <a href="">{% raw %}{{item.by}}{% endraw %}</a>
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

Nice and straightforward. For each item, we're subscribing to their respective stream. In the markup, we can see that when the response hasn't been received yet, we have a loading section where we can show a loading indicator of some sort. Once the item loads from the Observable, it's details will show. Click [here](https://github.com/housseindjirdeh/angular2-hn/tree/first-page/src/app/item) to see all the files for this component including styling.

*Note: You may be wondering where the `amFromUnix` and `amTimeAgo` pipes came from. The time parameter for each item is in [Unix](https://en.wikipedia.org/wiki/Unix_time) format. To convert this into something we can understand, I use [moment.js](https://momentjs.com/) pipes by importing the [angular2-moment](https://github.com/urish/angular2-moment) library.*

*Note 2: For each item with a link, the entire URL is passed through it's `url` attribute. To only show the link domain, I created a pipe called `domain`. Take a look [here]((https://github.com/housseindjirdeh/angular2-hn/blob/first-page/src/app/domain.pipe.ts)) for the code.*

Now if you run the application, you'll see the first page of Hacker News! Click [here](https://github.com/housseindjirdeh/angular2-hn/tree/first-page) for the full source code until this step.

![top stories](https://i.imgur.com/VLKj7xr.png "Top Stories"){: .article-image }

Things are kinda slow though
==================
Let's take a look at the requests transferred when we load the front page of our application.

![front page requests](https://i.imgur.com/j99CNyz.png "Front Page Requests"){: .article-image }

Woah, 31 requests and 20.8KB transferred in 546ms. This takes almost five times as long loading the front page of Hacker News and more then twice as much data to just load the posts. This is pretty darn slow, and maybe it's kind of tolerable when you're loading the list of posts on the front page but this is a serious problem if we try loading a large number of comments for a single post.

I built the entire application with each component using this method, including each post and their comments. You can take a look at what happens when I try to load a post with almost 2000 comments [here](https://media.giphy.com/media/3o6Zt9ZBEDjwiPDjz2/giphy.gif). But to save you time from watching that entire gif, it takes **741 requests, 1.5MB and 90s** to load roughly 700 of the comments (I wasn't patient enough to wait for every comment to load).

*Just for reference's sake, I still have this version of the app up on my GitHub pages. At your own caution, you can take a look at how long it takes to load this many comments [here](https://houssein.me/angular2-hn/item/12445994)*.

Let's switch things up
==================
Okay, now we can see why having multiple network connections to fetch a parent item and it's content isn't the nicest experience. After a little bit of searching, I found this awesome [unofficial API](https://github.com/cheeaun/node-hnapi) which returns an item and it's details through a single request.

For example, the response for the list of top stories looks like this.

{% highlight javascript %}
// https://node-hnapi.herokuapp.com/news?page=1

[
  {
    "id": 12469856,
    "title": "Owl Lisp – A purely functional Scheme that compiles to C",
    "points": 57,
    "user": "rcarmo",
    "time": 1473524669,
    "time_ago": "2 hours ago",
    "comments_count": 9,
    "type": "link",
    "url": "https://github.com/aoh/owl-lisp",
    "domain": "github.com"
  },
  {
    "id": 12469823,
    "title": "How to Write Articles and Essays Quickly and Expertly",
    "points": 52,
    "user": "bemmu",
    "time": 1473524142,
    "time_ago": "2 hours ago",
    "comments_count": 6,
    "type": "link",
    "url": "https://www.downes.ca/post/38526",
    "domain": "downes.ca"
  },
  ...
]
{% endhighlight %}

Notice that there is a `domain` as well as a `time_ago` attribute which is pretty cool. This means we can ditch the `domain.pipe.ts` file I created earlier as well as uninstall the `angular2-moment` library. Let's take a look at what we need to change in our data service.

{% highlight javascript %}
// hackernews-api.service.ts

export class HackerNewsAPIService {
  baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = 'https://node-hnapi.herokuapp.com';
  }

  fetchStories(storyType: string, page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${storyType}?page=${page}`)
                    .map(response => response.json());
  }
}
{% endhighlight %}

Since the API doesn't load all 500 top stories, we need to add page number as an argument. Notice how we're also passing `storyType` as well. This will allow us to show different types of stories depending on where the user navigates to.

Let's take a look at how we can change the stories component. We can start with just passing in `'news'` and page number `1` into our service call to get our top stories.

{% highlight javascript %}
// stories.component.ts

export class StoriesComponent implements OnInit {
  items;

  constructor(private _hackerNewsAPIService: HackerNewsAPIService) {}

  ngOnInit() {
    this._hackerNewsAPIService.fetchStories('news', 1)
                              .subscribe(
                                items => this.items = items,
                                error => console.log('Error fetching stories'));
  }
}
{% endhighlight %}

The correpsonding markup is as follows.

{% highlight html %}
<!-- stories.component.html -->

<div class="loading-section" *ngIf="!items">
  <!-- You can add a loading indicator here if you want to :) -->
</div>
<div *ngIf="items">
  <ol>
    <li *ngFor="let item of items" class="post">
      <item class="item-block" [item]="item"></item>
    </li>
  </ol>
  <div class="nav">
    <a class="prev">
      ‹ Prev
    </a>
    <a class="more">
      More ›
    </a>
  </div>
</div>
{% endhighlight %}

Since all our item components are not loading individually async anymore, we set up the loading section (where we can have a loading indicator) here. Moreover, we just pass in the item object of each post to the child item component.

This means we should be able to clean things up in `ItemComponent`. In `item.component.ts`, we don't need to inject `HackerNewsService` anymore and our component is now simply a conduit to take in the item object from it's parent.

{% highlight javascript %}
// item.component.ts

export class ItemComponent implements OnInit {
  @Input() item;

  constructor() {}

  ngOnInit() {

  }
}
{% endhighlight %}

The markup (`item.component.html`) is very similar, but we now don't need to conditionally check if the item object is present anymore (we do that in the parent component). Moreover, each parameter now refers to the properties of our new API.

{% highlight html %}
<!-- item.component.html -->

<div class="item-laptop">
  <p>
    <a class="title" href="">
      {% raw %}{{item.title}}{% endraw %}
    </a>
    <span *ngIf="item.domain" class="domain">({% raw %}{{item.domain}}{% endraw %})</span>
  </p>
  <div class="subtext-laptop">
    <span>
      {% raw %}{{item.points}}{% endraw %} points by
      <a href="">{% raw %}{{item.user}}{% endraw %}</a>
    </span>
    <span>
      {% raw %}{{item.time_ago}}{% endraw %}
      <span> |
        <a href="">
          <span *ngIf="item.comments_count !== 0">
            {% raw %}{{item.comments_count}}{% endraw %}
            <span *ngIf="item.comments_count === 1">comment</span>
            <span *ngIf="item.comments_count > 1">comments</span>
          </span>
          <span *ngIf="item.comments_count === 0">discuss</span>
        </a>
      </span>
    </span>
  </div>
</div>
<div class="item-mobile">
  <!-- Markup that shows only on mobile (to give the app a
    responsive mobile feel). Same attributes as above
    nothing really new here (but refer to the source
    file if you're interested) -->
</div>
{% endhighlight %}

Now let's see what happens when we run this bad boy.

![front page](https://i.imgur.com/VLKj7xr.png "Front Page"){: .article-image }

And now everything loads much faster. The source code for this step can be found [here](https://github.com/housseindjirdeh/angular2-hn/tree/first-page-final).

Routing
==================

We've come quite a long way, but before we continue let's map out the entire component structure of the application. Please excuse my funky Powerpoint skills.

Let's start with what we've built so far.

![front page components](https://i.imgur.com/zUH1SPy.png "Front Page Components"){: .article-image }

Let's also map out the components that show when we navigate to the comments page.

![item comments components](https://i.imgur.com/XttxmfM.png "Item Comment Components"){: .article-image }

To allow the user to navigate between these pages, we're going to have to include some basic routing in our application. Before we begin, let's create our next component.

{% highlight bash %}
ng g component ItemComments
{% endhighlight %}

Now let's create an `app.routes.ts` file in our `app` folder.

{% highlight javascript %}
// app.routes.ts

import { Routes, RouterModule } from '@angular/router';

import { StoriesComponent } from './stories/stories.component';
import { ItemCommentsComponent } from './item-comments/item-comments.component';

const routes: Routes = [
  {path: '', redirectTo: 'news/1', pathMatch : 'full'},
  {path: 'news/:page', component: StoriesComponent, data: {storiesType: 'news'}},
  {path: 'newest/:page', component: StoriesComponent, data: {storiesType: 'newest'}},
  {path: 'show/:page', component: StoriesComponent, data: {storiesType: 'show'}},
  {path: 'ask/:page', component: StoriesComponent, data: {storiesType: 'ask'}},
  {path: 'jobs/:page', component: StoriesComponent, data: {storiesType: 'jobs'}},
  {path: 'item/:id', component: ItemCommentsComponent}
];

export const routing = RouterModule.forRoot(routes);
{% endhighlight %}

An overview of what we're doing here:

1. We just created an array of routes, each with a relative *path* that maps to a specific *component*<br>
2. Our header navigation links will route to a number of different paths; `news`, `newest`, `show`, `ask` and `jobs`. All these paths will map to our `StoriesComponent`
3. We've set up our root path to redirect to `news` which should return the list of top stories
3. When we map to `StoriesComponent`, we pass down `storiesType` as a parameter through the `data` property. This lets us have a story type associated for each route (we'll need this when we use our data service to fetch the list of stories)
4. `:page` is used as a token so that `StoriesComponent` can fetch the list of stories for a specific page
5. `:id` is similarly used so that `ItemCommentsComponent` can obtain all the comments for a specific item

There's a lot more you can do with routing, but this basic setup should be everything we need. Now let's open `app.module.ts` to register our routing.

{% highlight javascript %}
// app.module.ts

// ...
import { routing } from './app.routes';

@NgModule({
  declarations: [
    //...
  ],
  imports: [
    //...
    routing
  ],
  providers: [HackerNewsAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
{% endhighlight %}

To tell Angular where to load the component to route to, we need to use `RouterOutlet`.

{% highlight html %}
<!-- app.component.html -->

<div id="wrapper">
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
</div>
{% endhighlight %}

Story Navigation
==================

Let's bind our navigation links in `HeaderComponent` to their respective routes.

{% highlight html %}
<!-- header.component.html -->

<header>
  <div id="header">
    <a class="home-link" routerLink="/news/1">
      <img class="logo" src="https://i.imgur.com/J303pQ4.png">
    </a>
    <div class="header-text">
      <div class="left">
        <h1 class="name">
          <a routerLink="/news/1" class="app-title">Angular 2 HN</a>
        </h1>
        <span class="header-nav">
          <a routerLink="/newest/1">new</a>
          <span class="divider">
            |
          </span>
          <a routerLink="/show/1">show</a>
          <span class="divider">
            |
          </span>
          <a routerLink="/ask/1">ask</a>
          <span class="divider">
            |
          </span>
          <a routerLink="/jobs/1">jobs</a>
        </span>
      </div>
      <div class="info">
        Built with <a href="https://cli.angular.io/" target="_blank">Angular CLI</a>
      </div>
    </div>
  </div>
</header>
{% endhighlight %}

The `RouterLink` directive is responsible for binding a specific element to a route. Let's update the `StoriesComponent` now.

{% highlight javascript %}
// stories.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { HackerNewsAPIService } from '../hackernews-api.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})

export class StoriesComponent implements OnInit {
  typeSub: any;
  pageSub: any;
  items;
  storiesType;
  pageNum: number;
  listStart: number;

  constructor(
    private _hackerNewsAPIService: HackerNewsAPIService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.typeSub = this.route
      .data
      .subscribe(data => this.storiesType = (data as any).storiesType);

    this.pageSub = this.route.params.subscribe(params => {
      this.pageNum = +params['page'] ? +params['page'] : 1;
      this._hackerNewsAPIService.fetchStories(this.storiesType, this.pageNum)
                              .subscribe(
                                items => this.items = items,
                                error => console.log('Error fetching' + this.storiesType + 'stories'),
                                () => this.listStart = ((this.pageNum - 1) * 30) + 1);
    });
  }
}
{% endhighlight %}

Let's parse out what we've added. First of all, we imported `ActivatedRoute` which is a service that allows us to access information present in the route.

{% highlight javascript %}
import { ActivatedRoute } from '@angular/router';

@Component({
  //...
})

export class StoriesComponent implements OnInit {
//..

constructor(
  private route: ActivatedRoute
) {}
//...
}
{% endhighlight %}

We then subscribe to the route data property and store `storiesType` into a component variable in the `ngOnInit` hook. Notice how we assign any type to the response object. This is just a quick and simple way to opt-out of type checking. Otherwise you may see an error that states property `storiesType` does not exist.

{% highlight javascript %}
ngOnInit() {
  this.typeSub = this.route
    .data
    .subscribe(data => this.storiesType = (data as any).storiesType);

// ...
}
{% endhighlight %}

And finally, we subscribe to the route parameters and obtain the page number. We then fetch the list of stories using our data service.

{% highlight javascript %}
ngOnInit() {
// ...

this.pageSub = this.route.params.subscribe(params => {
    this.pageNum = +params['page'] ? +params['page'] : 1;
    this._hackerNewsAPIService.fetchStories(this.storiesType, this.pageNum)
                            .subscribe(
                              items => this.items = items,
                              error => console.log('Error fetching' + this.storiesType + 'stories'),
                              () => {
                                this.listStart = ((this.pageNum - 1) * 30) + 1;
                                window.scrollTo(0, 0);
                              });
  });
}
{% endhighlight %}

To signal completion, we use `onCompleted()` to update a `listStart` variable which is used as the starting value of our ordered list (which you can see in the markup below). We also scroll to the top of the window so the user is not stuck at the bottom of the page when he/she tries to switch pages.

{% highlight html %}
<!-- stories.component.html -->

<div class="main-content">
  <div class="loading-section" *ngIf="!items">
    <!-- You can add a loading indicator here if you want to :) -->
  </div>
  <div *ngIf="items">
    <ol start="{% raw %}{{ listStart }}{% endraw %}">
      <li *ngFor="let item of items" class="post">
        <item class="item-block" [item]="item"></item>
      </li>
    </ol>
    <div class="nav">
      <a *ngIf="listStart !== 1" [routerLink]="['/' + storiesType, pageNum - 1]" class="prev">
        ‹ Prev
      </a>
      <a *ngIf="items.length === 30" [routerLink]="['/' + storiesType, pageNum + 1]" class="more">
        More ›
      </a>
    </div>
  </div>
</div>
{% endhighlight %}

We now have the front page complete with [navigation and pagination](https://media.giphy.com/media/l3vR4zR3rCMX76Pm0/giphy.gif). Run the application to see the good stuff.

Item Comments
==================
We're almost done! Before we start adding our other comment page components, let's update the links in `ItemComponent` to include routing.

{% highlight html %}
<!-- item.component.html -->

<div class="item-laptop">
  <p>
    <a class="title" href="{% raw %}{{item.url}}{% endraw %}">
      {% raw %}{{item.title}}{% endraw %}
    </a>
    <span *ngIf="item.domain" class="domain">({% raw %}{{item.domain}}{% endraw %})</span>
  </p>
  <div class="subtext-laptop">
    <span>
      {% raw %}{{item.points}}{% endraw %} points by
      <a href="">{% raw %}{{item.user}}{% endraw %}</a>
    </span>
    <span>
      {% raw %}{{item.time_ago}}{% endraw %}
      <span> |
         <a [routerLink]="['/item', item.id]">
          <span *ngIf="item.comments_count !== 0">
            {% raw %}{{item.comments_count}}{% endraw %}
            <span *ngIf="item.comments_count === 1">comment</span>
            <span *ngIf="item.comments_count > 1">comments</span>
          </span>
          <span *ngIf="item.comments_count === 0">discuss</span>
        </a>
      </span>
    </span>
  </div>
</div>
<div class="item-mobile">
  <!-- Markup that shows only on mobile (to give the app a
    responsive mobile feel). Same attributes as above,  
    nothing really new here (but refer to the source
    file if you're interested) -->
</div>
{% endhighlight %}

Run the application and click on an item's comments.

![item comments route](https://i.imgur.com/tvCNyWz.png "Item Comments Route"){: .article-image }

Beauty. We can see that it's routing to `ItemCommentsComponent`. Now let's create our additional components.

{% highlight bash %}
ng g component CommentTree
{% endhighlight %}

{% highlight bash %}
ng g component Comment
{% endhighlight %}

We should add a new `GET` request to our data service to fetch comments, so let's do that before we start filling our components in.

{% highlight javascript %}
// hackernews.api.service.ts

//...

fetchComments(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/item/${id}`)
                  .map(response => response.json());
}
{% endhighlight %}

And now we can fill out our components.

{% highlight javascript %}
// item-comments.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HackerNewsAPIService } from '../hackernews-api.service';

@Component({
  selector: 'app-item-comments',
  templateUrl: './item-comments.component.html',
  styleUrls: ['./item-comments.component.scss']
})
export class ItemCommentsComponent implements OnInit {
  sub: any;
  item;

  constructor(
    private _hackerNewsAPIService: HackerNewsAPIService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {    
    this.sub = this.route.params.subscribe(params => {
      let itemID = +params['id'];
      this._hackerNewsAPIService.fetchComments(itemID).subscribe(data => {
        this.item = data;
      }, error => console.log('Could not load item' + itemID));
    });
  }
}
{% endhighlight %}

Similar to what we did in `StoriesComponent`, we subscribe to our route parameters, obtain the item id and use that to fetch our comments.

{% highlight html %}
<!-- item-comments.component.html -->

<div class="main-content">
  <div class="loading-section" *ngIf="!item">
    <!-- You can add a loading indicator here if you want to :) -->
  </div>
  <div *ngIf="item" class="item">
    <div class="mobile item-header">
     <!-- Markup that shows only on mobile (to give the app a
    responsive mobile feel). Same attributes as below,
    nothing really new here (but refer to the source
    file if you're interested) -->
    </div>
    <div class="laptop" [class.item-header]="item.comments_count > 0 || item.type === 'job'" [class.head-margin]="item.text">
      <p>
        <a class="title" href="{% raw %}{{item.url}}{% endraw %}">
        {% raw %}{{item.title}}{% endraw %}
        </a>
        <span *ngIf="item.domain" class="domain">({% raw %}{{item.domain}}{% endraw %})</span>
      </p>
      <div class="subtext">
        <span>
        {% raw %}{{item.points}}{% endraw %} points by
          <a href="">{% raw %}{{item.user}}{% endraw %}</a>
        </span>
        <span>
          {% raw %}{{item.time_ago}}{% endraw %}
          <span> |
            <a [routerLink]="['/item', item.id]">
              <span *ngIf="item.comments_count !== 0">
                {% raw %}{{item.comments_count}}{% endraw %}
                <span *ngIf="item.comments_count === 1">comment</span>
                <span *ngIf="item.comments_count > 1">comments</span>
              </span>
              <span *ngIf="item.comments_count === 0">discuss</span>
            </a>
          </span>
        </span>
      </div>
    </div>
    <p class="subject" [innerHTML]="item.content"></p>
    <app-comment-tree [commentTree]="item.comments"></app-comment-tree>
  </div>
</div>
{% endhighlight %}

At the top of the component, we're going to display the item details, followed by it's description (`item.content`). We then input the entire comments object (`item.comments`) to `app-comment-tree`, the selector for `CommentTreeComponent`. The styling for this component can be found [here](https://github.com/housseindjirdeh/angular2-hn/blob/item-comments/src/app/item-comments/item-comments.component.scss).

Next, set up the `CommentTreeComponent`.

{% highlight javascript %}
// comment-tree.component.ts

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-tree',
  templateUrl: './comment-tree.component.html',
  styleUrls: ['./comment-tree.component.scss']
})
export class CommentTreeComponent implements OnInit {
  @Input() commentTree;

  constructor() {}

  ngOnInit() {

  }
}
{% endhighlight %}

{% highlight html %}
<!-- comment-tree.component.html -->

<ul class="comment-list">
   <li *ngFor="let comment of commentTree" >
      <app-comment [comment]="comment"></app-comment>
   </li>
</ul>
{% endhighlight %}

Nice and simple, we list all the comments using the `ngFor` directive. Click [here](https://github.com/housseindjirdeh/angular2-hn/blob/item-comments/src/app/comment-tree/comment-tree.component.scss) to see it's SCSS file.

Let's fill out `CommentComponent`, the component responsible for each specific comment.

{% highlight javascript %}
// comment.component.ts

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment;
  collapse: boolean;

  constructor() {}

  ngOnInit() {
    this.collapse = false;
  }
}
{% endhighlight %}

{% highlight html %}
<!-- comment.component.html -->

<div *ngIf="!comment.deleted">
  <div class="meta" [class.meta-collapse]="collapse">
    <span class="collapse" (click)="collapse = !collapse">[{% raw %}{{collapse ? '+' : '-'}}{% endraw %}]</span>
    <a [routerLink]="['/user', comment.user]" routerLinkActive="active">{% raw %}{{comment.user}}{% endraw %}</a>
    <span class="time">{% raw %}{{comment.time_ago}}{% endraw %}</span>
  </div>
  <div class="comment-tree">
    <div [hidden]="collapse">
      <p class="comment-text" [innerHTML]="comment.content"></p>
      <ul class="subtree">
        <li *ngFor="let subComment of comment.comments">
          <app-comment [comment]="subComment"></app-comment>
        </li>
      </ul>
    </div>
  </div>
</div>
<div *ngIf="comment.deleted">
  <div class="deleted-meta">
    <span class="collapse">[deleted]</span> | Comment Deleted
  </div>
</div>
{% endhighlight %}

Notice how we're recursively referencing `app-comment` inside of it's own component. This is because each comment object in the array has it's own array of comments, and we're using recursion to show all of them.

Click [here](https://github.com/housseindjirdeh/angular2-hn/blob/item-comments/src/app/comment/comment.component.scss) to see the styling for this component. If you now run the application, you can see all the comments for each item!

![item comments](https://i.imgur.com/lLcdxd0.png "Item Comments"){: .article-image }

The entire source code for this step can be found [here](https://github.com/housseindjirdeh/angular2-hn/tree/item-comments).

User Profiles
==================

All we have left is user profiles. Since the concept is pretty much the same, I won't go through this in detail. All you need to do is:

1. Set up another request in the data service to point to the user endpoint
2. Create a user component
3. Add another field to your routes file
4. Update the user links in the other components to route to the user

And that's it! Take a look [here](https://github.com/housseindjirdeh/angular2-hn/tree/version-1/src/app/user) if you want to see the whole user component setup.

Wrapping things up
==================

We're done! To kick off a production build, you can run `ng build --prod` or `ng serve --prod` which will make use of uglifying and tree-shaking.

I hope you found this tutorial useful. If you did, please [tweet it forward](https://twitter.com/intent/tweet?original_referer={{page.url}}&amp;ref_src=twsrc%5Etfw&amp;text={{page.title}}&amp;tw_p=tweetbutton&amp;url={{site.url}}{{page.url}}&amp;via=hdjirdeh) and/or [star the repo!](https://github.com/housseindjirdeh/angular2-hn) I would also love to hear any type of feedback whatsoever.

If you happen to be interested enough to work on this app further, take a look at the [issue list](https://github.com/housseindjirdeh/angular2-hn/issues) and feel free to put up a feature request or a PR! My next steps are to include real-time support as well as service worker/app shell functionality to make this a full blown Progressive Web App, so there's still lots to do <i class="fa fa-smile-o" aria-hidden="true"></i>.
