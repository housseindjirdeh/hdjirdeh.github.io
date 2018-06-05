---
layout: post
title:  "Progressive Web Apps with Angular: Part 2 - Lazy Loading"
date:   2017-07-02 07:30:00
categories: angular progressive web app javascript
description: In Part 1 of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This post will dive into building a PWA using Angular version 6.0 in order to understand how to use newer technologies provided by the platform....
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: assets/progressive-angular-applications-2/banner.jpg
permalink: /:title
---

![Progressive Angular Banner](assets/progressive-angular-applications-2/banner.jpg 'Progressive Angular Banner'){: .article-image-with-border }

In [Part 1]({{ site.url }}/progressive-angular-applications) of this article, we explored how to add a number of progressive enhancements to a Hacker News client built with Angular. That article was written a year ago and a lot has changed since then. This post will dive into building a PWA using Angular version 6.0 in order to understand how to use newer technologies provided by the platform.

# The breakdown

In this post, we'll explore how to build a relatively small application called **Tour of Thrones**.

![Tour of Thrones](assets/progressive-angular-applications-2/tour-of-thrones.png 'Tour of Thrones'){: .article-image-with-border }

<div class="button-center">
  <a class="blog-button" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/tour-of-thrones">Source Code</a>
</div>

The app will use [An API of Ice and Fire](https://anapioficeandfire.com/) (an unofficial, community-built API for Game of Thrones) to list houses from the book series and provide information about them. While building the application, we'll explore a number of topics including:

* Bootstrapping an application with Angular CLI
* Lazy loading
* Auxillary routes
* Angular Service Worker

<aside>
  <p>If you happen to be a fan of the book series and/or show, there are no spoilers in this application or article if you happen to be concerned :).</p>
</aside>

# The case for Progressive Angular

A lot has changed in the Angular ecosystem in the past year and there have been significant improvements to the toolchain to simplify the process of building a PWA. Let's take a look at some of the things that have changed:

