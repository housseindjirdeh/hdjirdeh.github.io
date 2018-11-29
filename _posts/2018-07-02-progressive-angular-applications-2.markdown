---
layout: post
title:  "Progressive Web Apps with Angular: Part 2 - Lazy Loading"
date:   2018-12-04 07:30:00
description: Lazy loading + Angular = ❤️
type: post
image: assets/progressive-angular-applications-2/banner.png
permalink: /:title
published: false
---

To explore how to add lazy loading functionality to an Angular application, this article will go through the process of building a relatively small application called **Tour of Thrones**.

<img alt="Tour of Thrones" title="Tour of Thrones" data-src="/assets/progressive-angular-applications-2/tour-of-thrones.png" class="lazyload shadow" />

<div class="flex items-center justify-center h3">
  <a class="f6 fw6 link dim ph3 pv2 mb2 dib white bg-red ttu br2 mr2" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="f6 fw6 link dim ph3 pv2 mb2 dib white bg-red ttu br2" href="https://github.com/gitpoint/git-point">Source Code</a>
</div>

We'll use [An API of Ice and Fire](https://anapioficeandfire.com/) (an unofficial, community-built API for Game of Thrones) to list houses from the book series and provide information about them. While building this application, we'll explore a number of topics including:

* Getting started with Angular CLI
* Lazy loading on scroll
* Lazy loading on route change
* Secondary routes

<aside>
  <p>The first half of this article covers how to building this app from scratch. If you're not interested in this, feel free to skip right ahead to the <a href="{{ site.url }}/progressive-angular-applications-2#lazy-loading">Lazy Loading</a> section.</p><br>
  
  <p>If you would like to first read a PWA introduction, you can take a look at the <a href="http://localhost:4000/progressive-angular-applications">first part</a> of this series.</p>
</aside>

## Getting Started

If you have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), you can install Angular CLI with the following command:

{% highlight bash %}
npm install -g @angular/cli
{% endhighlight %}

You can then create a new application:

{% highlight bash %}
ng new tour-of-thrones
{% endhighlight %}

If you have Angular CLI 7 installed or a later version, you should see a few questions pop up in your terminal:

{% highlight bash %}
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use?
  CSS
