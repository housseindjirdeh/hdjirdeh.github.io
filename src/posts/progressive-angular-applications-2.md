![Progressive Angular Banner](assets/progressive-angular-applications-2/banner.jpg 'Progressive Angular Banner'){: .article-image-with-border }

In [Part 1]({{ site.url }}/progressive-angular-applications) of this article, we explored how to add a number of progressive enhancements to a [Hacker News client built with Angular](https://angular2-hn.firebaseapp.com). That post was written a year ago and a lot has changed in the Angular ecoystem since then, and the next two articles in this series will focus on newer tools that we can use to build progressive Angular applications. This post will focus on **lazy-loading**.

# The breakdown

To explore how we can add lazy loading to an Angular application, we'll build a relatively small application called **Tour of Thrones**.

![Tour of Thrones](assets/progressive-angular-applications-2/tour-of-thrones.png 'Tour of Thrones'){: .article-image-with-border }

<div class="button-center">
  <a class="blog-button" href="https://tour-of-thrones.firebaseapp.com/home">View App</a>
  <a class="blog-button" href="https://github.com/housseindjirdeh/tour-of-thrones">Source Code</a>
</div>

The app will use [An API of Ice and Fire](https://anapioficeandfire.com/) (an unofficial, community-built API for Game of Thrones) to list houses from the book series and provide information about them. While building this application, we'll explore a number of topics including:

- Bootstrapping with Angular CLI
- Lazy loading on scroll
- Lazy loading on route change
- Secondary routes

Since I got a little carried away writing this article, the first half consists of building the application from the ground up before diving into some lazy loading techniques. If you're not interested in spending some time learning how to build this application from scratch, feel free to skip right ahead to the [Lazy Loading]({{ site.url }}/progressive-angular-applications-2#lazy-loading) section. If you would like to first read and understand more about what progressive web applications are, you can take a look at the [first part](http://localhost:4000/progressive-angular-applications) of this series.

<aside>
  <p>In case you happen to be a fan of the book series/show and are concerned about potential spoilers in this article or application - don't worry because there are none :).</p>
</aside>

# Getting Started

If we have the required [Node and NPM versions](https://github.com/angular/angular-cli#prerequisites), we can install Angular CLI with the following command:

```console
npm install -g @angular/cli

```
We can then create a new application:

```console
ng new tour-of-thrones --style=scss
cd tour-of-thrones
npm start
```

Adding `--style=scss` bootstraps our application with predefined Sass files for styling. You should now see the "Hello World" of our app.

![Hello World](assets/progressive-angular-applications-2/hello-world.png 'Hello World'){: .article-image-with-border }

Our application will consist of two parts:

- A base `home` route that lists all the Game of Thrones houses.

![Home Route](assets/progressive-angular-applications-2/home-route.png 'Home Route'){: .article-image-with-border }

- A secondary `house` route that shows information for a particular house in a modal.

![House Route](assets/progressive-angular-applications-2/house-route.png 'House Route'){: .article-image-with-border }

## First Component

Let's begin by building the first few components in our application. We'll start with the `HeaderComponent` responsible for showing the name of the application in the `home` route. We'll create a separate `components/` directory to contain this component:

```html
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
```

```javascript
// src/app/component/header/header.component.ts

import { Component } from '@angular/core';

@Component({
selector: 'app-header',
templateUrl: './header.component.html',
styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
```

You can get the styles for the component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/header/header.component.scss).

To simplify how we import components throughout the application, we can have named exports in the same directory for each component in an `index.ts` file:

```javascript
// src/app/component/header/index.ts

export { HeaderComponent } from './header.component';
```

Similarly, we can re-export these components one level higher in an `index.ts` file within the `components/` directory:

```javascript
// src/app/component/index.ts

export { HeaderComponent } from './header';
```

<aside>
  <p> Normally, we would import multiple components from other files to a parent component like this:</p>

<figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-a'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentB <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-b'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component/component-c'</span><span class="token punctuation">;</span></code></pre></figure>

  <p>We can also use <code>index.ts</code> files to re-export components (or any exports). This files are sometimes referred to as <i>barrel</i> files and allow us to simplify how we can import exports into something like this:</p>

  <figure class="highlight"><pre class=" language-javascript"><code class=" language-javascript" data-lang="javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ComponentA<span class="token punctuation">,</span> ComponentB<span class="token punctuation">,</span> ComponentC <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../component'</span><span class="token punctuation">;</span></code></pre></figure>

  <p>Although we use the latter approach in this article, there is no <i>correct</i> way to export and import modules, components, or any exports. It's always a matter of preference.</p>
</aside>

By default, Angular CLI allows us to import using absolute imports (`import ComponentA from 'src/app/component'`). Since all of our files live within the `app` directory, we can modify our `baseUrl` in `tsconfig.json` to import directly from `app` and not `src/app`:

```javascript
// tsconfig.json

{
"compileOnSave": false,
"compilerOptions": {
"baseUrl": "src",
// ...
}
}
```

The only component (`app.component.ts`) and module (`app.module.ts`) scaffolded when we created the project live directly in `src/app`. Let's modify `AppComponent` to include `HeaderComponent`:

```html

<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
</div>
```

You can see the styling for this component [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/app.component.scss).

In order to be able to reference this component in `AppComponent`, we also have to make sure it's declared in `AppModule`:

```javascript
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
```

The last thing we'll do before taking a quick look at our progress is add some global styles to our application (which includes our Thrones-style font). All global styles in an Angular application go to the `styles.scss` file at the root of the `src/` directory. You can refer to the [file](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/styles.scss) to copy over the styles directly.

<aside>
  <p>If you want to use the same Game of Thrones font (created by <a href="https://charliesamways.carbonmade.com/">Charlie Samways</a>), make sure to download it <a href="https://charliesamways.carbonmade.com/projects/4420181#7">here</a> (it is free for personal use). Otherwise, feel free to remove the <code>@font-face</code> in <code>styles.scss</code>.</p>
</aside>

### Try it out

If we run the application now, we'll see our header component take up a little more than half our screen.

![Header](assets/progressive-angular-applications-2/header.png 'Header'){: .article-image-with-border }

# Base Route

Now that we've got our feet wet building our first component. Let's move on to building everything necessary for the base route of our application, the `/home` route. We'll need:

- A card component to display the information of each house
- A routing system in place to define a `/home` route
- A service to interface with our external API

Let's begin with our `CardComponent`:

```html

<!-- src/app/component/card/card.component.html -->

<div (click)="onClick()" class="card grow" [ngStyle]="setBackgroundStyle()">
  <h3>{% raw %}{{name}}{% endraw %}</h3>
</div>
```

```javascript
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
```

```javascript
// src/app/component/card/index.ts

export { CardComponent } from './card.component';
```

```javascript
// src/app/component/index.ts

export { CardComponent } from './card';
export { HeaderComponent } from './header';
```

We're using input binding in order to pass an `id` parameter (the house ID) as well the house name and color. The color here isn't retrieved from the API, but will just be randomly generated to add a little spice to the UI of the card component. We use `ngStyle` to add `box-shadow` and `background` CSS properties using this color.

In this component, we also make use of an `EventEmitter` in order to fire a card click event to be handled by a parent component. We pass the house `id` into this event as well.

<aside>
<p>Although we could to try to handle all logic within this component, it probably makes more sense to keep this component as <i>dummy</i> as possible and let the parent handle what happens on submitted user actions.</p>
</aside>

The styles for the card component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/component/card/card.component.scss). Now we'll need to declare this component in our `AppModule` if we plan on using it:

```javascript
// src/app/app.module.ts

// ...

import { HeaderComponent, CardComponent } from 'app/component';

@NgModule({
declarations: [AppComponent, HeaderComponent],
// ...
})
// ...
```

### Try it out

Let's add a couple of dummy card components to `AppComponent` to see if they're displaying correctly:

```html

<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <app-card id="1" name="House Freshness" color="green"></app-card>
  <app-card id="2" name="House Homes" color="red"></app-card>
  <app-card id="3" name="House Juice" color="orange"></app-card>
  <app-card id="4" name="House Replay" color="blue"></app-card>
</div>
```

![Card Components](assets/progressive-angular-applications-2/cards.png 'Card Components'){: .article-image-with-border }

We can see our cards being rendered! They don't have any specific widths/heights assigned to them and they take the shape of their parent container. Once we add our home route next, we'll use CSS grid to give our cards some structure.

## Routing

It's time to begin adding navigation to our application. Instead of placing components that make up our routes in the `component/` directory, we'll put them in a separate directory called `scene/`.

Let's build `HomeComponent` responsible for the initial route:

```html

<!-- src/app/scene/home/home.component.html -->

<div class="grid">
  <app-card
    *ngFor="let house of houses"
    [id]="house.id"
    [name]="house.name"
    [color]="house.color">
  </app-card>
</div>
```

```javascript

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
```

```javascript
// src/app/scene/home/index.ts

export { HomeComponent } from './home.component';
```

```javascript
// src/app/scene/index.ts

export { HomeComponent } from './home';
```

The styles for this component can be found [here](https://github.com/housseindjirdeh/tour-of-thrones/blob/master/src/app/scene/home/home.component.scss). If you take a look at the styles, we wrap our list of cards in a grid structure.

<aside>
  <p>We're not going to explain CSS grid in this article, but you can refer to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout">this</a> if you're interested in learning more.</p>
</aside>

Now let's define our routes:

```javascript
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
```

We’ve defined a single route path (`home`) that maps to a component (`HomeComponent`) and we've set up the root path to redirect to this. Now we need to let our application know where to dynamically load the correct component based on the current route, and we can do that by using `router-outlet`:

```html

<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <router-outlet></router-outlet>
</div>
```

### Try it out

If we take a look at our application now, we'll see our `HomeComponent` showing our list of houses in a grid structure.

![Home Component](assets/progressive-angular-applications-2/home-component.png 'Home Component'){: .article-image-with-border }

We can also see that loading the base URL of our application immediately redirects to `/home`.

## Service

Let's begin by adding a service responsible for interfacing with our API. We'll put our this in a `/service` directory:

```javascript
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
```

We're using Angular's `HttpClient` to interface with our API by defining two separate methods:

- `fetchHouses`: Get a list of houses given a page number
- `fetchHouse`: Get information about a particular house

We'll also wrap our service in its own module:

```javascript
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
```

```javascript
// src/app/service/index.ts

export { IceAndFireService } from './iceandfire.service';
export { ServicesModule } from './service.module';
```

In our service, we type-check with a `House` interface. Let's add our types and interfaces to a `type/` directory:

```javascript
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
```

```javascript
// src/app/type/index.ts

export { House } from './house';
```

Now let's import the services module in `AppModule`:

```javascript
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
```

We can now update `HomeComponent` to use our appropriate service method:

```javascript
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
`#${Math.random() .toString(16) .slice(-6)}66`;
```

Let's quickly go over the changes here:

- We're importing `IceAndFireService` and injecting it into our component constructor
- We're using the `OnInit` lifecycle hook to fire the `getHouses` class method as soon as our component finishes initializing
- In our service, `this.http.get` returns an observable. In this component, the `getHouses` method calls our service method and subscribes to the observable returned. Since the API does not have a specific ID attribute for each object, we're mapping through the response and obtaining the ID from the URL attribute as well as assigning a color to each house.
- We finally added `getColor`, a tiny utility method that returns a color that we assign for each house. This isn't _exactly_ random, but it works for now. Also the two digits at the end of the string, `66`, represent [alpha transparency](https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4).

### Try it out

If we take a look at our application now, we'll see the first page of houses rendered as soon as we load the application:

![Service](assets/progressive-angular-applications-2/service.png 'Service'){: .article-image-with-border }

# Lazy Loading

To improve loading times on a web page, we can try to **lazy load** non-critical resources where possible. In other words, we can defer the loading of certain resources until the user actually needs them.

In this application, we're going to lazy load on two different user actions:

- On scroll
- On route change

## Infinite scrolling

**Infinite scrolling** is a lazy loading technique to defer loading of future resources until the user has almost scrolled to the end of their currently visible content.

In this application, we want to be careful with how many houses we fetch over the network as soon as the page loads. Like many APIs, the one we're using [paginates](https://anapioficeandfire.com/Documentation#pagination) responses which allows us to pass a `?page` parameter to iterate over responses. We can add infinite scrolling here to defer loading of future paginated results until the user has almost scrolled to the bottom of the web page.

There is more than one way to apply lazy loading to DOM elements:

- Listening to [`scroll`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) events
- Using newer browser APIs like [Intersection Observer](https://developers.google.com/web/updates/2016/04/intersectionobserver)

For this application, we'll use [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll), a community-built library that provides an Angular directive abstraction over changes to the scroll event. With the library, we can listen and fire callback events triggered by scroll behaviour.

```javascript
npm install ngx-infinite-scroll --save
```

We can now import its module into our application:

```javascript
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
```

We can now add this to `HomeComponent`:

```html

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
```

```javascript
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
```

We just added `onScrollDown` as a callback for the directive `scrolled` method. In here, we increment the page number and call the `getHouses` method.

Now if we try running the application, we'll see houses load as we scroll down the page.

![Infinite Scroll](assets/progressive-angular-applications-2/infinite-scroll.gif 'Infinite Scroll'){: .article-image-with-border }

The library allows users to customize a number of attributes such as modifying the distance of the current scroll location with respect to the end of the container that determines when to fire an event. You can refer to the [README](https://github.com/orizens/ngx-infinite-scroll) for more information.

<aside>
  <p>If you're interested in learning how to build your own infinite scroll directive without the use of additional libraries, Ashwin Sureshkumar has a write-up you can refer to <a href="https://codeburst.io/angular-2-simple-infinite-scroller-directive-with-rxjs-observables-a989b12d4fb1">here</a>.</p>
</aside>

### When should we lazy load on scroll?

There are countless ways to organize a paginated list of results in an application like this, and an infinitely long list is definitely not the best way. Popular social media applications (such as [Twitter](https://twitter.com/)) use this model to keep users engaged, but it is really not a suitable pattern for applications where the user needs to find specific information quickly. In this application for example, it would take a user an unnecessarily long time to find information about a particular house. Adding normal pagination, allowing the user to filter by region or name, or allowing them to search for a particular house are techniques that may serve for a better user experience.

Instead of trying to lazy load _all_ the content that is displayed to the user as they scroll (i.e. infinite scroll), it might be more worthwhile to try and defer loading of certain elements that aren't immediately visible to users on page load. Elements such as images and video can consume significant amounts of user bandwidth and lazy loading them specifically will not necessarily affect the entire paginated flow of the application.

<aside>
  <p>Addy Osmani has an excellent section on lazy loading images in his <a href="https://images.guide/#lazy-load-non-critical-images">guide to image optimization</a> and Jeremy Wagner has a great <a href="https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/">article</a> on the topic as well.</p>
</aside>

## Code splitting

**Code splitting** refers to the practice of splitting the entire application bundle into separate chunks that can be lazy loaded on demand. In other words, instead of providing users with all the code that makes up the application when they load the very first page, we can give them pieces of the bundle as they navigate throughout the app.

We can apply code splitting in different ways, but it commonly happens on the route level. Webpack, the module bundler used by Angular CLI, has code splitting [built-in](https://webpack.js.org/guides/code-splitting/). Without needing to dive in to the internals of our Webpack configurations in order to make this work, Angular router allows us to [lazy-load](https://angular.io/guide/lazy-loading-ngmodules) any feature module that we build.

Let's see this in action by building our next route, `/home`, which shows information for a single house:

```html

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
```

Our `HouseComponent` shows a number of details for the house selected. It is rendered within a modal and for that reason, we've wrapped its contents within an `<app-modal>` component. We're not going to into too much detail on how this modal component files are written, but you can find them [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/modal).

<aside>
  <p>In case you're wondering how the <code>#houseContent</code> attribute works in this template - it's used to render the entire <code>ng-template</code> block if the expression passed into <code>*ngIf</code> is falsy.</p>
</aside>

However, one important thing to mention is that we using projection (`ng-content`) to project content into our modal. We either project a loading state (`modal-loader`) if we don't have any house information yet or modal content (`modal-content`) if we do. You can find the code that makes up our loader [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/loader).

<aside>
  <p>Although we're only using our modal wrapper for a single component in this application, we're using projection in order to make it more reusable. This can be useful if we happen to need to use a modal in any other part of the application.</p>
</aside>

Unlike the `HomeComponent` which we're bundling directly with the root `AppModule`, we're going to create a separate feature module for `HouseComponent` that we can lazy load:

```javascript
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
```

Now let's move on to the logic behind this component:

```javascript
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
```

In here, we subscribe to our route parameters after the component finishes initializing in order to obtain the house ID. We then fire an API call to fetch its information.

We also have a `modalClose` method that navigates to a modal outlet with a value of `null`. We do this to clear our modal's **secondary route**.

## Secondary routes

In Angular, we can create any number of _named_ router outlets in order to create [secondary routes](https://angular.io/guide/router#displaying-multiple-routes-in-named-outlets). This can be useful to separate different parts of the application in terms of router configurations that don't need to fit into the primary router outlet. A good example of using this is for a modal or popup.

Let's begin by defining our second router outlet:

```html

<!-- src/app/app.component.html -->

<div id="app">
  <app-header></app-header>
  <router-outlet></router-outlet>
  <router-outlet name="modal"></router-outlet>
</div>
```

Unlike the primary router outlet, secondary outlets must be named. For this example, we've named it `modal`.

Now let's add `HomeModule` into our top-level route configurations while lazy loading it. We can do this by using a `loadChildren` attribute:

```javascript
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
```

Although using a `loadChildren` attribute with a value of the path to the module would normally work, there's an [open issue](https://github.com/angular/angular/issues/12842) about a bug that occurs while lazy loading a module tied to a named outlet (secondary route). In the same issue thread, somebody suggests a [workaround](https://github.com/angular/angular/issues/12842#issuecomment-270836368) that involves adding a route proxy component in between:

```javascript
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
```

Until the issue is resolved, this workaround works for now. However, it does add an extra component layer in between. You can see how the `RouteProxyComponent` is nothing more than a single router outlet [here](https://github.com/housseindjirdeh/tour-of-thrones/tree/master/src/app/component/route-proxy).

The last thing we'll need to do here is allow the user to switch routes when a house is clicked:

```javascript
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
```

We added a `routeToHouse` method that navigates to a modal outlet with an array for link parameters. Since `HouseComponent` looks up the ID of the house in our route parameters, we've included it here in the array.

Now let's add a click handler to bind to this event:

```html

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
```

### Try it out

Try loading the application with our changes and clicking on any house.

![House Module](assets/progressive-angular-applications-2/house-module.png 'House Module'){: .article-image-with-border }

If you have the _Network_ tab of your browser's developer tools open, you'll notice that the code that makes up our house module is only loaded when we click on a house.

<aside>
  <p>Notice that the URL for our secondary route tied to our named modal outlet is <code>.../home(modal:house/1)</code>. In here, <code>home</code> is still our primary route. For more information on how secondary routes work, take a look at the detailed <a href="https://angular.io/guide/router#secondary-routes">documentation</a>.</p>
</aside>

### When should we code split?

It depends. In this example, the lazy loaded feature module is less than 10 KB during development and less than 3KB with a production build of the application. If you think this probably doesn't warrant code splitting, you might be right. Lazy loading feature modules can be a lot more useful when your application reaches a considerable size and each of your modules is a juicy cut of the entire application bundle in terms of size.

Building feature modules is useful to separate concerns in an Angular application. As you continue to grow your Angular app, you'll most likely reach a point where you realize that code-splitting some modules can cut down the initial page size significantly.

# Conclusion

In this article, we built an Angular 6 application from the ground up using the CLI as well as explored how lazy loading can be useful to optimize performance. I was also planning to cover `@angular/service-worker` and how it ties into the CLI in this post but this article turned out to be a lot longer than I anticipated. We'll dive in to that topic in the next part of series.

As always, please don't hesitate to reach out to me if you have any comments, questions, or suggestions!
```