* With the release of version 4.0, Angular introduced View Engine as an update to its rendering pipeline. This was done to improve how builds were created with Ahead-of-Time (AOT) compilation in order to generate smaller bundle sizes. In some cases, reductions greater than 50% were noticed.
* Development on [Angular Mobile Toolkit](https://github.com/angular/mobile-toolkit), which was accessed using the `--mobile` flag when creating a new project with Angular CLI, was [discontinued](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). This was done in favour of baking progressive technologies (such as `@angular/service-worker`) directly into the CLI.
* [Ivy](https://github.com/angular/angular/issues/21706), the third rendering engine for the platform, is currently under development. Again, the idea here is to simplify the development of faster and smaller-sized applications without introducing _any_ breaking changes whatsoever.

Aside from updates to Angular tooling, there have also been changes to other external libraries as well. When Part I of this article was released, Angular's service worker efforts were still in progress under the Mobile Toolkit project. For that reason, we went with caching static and dynamic assets using the [`sw-precache`](https://github.com/GoogleChromeLabs/sw-precache) and [`sw-toolbox`](https://github.com/GoogleChromeLabs/sw-toolbox) libraries respectively. Although both these libraries still exist, the Google Chrome team have worked on developing [Workbox](https://developers.google.com/web/tools/workbox/), a newer collection of tools aimed to simplify the process of adding offline support to web applications. We'll briefly cover this library later in this article.

# Getting Started

Before we continue talking about libraries and tooling in more detail, let's start building our application. If we already have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), we can proceed to installing the CLI if we haven't already:

{% highlight bash %}
npm install -g @angular/cli
{% endhighlight %}

We can then create a new application:

{% highlight bash %}
ng new tour-of-thrones --style=scss
cd tour-of-thrones
npm start
{% endhighlight %}

Adding `--style=scss` bootstraps our application with predefined Sass files for styling. You should now see the "Hello World" of our app.

![Hello World](assets/progressive-angular-applications-2/hello-world.png 'Hello World'){: .article-image-with-border }

Our application will consist of two parts:

* A `home` base route that lists all the Game of Thrones houses:

![Home Route](assets/progressive-angular-applications-2/home-route.png 'Home Route'){: .article-image-with-border }

* A `house` auxillary route that shows information for a particular house in a modal:

![House Route](assets/progressive-angular-applications-2/house-route.png 'House Route'){: .article-image-with-border }

## First Component

Let's begin by building the first few components in our application, starting with the `HeaderComponent` which responsible for showing the name of the app in our `home` route. We'll create a separate `components/` directory to contain this component among others:

{% highlight html %}
<!-- src/app/component/header/header.component.html -->

<div id="header">
  <div class="item"></div>
  <h1>
    Tour Of Thrones
  </h1>
  <div class="item">
    <i class="arrow down"></i>
  </div>
</div>
{% endhighlight %}

{% highlight javascript %}
// src/app/component/header/header.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
{% endhighlight %}

You can get the styles for the component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/header/header.component.scss).

To simplify how we import components throughout the application, we can have named exports in the same directory for each component in an `index.ts` file:

{% highlight javascript %}
// src/app/component/header/index.ts

export { HeaderComponent } from './header.component';
{% endhighlight %}

Similarly, we can re-export these components one level higher in an `index.ts` file within the `components/` directory:

{% highlight javascript %}
// src/app/component/index.ts

export { HeaderComponent } from './header';
{% endhighlight %}

<aside>
  <p> Normally, we would import multiple components from other files to a parent component in this manner:</p>

<figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-a'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentB <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-b'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-c'</span><span class="token punctuation">;</span></code></pre></figure>
  
  <p><code>index.ts</code> files that re-export components (or any exports) are sometimes referred to as <i>barrel</i> files and allow us to simplify how we can import exports into something like this:</p>

  <figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA<span class="token punctuation">,</span> ComponentB<span class="token punctuation">,</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component'</span><span class="token punctuation">;</span></code></pre></figure>

  <p>There is no <i>correct</i> way to export and import modules/components/services/etc... in an application and it is always a matter of preference. However, we'll be using this pattern throughout this article.</p>
</aside>

By default, Angular CLI allows us to import from different files using absolute imports (for example: `import ComponentA from 'src/app/component'`). Since all of our files live within the `app` directory, we can modify our `baseUrl` in `tsconfig.json` to import directly from `app` and not `src/app`:

{% highlight javascript %}
// tsconfig.json

{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "src",
    // ...
  }
}
{% endhighlight %}

The only component (`app.component.ts`) and module (`app.module.ts`) scaffolded when we created the project live in the `src` directory. Let's modify `AppComponent` to include `HeaderComponent`:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
</div>
{% endhighlight %}

You can see the styling for this component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/app.component.scss).

In order to be able to reference this component in `AppComponent`, we also have to make sure it's _declared_ in `AppModule`:

{% highlight javascript %}
// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HeaderComponent } from 'app/component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
{% endhighlight %}

The last thing we'll do here before taking a quick look at our progress so far is add some global styles to our application which also includes our font. All global styles in an Angular application go to the `styles.scss` file at the root of the `src/` directory and you can copy them over [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/styles.scss).

<aside>
  <p>If you want to use the same Game of Thrones font (created by <a href="https://charliesamways.carbonmade.com/">Charlie Samways</a>), make sure to download it <a href="https://charliesamways.carbonmade.com/projects/4420181#7">here</a> (it is free for personal use). Otherwise, feel free to remove the <code>@font-face</code> in the styles file.</p>
</aside>

### Try it out

If we run the application now, we'll see our header component take up a little more than half our screen.

![Header](assets/progressive-angular-applications-2/header.png 'Header'){: .article-image-with-border }

# Base Route

Now that we've got our feet wet building our first component. Let's move on to building everything necessary for the base route of our application, the `/home` route. We'll need:

* A card component to showcase the information of each house
* A routing system in place to define a `/home` route
* A service to interface with our external API

Let's begin with our `CardComponent`:

{% highlight html %}
<!-- src/app/component/card/card.component.html -->

<div (click)="onClick()" class="card grow" [ngStyle]="setBackgroundStyle()">
  <h3>{% raw %}{{name}}{% endraw %}</h3>