❯ SCSS   [ http://sass-lang.com   ]
  SASS   [ http://sass-lang.com   ]
  LESS   [ http://lesscss.org     ]
  Stylus [ http://stylus-lang.com ]
{% endhighlight %}

You can say _No_ to Angular routing for now. We'll include it manually when we begin to add routing to the application. 

Feel free to select whichever stylesheet format you prefer. If you would like to copy over all the styles in this article however, select `SCSS`.

You can now start the app:

{% highlight bash %}
cd tour-of-thrones
npm start
{% endhighlight %} 

You should now see Angular's version of "Hello World".

<img alt="Hello World" title="Hello World" data-src="/assets/progressive-angular-applications-2/hello-world.png" class="lazyload" />

The application will consist of two parts:

* A base `home` route that lists all the Game of Thrones houses.

<img alt="Home Route" title="Home Route" data-src="/assets/progressive-angular-applications-2/home-route.png" class="lazyload shadow" />

* A secondary `house` route that shows information for a particular house in a modal.

<img alt="House Route" title="House Route" data-src="/assets/progressive-angular-applications-2/house-route.png" class="lazyload shadow" />

### First Component

Let's begin by building the first few components in the application. We'll start with the `HeaderComponent` responsible for showing the name of the application in the `home` route. 

Create a separate `components/` directory that contains a separate `header/` directory within. This sub-directory can contain all the files needed for `HeaderComponent`.

<img alt="Header directory" title="Header directory" data-src="/assets/progressive-angular-applications-2/header-directory.png" class="lazyload shadow" />

Let's begin with the template file, `header.component.html`:

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

Now update the also newly created `header.component.ts` file:

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

You can copy and paste the styles for `header.component.scss` from [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/header/header.component.scss). We'll do this for all the styles in the application.

To simplify how components are imported throughout the app, we can have named exports in the same directory for each component using an `index.ts` file. Since `header/` is the only component directory we have, let's begin by exporting within the `index.ts` file that lives in the folder:

{% highlight javascript %}
// src/app/component/header/index.ts

export { HeaderComponent } from './header.component';
{% endhighlight %}

Similarly, we can re-export these components one level higher in an `index.ts` file within the `components/` directory:

{% highlight javascript %}
// src/app/component/index.ts

export { HeaderComponent } from './header';
{% endhighlight %}

By default, Angular CLI allows us to import using absolute imports (`import ComponentA from 'src/app/component'`). Since all of our files live within the `app` directory, we can modify our `baseUrl` in `tsconfig.json` to import directly from `app` and not `src/app`:

<pre>
  <code class="language-javascript hljs" data-lang="javascript">
  // tsconfig.json

  {
    "compileOnSave": false,
    "compilerOptions": {
      <s>"baseUrl": "./",</s>
      <strong><i>"baseUrl": "src",</i></strong>
      // ...
    }
  }
  </code>
</pre>


<aside>
  <h4>Why import/export components like this?</h4>

  <p>Normally, you would import multiple components from other files to a parent component like this:</p>

<figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-a'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentB <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-b'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-c'</span><span class="token punctuation">;</span></code></pre></figure>
  
  <p>To simplify this, you can use <code>index.ts</code> files to re-export components (or any other exports). This files are sometimes referred to as <i>barrel</i> files and allow you to simplify how we can import exports into something like this:</p>

  <figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA<span class="token punctuation">,</span> ComponentB<span class="token punctuation">,</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component'</span><span class="token punctuation">;</span></code></pre></figure>

  <p>Although the latter approach is used in this article, there is no correct way to export and import modules, and there are actually a few issues with this approach. It can make jumping between files within your editor/IDE harder when coupled with absolute imports as well as make autocomplete not work as effectively. If you don't prefer this way, feel free to import/export normally instead of how we do it in this article.</p>
</aside>

The only component (`app.component.ts`) and module (`app.module.ts`) scaffolded when we created the project live directly in `src/app`. You'll need to modify `AppComponent` to include `HeaderComponent`:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
</div>
{% endhighlight %}

You can see the styling in `app.component.scss` [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/app.component.scss).

In order to be able to reference the header component in `AppComponent`, you also have to make sure it's declared in `AppModule`:

<figure class="highlight">
<pre>
<code class="language-javascript hljs" data-lang="javascript">// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

<strong><i>import { HeaderComponent } from 'app/component';</i></strong>
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, <strong><i>HeaderComponent</i></strong>],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
</code>
</pre>
</figure>

The last thing you'll need to do before taking a quick look at the progress so far is to add some global styles to the application (which includes the Thrones-style font). All global styles in an Angular app go to the `styles.scss` file at the root of the `src/` directory. Take a look [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/styles.scss) to copy over the styles directly.

<aside>
  <p>If you want to use the same font (created by <a href="https://charliesamways.carbonmade.com/">Charlie Samways</a>), make sure to download it <a href="https://charliesamways.carbonmade.com/projects/4420181#7">here</a> (it's free for personal use). Otherwise, feel free to remove the <code>@font-face</code> in <code>styles.scss</code>.</p>
</aside>

#### Try it out

If you run the application, you'll notice that the header component renders and takes up a little more than half the screen.

<img alt="Header" title="Header" data-src="/assets/progressive-angular-applications-2/header.png" class="lazyload shadow" />

## Base Route

Now that you've got your feet wet building the first component, let's move on to building everything necessary for the base `/home` route. We'll need:

* A card component to display the information of each house
* A routing system in place to define a `/home` route
* A service to interface with our external API

Let's begin with `CardComponent`. Similarly, create a `card/` subdirectory within `components/` with all of its files:

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

Finally, you'll need to update the top-level barrel file:

{% highlight javascript %}
// src/app/component/index.ts

export { CardComponent } from './card';
export { HeaderComponent } from './header';
{% endhighlight %}

* Input binding is used to pass in an `id` parameter (the house ID) as well the house name and color. The color isn't fetched from the API, but is randomly generated to add a little _spicyness_ 🌶. You'll see this in a bit.
* `ngStyle` is used to add `box-shadow` and `background` CSS properties using this color.
* An `EventEmitter` is used to fire a click event to a parent component. We pass the house `id` into this event as well. 

<aside>
<p>Although you could to try to handle all logic within this component, it probably makes more sense to keep it as <i>stateless</i> as possible and let the parent handle what happens on the click event.</p>
</aside>

The styles for the card component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/card/card.component.scss). Lastly, you'll need to declare this component in `AppModule` in order to use it:

<figure class="highlight">
<pre>
<code class="language-javascript hljs" data-lang="javascript">// src/app/app.module.ts

// ...

import { HeaderComponent, <strong><i>CardComponent</i></strong> } from 'app/component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, <strong><i>CardComponent</i></strong>],
  // ...
})
// ...
</code>
</pre>
</figure>

#### Try it out

Let's add a couple of dummy card components to `AppComponent` to see if they're displaying correctly:

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

<img alt="Card Components" title="Card Components" data-src="/assets/progressive-angular-applications-2/cards.png" class="lazyload shadow" />

You can see our cards being rendered! They don't have any specific widths/heights assigned to them and they take the shape of their parent container, which is expected. Once we add our home route next, we'll use CSS grid to give our cards some structure.

## Routing

It's time to begin adding some navigation to the application. Instead of placing components that make up the routes in the `component/` directory, we'll put them in a separate directory called `scene/`. 

Create a separate `scene/` directory with a `home/` subdirectory. Add all the files for `HomeComponent` responsible for the initial route here:

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

The styles for this component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/scene/home/home.component.scss). If you take a look at the styles, you'll notice that the list of cards is wrapped in a grid structure.

