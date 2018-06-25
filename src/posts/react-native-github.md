![React Native GitHub Banner](assets/react-native-github/banner.png 'GitHub in your pocket'){: .article-image-with-border }

**_`Shameless plug`: If you enjoy reading this tutorial, you might be interested in reading [FullStack React Native](https://www.fullstackreact.com/react-native/), a book I'm writing along with [Devin](https://twitter.com/dvnabbott) from Airbnb and the FullStack team. The first chapter is a free standalone section that also goes through building an entire app from scratch._**

React builds on the premise that you can [learn once and write anywhere](https://code.facebook.com/posts/1014532261909640/react-native-bringing-modern-web-techniques-to-mobile/). With this, the Facebook team built React Native, a framework that allows us to write in the same React style to create platform-specific iOS and Android components that produces a purely native mobile application. In short, [React Native](https://facebook.github.io/react-native/) let's us build native mobile applications using JavaScript and React.

In this post, we'll go over how I built [GitPoint](https://gitpoint.co/), a GitHub mobile client, in significant detail.

<div class="button-center">
  <a class="blog-button" href="https://github.com/gitpoint/git-point">Source Code</a>
</div>

![GitPoint](assets/react-native-github/app.jpg 'GitPoint'){: .article-image-with-border }

With the help of some amazing [contributors](https://github.com/gitpoint/git-point/graphs/contributors) these past few months, the application has grown to a considerable size. This means we won't be able to go through how I built the entire application in this blog post unfortunately, but I hope I do a decent enough job explaining all of the core concepts as well as how I built a number of the important screens and components in the app.

## Flow of this tutorial

There are already a significant number of tutorials online that show you how to build a relatively simple app without going into too much detail. Although I've learned a lot from many of these, I want this article to be a little different. Throughout this post, I’ll try my best to explain my thought process every step of the way, some of the mistakes I’ve made and what I did to fix them (or should do to fix them if they're still there :P).

Here's a rundown of what we'll be doing.

1.  We'll start by exploring the different ways to begin building a React Native application.
2.  We'll then build our first few components with the help of [React Native Elements](https://github.com/react-native-training/react-native-elements). Consequently, we'll build our first complete screen.
3.  To start showing real data, we'll fetch actual data from the GitHub API.
4.  To allow the user to navigate between different parts of the application, we'll add a navigation layer to our app using [React Navigation](https://github.com/react-community/react-navigation)
5.  We'll then authenticate through the GitHub API in order to allow the user to fire authenticated requests as well as sign in and out
6.  At this point, we'll integrate [Redux](https://github.com/reactjs/redux) as a state container to manage all of the data in our application.
7.  Finally, we'll go through the process of ejecting our application to the CLI and demonstrate how to link native modules to our application.

This step by step tutorial will not only cover a lot of the core concepts of React Native, but it will also show you how using different libraries and tools present in the ecosystem can let you build a fully functional and maintainable native application.

**`Humble Brag`: This article may be the the most detailed React Native tutorial you'll find online.**

## Do I need to be a React expert to read this tutorial?

Nope. If you've used React before, you'll pick up some of the initial concepts explained here quicker of course. Regardless, I'll do my best to explain everything so beginners to React/React Native as well as more experienced developers can learn something from this tutorial.

## Do I need to know React before learning React Native?

Nope. I never used React before I started building GitPoint.

# Getting Started

There are a couple of ways to start building a React Native app. Let's go through them in brief.

## Create React Native App

[Create React Native App](https://github.com/react-community/create-react-native-app) lets developers build React Native apps without having to set up any build configuration. By leveraging [Expo's](https://expo.io/) development environment, we can build our applications using any operating system and without writing any native code whatsoever. This is possible because the SDK provides a number of iOS and Android [APIs](https://docs.expo.io/versions/latest/sdk/index.html) that you can access directly (such as the device's camera and contacts for example). **CRNA is the simplest way to begin building a React Native application.**

With that being said, there are some [shortcomings](https://docs.expo.io/versions/latest/introduction/why-not-expo.html) with using Expo. Although a number of different device APIs are provided by default, there are some that are still currently not supported such as Bluetooth. Moreover, we may want to include native modules ourselves. For this, we'll need to use the React Native CLI.

## React Native CLI

Not only would we need to use the [React Native CLI](https://facebook.github.io/react-native/docs/getting-started.html) to write native iOS or Android code ourselves, but we'll also need it if we plan to _link_ libraries that contain native code at some point. In short, anything that needs to be done outside of JavaScript and at the native iOS/Android layer will require us to use the CLI.

With React Native CLI, our application will require Xcode and Android Studio for iOS and Android respectively. This means that developing for both platforms depends on your operating system (for example, you _cannot_ develop for iOS using the CLI unless you own a Mac).

It's important to note that it _is_ possible to eject a CRNA application in order to include native code. You can either eject to [ExpoKit](https://docs.expo.io/versions/latest/guides/expokit.html) to continue to use Expo APIs as well as include native code where needed, or eject entirely to the regular React Native CLI. Please take a look at the [documentation](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md) for more information on this.

## Preparing the app

I began building GitPoint before CRNA was ever announced, so the React Native CLI was pretty much my only option at that point. Moreover, there are a number of different native modules we're using in the app that would have required us to eject from Expo anyway.

For the purpose of this tutorial however, we'll begin by using CRNA since it can be significantly easier to get started with. At a later point in this article, we'll go through the process of ejecting our application in a little more detail. If you would rather begin using the CLI instead, please set up your dependencies based on your operating system by following the instructions [here](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies).

Let's begin by installing CRNA:

```console
yarn global add create-react-native-app
```

Now we'll just need to run the following command to prepare our application:

```console
create-react-native-app git-point
```

We can then navigate to that directory and boot the app:

```console
cd git-point
yarn start
```

This outputs a QR code to the terminal:

![GitPoint QR Code](assets/react-native-github/gitpoint-qr-code.png 'GitPoint QR Code'){: .article-image-with-border }

## Running the app

One of the amazing tools in the Expo toolchain is the client app. You can install it on your iOS or Android device and with the app, you can simply select `Scan QR Code` to scan this code to load the application to your mobile device.

Not only is this an extremely simple way to quickly load and test an application you're building on any iOS or Android device, but you can use this to scan any QR code of a complete published Expo app. For example, here's the QR code for the first app we build in the Fullstack React Native book:

![Weather QR Code](assets/react-native-github/weather-qr-code.png 'Weather QR Code'){: .article-image }

Scanning this QR code will load the complete app to your device. Not only does CRNA make it extremely easy to get started building an application, _but it also makes publishing straightforward_ using the Expo client app.

Okay, now back to GitPoint. If you've already installed the Expo client app and scanned the original QR code printed on your terminal, you should see something like this as the starting point of the app:

![Hello World](assets/react-native-github/hello-world.png 'Hello World'){: .article-image }

{:Hello World: .image-source}
Hello World!
{: Hello World}

You'll need to make sure your mobile device is on the same local network as your computer in order for this to work.

## Viewing the app

Using the Expo client app and scanning the QR code on a real device isn't the only way to view a running application. If you happen to have the required native tooling (Xcode for iOS, or Android Studio for Android), you can view your app using a simulator/emulator. Not only is this useful to test on different platforms and device sizes without actually owning a million phones and tablets, but it can make it easier to view changes to the app faster during development.

![iOS Simulator](assets/react-native-github/ios-simulator.png 'iOS Simulator'){: .article-image-with-border }

{:iOS Simulator: .image-source}
Running the application on an iOS simulator
{: iOS Simulator}

To run on an iOS simulator:

```console
yarn run ios
```

And to run on an Android emulator:

```console
yarn run android
```

Again, you'll need to make sure you've installed the [correct build tools and dependencies](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) if you wish to run on a virtual device.

Personally, I stick to using both an Android emulator and iOS simulator solely during development until I've reached a point where it would make sense to test on a real device.

## Components

From the React Native website:

<blockquote>
  <p>React Native lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI from declarative components.</p>
</blockquote>

With React Native, we can use the same principles we would to build web apps in React and **_declaratively construct our UI in terms of components_**. If you've done any native iOS/Android development before, hopefully you'll realize how much of a game changer this is.

In React Native, everything we build that want represented at any given point in time is within our components. Let's take a look at the first one that has already been set up for us, `App.js`:

```jsx
// App.js

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

`App` is our first component. The structure you see in this file is typical of what you would see in a component in React Native. Let's break down what's inside, beginning with the imports at the top:

```jsx
// App.js

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ...
```

With every React Native component, we need to import the `React` package in order to use ... . We also import any built-in APIs we need from `react-native`. In here, we already have `StyleSheet, Text and View` imported.

Now let's take a look at what's next:

```jsx
// App.js

// ...

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

// ...
```

We have a class that defines the first component in our application: `App`. Notice how this class _extends_ from `React.Component`. We use `extends` to define a class to be a child of another class. In here, we use this to specify classes as components by defining them as children of `React.Component`.

We can attach methods to classes that do things. We already have a single method called `render()` that's attached. It's important to note that this method is **the only required method in every React Native component**. This is where we define how exactly we want our component to look like.

You'll notice that we have an HTML-like syntax that's being returned in this method. This is called [JSX](https://reactjs.org/docs/introducing-jsx.html) and is a React syntax that allows us to describe our UI.

## Built-in components

JSX let's us declare our UI by defining a component _heirarchy_. Every seperate tag within our render method is a separate component. In here, we can see that a `View` component is returned along with `Text` components nested within. `View` and `Text` are just two of the many built-in components provided by React Native. Let's quickly go over each:

1.  [`View`](https://facebook.github.io/react-native/docs/view.html) may be the most commonly used core component in React Native. This component is usually used for defining layouts and containers. It can also be styled on its own just like the way it's being done in this `render()` method.
2.  Like the name suggests, the built-in [`Text`](https://facebook.github.io/react-native/docs/text.html) component is used for displaying text.

## Props

You may have already noticed that there's a `style` attribute attached to the `View` component:

```jsx
// App.js

// ...

export default class App extends React.Component {
  render() {
    return <View style={styles.container}>// ...</View>;
  }
}

// ...
```

This `style` attribute is a `prop`, and every component can have different `props`. `Props` allows us customize our component by passing in different parameters. Every built-in React Native component (like `View`, `Text`, or `Image` for example) contain props that allow us to modify them. For every custom component we create, we can also create custom `props`. We'll explore this further in a little bit.

Like `View`, many other basic React Native components allow us to use a `style` prop to add styling.

## Styling

Although we can add styles to a component by using inline styles (for example: `<View style={% raw %}{{backgroundColor: '#fff'}}{% endraw %}>`), it usually helps to create a separate `styles` object with which we can reference in our `render` method. You can see that our component already has one:

```jsx
// App.js

// ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

This is why we have `StyleSheet` imported at the top of the file. This API allows us to abstract our styles in a separate object similar to the way CSS styles are created in a webpage. Although it's similar, it's important to remember React Native does not _actually_ use CSS.

## Screens and Components

Now that we have a good understanding of the base component scaffolded for us already, let's actually start building our first screen. Before we begin, let's try to understand what we mean by _screen_. Let's take a second to view the Instagram app:

![Instagram Saved Screen](assets/react-native-github/instagram-saved-screen.png 'Instagram Saved Screen'){: .article-image-with-border .fix-small }

{:Instagram Saved Screen: .image-source}
Instagram Saved screen (where I save nothing but quality memes)
{: Instagram Saved Screen}

In Instagram, you can save posts to your profile so you can always come back to take a look at them at a later time. If I were to build this screen with React Native, I might do something like this:

![Instagram Saved Screen Components](assets/react-native-github/instagram-saved-screen-comps.png 'Instagram Saved Screen Components'){: .article-image .fix}

The entire UI you see on the device when you view your saved posts can be characterized as a _screen_. It's a component just like any other component, but nested within would be the lower level components that make up what we see.

A common data architecture when building JavaScript applications is seperating the concern between **container** and **presentational** components. We can think of container components as those that are responsible for fetching and manipulating data whereas presentational components have all of their data passed in from their parent. In React Native, we can characterize _screens_ as container components that we navigate to and control most of the logic in the app. Within each screen can live a number of different, reusable components that take in data directly as 'arguments' (`props`) and do what they need to do in terms of UI and styling.

Now when we think of building screens, we'll most likely need to set up navigation to allow the user to switch between different screens. Let's take a look at this Instagram screen again in terms of navigation:

![Instagram Saved Screen Navigation](assets/react-native-github/instagram-saved-screen-nav.png 'Instagram Saved Screen Navigation'){: .article-image .fix}

We can see that there are two places on the screen that allow us to navigate, a top navigation bar that allows us to go back to where we were previously and a bottom tab navigation bar that allows us to switch between different root screens. These navigation elements are components like anything else and although we can build them manually along with their routing logic, there are libraries out there that make it simpler. We'll explore this in more detail in a bit.

## What we're building

As much as I would like to show you how I built the entire GitPoint application, it would unfortunately take me a lot longer than a single blog post (if there's interest, definitely don't mind writing future posts continuing where we leave off here :P).

We'll work on building the following GitHub screens:

1.  Profile
2.  Repository list
3.  Events
4.  Notifications
5.  Search

## Profile Screen

We'll begin with the GitHub profile screen:

![GitHub Profile](assets/react-native-github/github-profile.png 'GitHub Profile'){: .article-image-with-border }

{:GitHub Profile: .image-source}
My Profile!
{: GitHub Profile}

This was the first screen I built when I started building GitPoint for a few reasons:

- It allowed me to start small and simple without worrying about state management or app navigation. I was still getting used to how React Native worked and I solely focused on just building all the **components** I would need for this screen.
- The GitHub public API provided enough information for the user endpoint to allow me to get the information I needed for this screen without worrying about authentication

Everyone has their own way of mocking how their application would look like before diving in head-first and coding. Whether it's drawing super simple wireframes on paper or building high fidelity designs on Sketch, getting a base mockup before building is usually a good idea. I, on the other hand, dived right in to building this screen and learned a lot of things on the way :P.

One thing that I did do however, was spend some time observing all the native mobile apps that I use regularly to see how they built different parts of their UI. The profile screen in the [Meetup](https://www.meetup.com/apps/) app caught my eye:

![Meetup Profile Screen](assets/react-native-github/meetup-profile-scroll.gif 'Meetup Profile Screen'){: .article-image-with-border .fix-very-small }

I thought the parallax scroll aspect of this was pretty neat, as well as how the user with their details is shown nicely in the top part of the screen. Let's get started to make our screen look this delicious:

```jsx
// App.js

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri: 'https://houssein.me/public/me.jpg',
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Houssein Djirdeh</Text>
          <Text style={styles.subtitle}>Pet Detective</Text>
        </View>
        <View style={styles.detailsContainer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  avatar: {
    width: 75,
    height: 75,
    marginBottom: 20,
    borderRadius: 37.5,
    borderColor: '#fff',
    borderWidth: 2,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
  },
});
```

And this renders:

![Profile Screen 1](assets/react-native-github/profile-screen-1.png 'Profile Screen 1'){: .article-image-with-border .fix-small }

It's a start! Let's break down what we just did, beginning with the imports at the top of file:

```jsx
// App.js

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// ...
```

We included the React Native [`Image`](https://facebook.github.io/react-native/docs/image.html) as part of our imports in order to display our user image. We also changed things up in our render method:

```jsx
// App.js

// ...

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri: 'https://houssein.me/public/me.jpg',
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Houssein Djirdeh</Text>
          <Text style={styles.subtitle}>Pet Detective</Text>
        </View>
        <View style={styles.detailsContainer} />
      </View>
    );
  }
}

// ...
```

We've nested two `View` components within the parent `View` to represent the top user profile portion of the screen and the bottom part with the user details we'll add a little later. For the `userContainer` view, we've included an `Image` to display the user avatar (hard-coded to my beautiful face for now) as well as two `Text` elements. The image as well as the two text fields (which will eventually represent the user's GitHub full name as well as their login name) will later be real data once we communicate with the GitHub API.

The last thing we added was some extra styling:

```jsx
// App.js

// ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  avatar: {
    width: 75,
    height: 75,
    marginBottom: 20,
    borderRadius: 37.5,
    borderColor: '#fff',
    borderWidth: 2,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
  },
});
```

To keep this article to a somewhat reasonable length, we're not going to over the styling in too much detail. One thing that's important to gather from here however is that React Native allows us to use [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) to structure the layout of our components.

## Custom Components

Let's begin layering out our application in terms of custom components. We'll begin by moving our `TextInput` into a separate component in order to hide its implementation details from the main `App` component. Create a `components` directory in the root of the application with the following files:

{lang=bash}
├── components/ - index.js - SearchInput.js

All of the custom components we create will live inside this directory. `SearchInput` is our first component so let's include all of our `TextInput` logic in `SearchInput.js`.

Let's break down what this file contains:

- A component named `SearchInput` is exported
- Our component accepts a `placeholder` prop
- Our component returns a React Native `TextInput` with a few of its properties specified. Placeholder is the only prop that uses the parent prop of the same name

Now let's use `index.js` to export this component.

There are more than a few ways to export and import components in our application. In here, we use a named export for `SearchInput`. `index.js` is then used as a _barrel_ to re-export all of our components. This allows us to import our components with the following format:

{lang=javascript}
import { Component1, Component2, ... } from './components';

Now let's take a look at how we can update `App.js`.

![Shocked](assets/react-native-github/shocked.gif 'Shocked'){: .article-image-with-border }

{:Shocked: .image-source}
My reaction when launching the Chrome Debugger for the first time
{: Shocked}