</div>
{% endhighlight %}

{% highlight javascript %}
// src/app/component/card/card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() id: Number;
  @Input() name: string;
  @Input() color: string;
  @Output() click = new EventEmitter<any>();

  onClick() {
    this.click.emit({
      id: this.id,
    });
  }

  setBackgroundStyle() {
    return {
      background: `radial-gradient(${this.color}, #39393f)`,
      'box-shadow': `0 0 60px ${this.color}`,
    };
  }
}
{% endhighlight %}

{% highlight javascript %}
// src/app/component/card/index.ts

export { CardComponent } from './card.component';
{% endhighlight %}

{% highlight javascript %}
// src/app/component/index.ts

export { CardComponent } from './card';
export { HeaderComponent } from './header';
{% endhighlight %}

We're using input binding in order to pass an `id` parameter (the house ID) as well the house name and color. The color here isn't retrieved from the API, but will just be randomly generated to add a little spice to the UI of the card component. We use `ngStyle` to add `box-shadow` and `background` CSS properties using the color.

In this component, we also make use of an `EventEmitter` in order to fire an event handled by a parent component when the user clicks on a card. We pass the house `id` into this event as well. Although we could to try to handle the logic within this component, it might make more sense to keep this component as _dummy_ as possible and let the parent handle what happens on user actions.

The styles for the card component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/card/card.component.scss). Now we'll need to declare this component in our `AppModule` if we plan on referencing it:

{% highlight javascript %}
// src/app/app.module.ts

// ...

import { HeaderComponent, CardComponent } from 'app/component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  // ...
})
// ...
{% endhighlight %}

#### Try it out

Let's add a couple of dummy card components to `AppComponent` to see if they're rendering correctly.

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <app-card id="1" name="House Freshness" color="green"></app-card>
  <app-card id="2" name="House Homes" color="red"></app-card>
  <app-card id="3" name="House Juice" color="orange"></app-card>
  <app-card id="4" name="House Replay" color="blue"></app-card>
</div>
{% endhighlight %}

![Card Components](assets/progressive-angular-applications-2/cards.png 'Card Components'){: .article-image-with-border }

We can see our cards rendered! They don't have any specific widths/heights assigned to them and they take the shape of their parent container. Once we finish adding our home route next, we'll use CSS grid to add a 2 X 2 grid structure for our cards.

## Routing

It's time to begin adding navigation to our application. Instead of placing components that make up our routes in the `component/` directory, we'll put them in a separate directory named `scene/`. Let's begin building out our `HomeComponent` responsible for our initial route:

{% highlight html %}
<!-- src/app/scene/home/home.component.html -->

<div class="grid">
  <app-card 
    *ngFor="let house of houses" 
    [id]="house.id" 
    [name]="house.name" 
    [color]="house.color">
  </app-card>
</div>
{% endhighlight %}

{% highlight javascript %}
<!-- src/app/scene/home/home.component.ts -->

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  houses = [];

  constructor() {}

  ngOnInit() {
    this.getHouses();
  }

  getHouses() {
    this.houses = [
      {id: 1, name: 'House Freshness', color: 'green'},
      {id: 2, name: 'House Homes', color: 'red'},
      {id: 3, name: 'House Juice', color: 'orange'},
      {id: 4, name: 'House Replay', color: 'blue'},
    ];
  }
}
{% endhighlight %}

{% highlight javascript %}
// src/app/scene/home/index.ts

export { HomeComponent } from './home.component';
{% endhighlight %}

{% highlight javascript %}
// src/app/scene/index.ts

export { HomeComponent } from './home';
{% endhighlight %}

The styles for this component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/scene/home/home.component.scss). If you take a look at the styles, we wrap our list of cards in a grid structure.

<aside>
  <p>We're not going to dive in to describing CSS grid in this article, but refer to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout">this</a> if you're interested in learning more!</p>
</aside>

Now let's define our routes:

{% highlight javascript %}
// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent, CardComponent } from 'app/component';
import { HomeComponent } from 'app/scene';
import { AppComponent } from './app.component';