<aside>
  <p>We're not going to explain CSS grid in this article, but you can refer to this <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout">MDN resource</a> if you're interested in learning more.</p>
</aside>

Now let's define the routes in `AppModule`:

<figure class="highlight">
<pre>
<code class="language-javascript hljs" data-lang="javascript">// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent, CardComponent } from 'app/component';
<strong><i>import { HomeComponent } from 'app/scene';</i></strong>
import { AppComponent } from './app.component';

<strong><i>const routePaths: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];</i></strong>

@NgModule({
  declarations: [AppComponent, HeaderComponent, CardComponent, <strong><i>HomeComponent</i></strong>],
  imports: [BrowserModule, <strong><i>RouterModule.forRoot(routePaths)</i></strong>],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
</code>
</pre>
</figure>

We’ve defined a single route path (`home`) that maps to a component (`HomeComponent`) and we've set up the root path to redirect to this. You now need to let the application know where to dynamically load the correct component based on the current route, and you can do that by using `router-outlet`:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <router-outlet></router-outlet>
</div>
{% endhighlight %}

#### Try it out

Take a look at the application now. You'll see `HomeComponent` showing the list of houses in a grid structure.

<img alt="Home Component" title="Home Component" data-src="/assets/progressive-angular-applications-2/home-component.png" class="lazyload shadow" />

You can also see that loading the base URL of the application immediately redirects to `/home`.

## Service

To get some real data, we need to interface with the API. Create a service responsible for this by placing it within a `/service` directory:

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

We're using Angular's `HttpClient` to interface with the API by defining two separate methods:

* `fetchHouses`: Get a list of houses given a page number
* `fetchHouse`: Get information about a particular house

We'll also wrap our service in its own module:

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

In the service, we type-check with a `House` interface. You can add the types and interfaces to a `type/` directory:

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

Now import the services module in `AppModule`:

<figure class="highlight">
<pre>
<code class="language-javascript hljs" data-lang="javascript">// src/app/app.module.ts

//...
<strong><i>import { HttpClientModule } from '@angular/common/http';</i></strong>
<strong><i>import { ServicesModule } from 'app/service';</i></strong>
//...

@NgModule({
  //...
  imports: [
    //...
    <strong><i>HttpClientModule,</i></strong>
    <strong><i>ServicesModule.forRoot(),</i></strong>
  ],
  //...
})
export class AppModule {}
</code>
</pre>
</figure>

You can now update `HomeComponent` to use our appropriate service method:

<figure class="highlight">
<pre>
<code class="language-javascript hljs" data-lang="javascript">// src/app/scene/home/home.component.ts

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

  <s>getHouses() {
    this.houses = [
      {id: 1, name: 'House Freshness', color: 'green'},
      {id: 2, name: 'House Homes', color: 'red'},
      {id: 3, name: 'House Juice', color: 'orange'},
      {id: 4, name: 'House Replay', color: 'blue'},
    ];
  }</s>

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
</code>
</pre>
</figure>

Let's quickly go over what's happening here:

* We're importing `IceAndFireService` and injecting it into the component constructor
* We're using the `OnInit` lifecycle hook to fire the `getHouses` class method as soon as our component finishes initializing
* In the service, `this.http.get` returns an observable. In the component, the `getHouses` method calls the `fetchHouses` method and subscribes to the observable returned. Since the API does not have a specific ID attribute for each object, we're mapping through the response and obtaining the ID from the URL attribute as well as assigning a color to each house.
* At the end, we have `getColor`. This is a tiny utility method that returns a color that gets assign for each house. This isn't _exactly_ random, but it works for now. Also the two digits at the end of the string, `66`, represent [alpha transparency](https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4).

#### Try it out

If you take a look at the application now, you'll see the first page of houses rendered as soon as you load the application:

<img alt="Service" title="Service" data-src="/assets/progressive-angular-applications-2/service.png" class="lazyload shadow" />

## Lazy Loading

To improve loading times on a web page, we can try to **lazy load** non-critical resources where possible. In other words, we can defer the loading of certain resources until the user actually needs them.

In this application, we're going to lazy load on two different user actions:

* On scroll
* On route change

### Infinite scrolling

*Infinite scrolling* is a lazy loading technique to defer loading of future resources until the user has almost scrolled to the end of their currently visible content. 

In this application, we want to be careful with how many houses we fetch over the network as soon as the page loads. Like many APIs, the one we're using paginates responses which allows us to pass a `?page` parameter to iterate over responses. We can add infinite scrolling here to defer loading of future paginated results until the user has almost scrolled to the bottom of the web page.

There is more than one way to lazy load elements that show below the edge of the device viewport:

* Using [scroll event handlers](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way)
* Using newer browser APIs like [Intersection Observer](https://developers.google.com/web/updates/2016/04/intersectionobserver)

For this application, we'll use [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll), a community-built library that provides an Angular directive abstraction over changes to the scroll event. With the library, we can listen and fire callback events triggered by scroll behaviour.

{% highlight javascript %}
npm install ngx-infinite-scroll --save
{% endhighlight %}

We can now import its module into our application:

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

We just added `onScrollDown` as a callback for the directive `scrolled` method. In here, we increment the page number and call the `getHouses` method.

Now if we try running the application, we'll see houses load as we scroll down the page.

<img alt="Infinite Scroll" title="Infinite Scroll" data-src="/assets/progressive-angular-applications-2/infinite-scroll.gif" class="lazyload shadow" />

The library allows users to customize a number of attributes such as modifying the distance of the current scroll location with respect to the end of the container that determines when to fire an event. You can refer to the [README](https://github.com/orizens/ngx-infinite-scroll) for more information.

<aside>
  <p>If you're interested in learning how to build your own infinite scroll directive without the use of additional libraries, Ashwin Sureshkumar has a write-up you can refer to <a href="https://codeburst.io/angular-2-simple-infinite-scroller-directive-with-rxjs-observables-a989b12d4fb1">here</a>.</p>
</aside>

#### When should we lazy load on scroll?

There are countless ways to organize a paginated list of results in an application like this, and an infinitely long list is definitely not the best way. Many social media platforms (such as [Twitter](https://twitter.com/)) use this model to keep users engaged, but it is really not suitable for when the user needs to find a specific piece information quickly. 

In this application for example, it would take a user an unnecessarily long time to find information about a particular house. Adding normal pagination, allowing the user to filter by region or name, or allowing them to search for a particular house are all probably better approaches.

Instead of trying to lazy load _all_ the content that is displayed to the user as they scroll (i.e. infinite scroll), it might be more worthwhile to try and defer loading of certain elements that aren't immediately visible to users on page load. Elements such as images and video can consume significant amounts of user bandwidth and lazy loading them specifically will not necessarily affect the entire paginated flow of the application.

<aside>
  <p>Addy Osmani has an excellent section on lazy loading images in his <a href="https://images.guide/#lazy-load-non-critical-images">guide to image optimization</a> and Jeremy Wagner has a great <a href="https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/">article</a> on the topic as well.</p>
</aside>

#### How should we lazy load on scroll?

Using a library that makes it easier to lazy load elements but uses scroll event listeners is a good start. If possible however, try to find a solution that relies on IntersectionObserver but also provides a polyfill for browsers that do not yet support it. Here's a [handy article](https://blog.angularindepth.com/a-modern-solution-to-lazy-loading-using-intersection-observer-9280c149bbc) that shows you how to create an Angular directive with IntersectionObserver.

<aside><p>Psst...Chrome will soon let you <a href="https://youtu.be/reztLS3vomE?t=643">lazy load images and iframes</a> without relying on a third-party library or custom solution.</p></aside>

### Code splitting

*Code splitting* refers to the practice of splitting the entire application bundle into separate chunks that can be lazy loaded on demand. In other words, instead of providing users with all the code that makes up the application when they load the very first page, we can give them pieces of the bundle as they navigate throughout the app.

We can apply code splitting in different ways, but it commonly happens on the route level. Webpack, the module bundler used by Angular CLI, has code splitting [built-in](https://webpack.js.org/guides/code-splitting/). Without needing to dive in to the internals of our Webpack configurations in order to make this work, Angular router allows us to lazy-load any feature module that we build. 

Let's see this in action by building our next route, `/house`, which shows information for a single house:

{% highlight html %}
<!-- src/app/scene/house/house.component.html -->

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

The `HouseComponent` shows a number of details for the house selected. It is rendered within a modal and for that reason, its contents are wrapped within an `<app-modal>` component. We're not going to into too much detail on how this modal component files are written, but you can find them [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/modal). 

<aside>
  <p>In case you're wondering how the <code>#houseContent</code> attribute works in this template - it's used to render the entire <code>ng-template</code> block if the expression passed into <code>*ngIf</code> is falsy.</p>
</aside>

However, one important thing to mention is that we're using projection (`ng-content`) to project content into our modal. We either project a loading state (`modal-loader`) if we don't have any house information yet or modal content (`modal-content`) if we do. You can find the code that makes up our loader [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/loader).

Although we're only using our modal wrapper for a single component in this application, we're using projection in order to make it more reusable. This can be useful if we happen to need to use a modal in any other part of the application.

Unlike the `HomeComponent` which is being bundled directly with the root `AppModule`, you can create a separate feature module for `HouseComponent` that can be lazy loaded:

{% highlight javascript %}
// src/app/scene/house/house.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ModalComponent, LoaderComponent } from 'app/component';

import { HouseComponent } from './house.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule, RouterModule.forChild(routes)],
  declarations: [HouseComponent, ModalComponent, LoaderComponent],
  exports: [HouseComponent, RouterModule],
})
export class HouseModule {}
{% endhighlight %}

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

In here, we subscribe to our route parameters after the component finishes initializing in order to obtain the house ID. We then fire an API call to fetch its information. 

We also have a `modalClose` method that navigates to a modal outlet with a value of `null`. We do this to clear our modal's **secondary route**.

### Secondary routes

In Angular, we can create any number of _named_ router outlets in order to create [secondary routes](https://angular.io/guide/router#displaying-multiple-routes-in-named-outlets). This can be useful to separate different parts of the application in terms of router configurations that don't need to fit into the primary router outlet. A good example of using this is for a modal or popup.

Let's begin by defining the second router outlet:

{% highlight html %}
<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <router-outlet></router-outlet>
  <router-outlet name="modal"></router-outlet>
</div>
{% endhighlight %}

Unlike the primary router outlet, secondary outlets must be named. For this example, we've named it `modal`.

Now add `HomeModule` into the top-level route configurations while lazy loading it. This can be done by using a `loadChildren` attribute:

{% highlight javascript %}
// src/app/app.module.ts

//....

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
  {
    path: 'house/:id',
    outlet: 'modal',
    loadChildren: 'app/scene/house/house.module#HouseModule',
  },
];

@NgModule({
  //...
})
export class AppModule {}
{% endhighlight %}

Although using a `loadChildren` attribute with a value of the path to the module would normally work, there's an [open issue](https://github.com/angular/angular/issues/12842) about a bug that occurs while lazy loading a module tied to a named outlet (secondary route). In the same issue thread, somebody suggests a [workaround](https://github.com/angular/angular/issues/12842#issuecomment-270836368) that involves adding a route proxy component in between:

{% highlight javascript %}
// src/app/app.module.ts

import {
  //...
  RouteProxyComponent,
} from 'app/component';

//...

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
  {
    path: 'house/:id',
    outlet: 'modal',
    component: RouteProxyComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/scene/house/house.module#HouseModule',
      },
    ],
  },
];

@NgModule({
  //...
  declarations: [
    RouteProxyComponent,
  ],
  //...
})
export class AppModule {}
{% endhighlight %}

This workaround works for now, but it does add an extra component layer in between. You can see how the `RouteProxyComponent` is nothing more than a single router outlet [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/route-proxy).

The last thing you'll need to do is allow the user to switch routes when a house is clicked:

{% highlight javascript %}
// src/scene/home/home.component.ts

import { Router } from '@angular/router';

//...

export class HomeComponent implements OnInit {
  //...

  constructor(private service: IceAndFireService, private router: Router) {}

  //...

  routeToHouse(event: { id: number }) {
    if (event.id) {
      this.router.navigate([{ outlets: { modal: ['house', event.id] } }]);
    }
  }
  
  //...
}
{% endhighlight %}

We added a `routeToHouse` method that navigates to a modal outlet with an array for link parameters. Since `HouseComponent` looks up the ID of the house in our route parameters, we've included it here in the array. 

Now add a click handler to bind to this event:

{% highlight html %}
<!-- src/scene/home/home.component.html -->

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

#### Try it out

Load the application with these changes and click on any house.

<img alt="House Module" title="House Module" data-src="/assets/progressive-angular-applications-2/house-module.png" class="lazyload shadow" />

If you have the _Network_ tab of your browser's developer tools open, you'll notice that the code that makes up the house module is only loaded when we click on a house.

<aside>
  <p>Notice that the URL for our secondary route tied to our named modal outlet is <code>.../home(modal:house/1)</code>. In here, <code>home</code> is still our primary route. For more information on how secondary routes work, take a look at the detailed <a href="https://angular.io/guide/router#secondary-routes">documentation</a>.</p>
</aside>

#### When should we code split?

It depends. In this example, the JavaScript that makes up the lazy loaded feature module is less than 3KB minified + gzipped (on a production build). If you think this does not warrant code splitting, you might be right. Lazy loading feature modules can be a lot more useful when your application starts growing with each of your modules making up a juicy cut of the entire bundle. Many developers think code-splitting should be one of the primary things to consider when trying to improve the performance of an application, and rightly so.

<img alt="Sean Larkin tweet on the importance of code-splitting" title="Sean Larkin tweet on the importance of code-splitting" data-src="/assets/progressive-angular-applications-2/sean-larkin-tweet.png" class="lazyload shadow small" />

{:Sean Larkin tweet on the importance of code-splitting: .image-source}
[Tweet Source](https://twitter.com/thelarkinn/status/1017052742039326721?lang=en)
{: Sean Larkin tweet on the importance of code-splitting}

Building feature modules is useful to separate concerns in an Angular application. As you continue to grow your Angular app, you'll most likely reach a point where you realize that code-splitting some modules can cut down the initial page size significantly.

## Conclusion

In this article, we built an Angular 7 application from the ground up as well as explored how lazy loading can be useful to optimize performance. I was also planning to cover `@angular/service-worker` and how it ties into the CLI in this post but it turned out to be a lot longer than I expected, so we'll dive in to that in the next part of the series.