const routePaths: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [AppComponent, HeaderComponent, CardComponent, HomeComponent],
  imports: [BrowserModule, RouterModule.forRoot(routePaths)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
{% endhighlight %}

We’ve defined a single route path (`home`) that maps to a component (`HomeComponent`) and we've set up the root path to redirect to this. Now we need to let our application know where to dynamically load the correct component based on the current route, and we can do that by using `router-outlet`:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <router-outlet></router-outlet>
</div>
{% endhighlight %}

#### Try it out

If we take a look at our application now, we'll see our `HomeComponent` showing our list of houses in a grid structure. We can also see that opening our app immediately redirects to `/home`.

![Home Component](assets/progressive-angular-applications-2/home-component.png 'Home Component'){: .article-image-with-border }

## Service

Let's begin by adding a service responsible for interfacing with our API. We'll put our this in a `/service` directory:

{% highlight javascript %}
// src/app/service/iceandfire.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

import { House } from 'app/type';

@Injectable()
export class IceAndFireService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://anapioficeandfire.com/api';
  }

  fetchHouses(page = 1) {
    return this.http.get<House[]>(`${this.baseUrl}/houses?page=${page}`);
  }

  fetchHouse(id: number) {
    return this.http.get<House>(`${this.baseUrl}/houses/${id}`);
  }
}
{% endhighlight %}

We're using Angular's `HttpClient` to interface with our API and we've defined two separate methods:

* `fetchHouses`: Get a list of houses given a page number
* `fetchHouse`: Gets information about a particular house

We'll also wrap our service in it's own module:

{% highlight javascript %}
// src/app/service/service.module.ts

import { NgModule } from '@angular/core';
import { IceAndFireService } from './iceandfire.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [],
})
export class ServicesModule {
  static forRoot() {
    return {
      ngModule: ServicesModule,
      providers: [IceAndFireService],
    };
  }
}

export { IceAndFireService };
{% endhighlight %}

{% highlight javascript %}
// src/app/service/index.ts

export { IceAndFireService } from './iceandfire.service';
export { ServicesModule } from './service.module';
{% endhighlight %}

In our service, we also type-check with a `House` type. Let's add our types and interfaces to a `type/` directory:

{% highlight javascript %}
// src/app/type/house.ts
type Url = string;

export interface House {
  id: number;
  url: Url;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  heir: string;
  overlord: Url;
  founded: string;
  founder: string;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: Url[];
  swornMembers: Url[];
  color: string;
}
{% endhighlight %}

{% highlight javascript %}
// src/app/type/index.ts

export { House } from './house';
{% endhighlight %}

Now let's import our services module in `AppModule`:

{% highlight javascript %}
// src/app/app.module.ts

//...
import { HttpClientModule } from '@angular/common/http';
import { ServicesModule } from 'app/service';
//...

@NgModule({
  //...
  imports: [
    //...
    HttpClientModule,
    ServicesModule.forRoot(),
  ],
  //...
})
export class AppModule {}
{% endhighlight %}

Now let's update `HomeComponent` to use our appropriate service method:

{% highlight javascript %}
// src/app/scene/home/home.component.ts

import { Component, OnInit } from '@angular/core';

import { IceAndFireService } from 'app/service';
import { House } from 'app/type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pageNum = 1;
  houses: House[] = [];

  constructor(private service: IceAndFireService) {}

  ngOnInit() {
    this.getHouses();
  }

  getHouses(pageNum = 1) {
    this.service.fetchHouses(pageNum).subscribe(
      data => {
        this.houses = this.houses.concat(
          data.map(datum => {
            const urlSplit = datum.url.split('/');

            return {
              ...datum,
              id: Number(urlSplit[urlSplit.length - 1]),
              color: getColor(),
            };
          }),
        );
      },
      err => console.error(err),
    );
  }
}

// utils
const getColor = () =>
  `#${Math.random()
    .toString(16)
    .slice(-6)}66`;
{% endhighlight %}

Let's quickly go over how the changes we added:

* We're importing `IceAndFireService` and injecting it into our component constructor
* We're using the `OnInit` lifecycle hook to fire the `getHouses` class method as soon as our component finished initializing
* In our service, `this.http.get` returns an observable. In here, the `getHouses` method calls our service method and subscribes to the observable returned. Since the API doesn't have a specific ID attribute for each object, we're mapping through the response and obtaining the ID from the URL attribute as well as assigning a color to each house.
* We finally added `getColor`, a tiny utility method that just returns a random color that we assign for each house.

<aside>Little note about how its json now by default</aside>
<aside>Little note about how the getColor isn't exactly random, and what it's doing with the 66 in the end</aside>

#### Try it out

If we take a look at our application now, we'll see our first page of houses rendered as soon as we load the application:

![Service](assets/progressive-angular-applications-2/service.png 'Service'){: .article-image-with-border }

# Lazy Loading

To improve loading times on a web page, we can **lazy load** non-critical resources where possible. In other words, we can try to defer the loading of certain resources _until_ the user actually needs them.

In this application, we're going to try and lazy load on two user actions:

* On scroll
* On route change

## Infinite scrolling

**Infinite scrolling** is a lazy loading technique to defer loading of future resources until the user has almost scrolled to the end of their currently visible content. 

In this application, we want to be careful with how many houses we fetch over the network as soon as the page loads. Like many APIs, the one we'll be using also [paginates](https://anapioficeandfire.com/Documentation#pagination) responses. This means we can pass a `?page` parameter to iterate over responses. We can add infinite scrolling here to defer loading of future paginated results until the user has almost scrolled to the bottom of the application.

There are multiple ways to apply lazy loading to DOM elements:

* Listening to [`scroll`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) events
* Using newer browser APIs like [Intersection Observer](https://developers.google.com/web/updates/2016/04/intersectionobserver)

For this application, we'll use [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll), a community-built Angular directive that provides an abstraction to listening to the window scroll event allow us to fire callback events. Let's install the package:

{% highlight javascript %}
npm install ngx-infinite-scroll --save
{% endhighlight %}

With the library installed, we can import it's module into our application:

{% highlight javascript %}
// src/app/app.module.ts

//...
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
//...

@NgModule({
  imports: [
    //...
    InfiniteScrollModule,
  ],
  //...
})
export class AppModule {}
{% endhighlight %}

We can now add this to `HomeComponent`:

{% highlight html %}
<!-- src/app/scene/home/home.component.html -->

<div class="grid" infinite-scroll (scrolled)="onScrollDown()">
  <app-card 
    *ngFor="let house of houses" 
    [id]="house.id" 
    [name]="house.name" 
    [color]="house.color" 
    (click)="routeToHouse($event)">
  </app-card>
</div>
{% endhighlight %}

{% highlight javascript %}
// src/app/scene/home/home.component.ts

import { Component, OnInit } from '@angular/core';

import { IceAndFireService } from 'app/service';
import { House } from 'app/type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //...

  onScrollDown() {
    this.pageNum++;
    this.getHouses(this.pageNum);
  }
}
{% endhighlight %}

We just added a `onScrollDown` as a callback for the directive `scrolled` method. In here, we increase the page number and call the `getHouses` method once again.

Now if we try running the application, we'll see houses load as we scroll down the page.

![Infinite Scroll](assets/progressive-angular-applications-2/infinite-scroll.gif 'Infinite Scroll'){: .article-image-with-border }

The library allows users to customize a number of attributes such as modifying the distance of the current scroll location with respect to the end of the container that determines when to fire an event. You can refer to the [README](https://github.com/orizens/ngx-infinite-scroll) for more information.

<aside>
  <p>If you're interested in learning how to build your own infinite scroll directive without the use of additional libraries, Ashwin Sureshkumar has a write-up you can refer to <a href="https://codeburst.io/angular-2-simple-infinite-scroller-directive-with-rxjs-observables-a989b12d4fb1">here</a>.</p>
</aside>

### When should we lazy load on scroll?

There are countless ways to render a paginated list of results in an application like this, and an infinitely long list is probably not the best way. Popular social media applications (such as [Twitter](https://twitter.com/)) use this model to keep users engaged, but is probably not very suitable for applications where the user might need to find information on something specific quickly. In this application for example, it would take a user an unnecessarily long time to find information about a particular house. Adding normal pagination, allowing the user to filter by region or name, and/or allowing them to search for a particular house are methods that would definitely make more sense.

Instead of trying to lazy load all the content that shows to user as they scroll (i.e. infinite scroll), it might be more worthwhile trying to defer loading of certain elements on web pages such as images and video that aren't immediately visible to users on page load. Both can be very data-consuming and lazy loading them particularly doesn't necessarily change the entire paginated flow of the application.

<aside>
  <p>Addy Osmani has an excellent section on lazy loading images in his <a href="https://images.guide/#lazy-load-non-critical-images">guide to image optimizations</a> and Jeremy Wagner has a great <a href="https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/">article</a> on the topic as well.</p>
</aside>

## Code splitting

**Code splitting** refers to the practice of splitting the application bundle into separate chunks with which they can then be lazy loaded on demand. In other words, instead of providing users with all the code that make up the application as soon as they load the very first page, we can give them different parts of the code as they need them while navigating throughout the application.

We can apply code splitting in different ways, but it commonly happens on the route level. Webpack, the module bundler used by Angular CLI, has code splitting [built-in](https://webpack.js.org/guides/code-splitting/). Without needing to dive in to the Webpack internals in order to make this happen, Angular Router allows us to lazy-load any feature module that we build. 

Let's see this in action by building our next route, `/home`, which shows information on each house:

{% highlight html %}
// src/app/scene/house/house.component.html

<app-modal (modalClose)="modalClose()">
  <div modal-loader *ngIf="!house; else houseContent" class="loader-container">
    <app-loader></app-loader>
  </div>
  <ng-template #houseContent modal-content>
    <div class="container">
      <h1>{% raw %}{{house.name}}{% endraw %}</h1>
      <div *ngIf="house.words !== ''" class="subheading">{% raw %}{{house.words}}{% endraw %}</div>
      <div class="info" [ngClass]="(house.words === '') ? 'info-large-margin' : 'info-small-margin'">
        <div class="detail">
          <p class="caption">Coat of Arms</p>
          <p class="body">{% raw %}{{house.coatOfArms === '' ? '?' : house.coatOfArms}}{% endraw %}</p>
        </div>
        <div class="detail">
          <p class="caption">Region</p>
          <p class="body">{% raw %}{{house.region === '' ? '?' : house.region}}{% endraw %}</p>
        </div>
        <div class="detail">
          <p class="caption">Founded</p>
          <p class="body">{% raw %}{{house.founded === '' ? '?' : house.founded}}{% endraw %}</p>
        </div>
      </div>
    </div>
  </ng-template>
</app-modal>
{% endhighlight %}

Our `HouseComponent` is rendered within a modal, hence we we've wrapped it's content within `<app-modal>`. We're not going to into too much detail on how this modal component files are written, but you can find them [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/modal). 

One important thing to mention however is that we're using projection (`ng-content`) to project content into our modal. We either project a loading state (`modal-loader`) if we don't have house information yet or modal content (`modal-content`) if we do. You can find the code that makes up our loader [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/loader).

<aside>
  <p>Although we're only using our modal wrapper for a single component in this application, we're using projection in order to make it more reusable. This can be useful if we happen to need a modal in any other part of the application.</p>
</aside>

<aside>
  <p>In case you're wondering how the <code>#houseContent</code> attribute works in our template - it's used here to render <code>modal-content</code> if our expression passed into <code>*ngIf</code> is falsy.</p>
</aside>

Now let's move on to the logic behind this component:

{% highlight javascript %}
// src/app/scene/house/house.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IceAndFireService } from 'app/service';
import { House } from 'app/type';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
})
export class HouseComponent implements OnInit {
  house: House;
  error = false;

  constructor(
    private service: IceAndFireService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service
        .fetchHouse(+params['id'])
        .subscribe(data => (this.house = data), err => console.error(err));
    });
  }

  modalClose() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
{% endhighlight %}

