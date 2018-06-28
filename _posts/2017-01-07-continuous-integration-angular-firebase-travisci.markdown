---
layout: post
title:  "Continuous Integration | Angular CLI + Firebase + Travis CI"
share_title:  "Continuous Integration with Angular CLI, Firebase and Travis CI"
date:   2017-01-07 07:30:00
description: After completing the first step of building your application, the next thing most of us do is pick a hosting platform (like Github Pages) and deploy it. This is awesome, but we always need to make sure to deploy a newer build every time we update our app. We also need to run any unit tests we may have and make sure they pass beforehand.
comments: true
type: post
image: assets/continuous-integration-angular-firebase-travisci/continuous-integration-banner.jpg
permalink: /:title
---
After completing the first step of building your application, the next thing most of us do is pick a hosting platform (like [Github Pages](https://pages.github.com/)) and deploy it. This is awesome, but we always need to make sure to deploy a newer build every time we update our app. We also need to run any unit tests we may have and make sure they pass beforehand.

Thankfully, there are continuous integration and deployment tools that can make this process a lot simpler. This isn't something you only need to do for large scale production applications, but even updating a small hobby project can be a lot easier if all you had to do is `push` to your repository and let your integration pipeline do the rest.

## The breakdown

In this post, we'll begin by creating an application from scratch using [Angular CLI](https://github.com/angular/angular-cli). We'll then use [Firebase](https://firebase.google.com/) as our hosting service and [Travis CI](https://travis-ci.org/) as our continuous integration platform. By the end of this article, your workflow will look something like this:

1. You push to your Github repository
2. Grab a coffee
3. TravisCI begins by installing all the dependencies
4. The build script is run
5. If your build passes, the application is deployed to Firebase

This post will not explain how you can use the CLI in detail nor show you how to actually build an Angular application. I wrote a [post]({{ site.url }}/angular2-hacker-news) that explains this thoroughly so please take a look if you're interested.

## Getting Started

Let's start by installing Angular CLI.

{% highlight bash %}
npm install -g @angular/cli
{% endhighlight %}

And now we can create and run a new project. I'm going to call it `Boom Shakalaka`.

{% highlight bash %}
ng new boom-shakalaka
cd boom-shakalaka
ng serve
{% endhighlight %}

If you go to `localhost:4200`, you'll see your application!

<img alt="Boom Shakalaka App" title="Boom Shakalaka App" data-src="/assets/continuous-integration-angular-firebase-travisci/boom-shakalaka.png" class="lazyload shadow" />

Since Travis CI easily syncs with Github, let's create our repository.

<img alt="Github Repository" title="Github Repository" data-src="/assets/continuous-integration-angular-firebase-travisci/boom-shakalaka-github.png" class="lazyload shadow" />

We can now add the remote repository to our project.

{% highlight bash %}
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/boom-shakalaka.git
git push -u origin master
{% endhighlight %}

## Firebase

Firebase is an awesome platform that provides a number of different services that you can you use for your mobile or web application. There are two that I use quite often, the [database](https://firebase.google.com/docs/database/) as well as the [hosting](https://firebase.google.com/docs/hosting/) platform.

For **Boom Shakalaka**, we'll only need to host it. We can do that by using the Firebase CLI, but first you'll need to [sign in](https://firebase.google.com/), head to the console and create your project.

<img alt="Create New Project" title="Create New Project" data-src="/assets/continuous-integration-angular-firebase-travisci/create-project.png" class="lazyload shadow small" />

Once you've created your project, you can head to your terminal and run the following at the root of your project to set up the CLI.

{% highlight bash %}
npm install -g firebase-tools
firebase login
firebase init
{% endhighlight %}

You should see the following in your terminal.

<img alt="Firebase init" title="Firebase init" data-src="/assets/continuous-integration-angular-firebase-travisci/firebase-init.png" class="lazyload shadow" />

Let's go through each of the questions.

1. `What Firebase CLI features do you want to setup for this folder?` -- Hosting
2. If it asks you which Firebase project do you want to associate as default, select the correct project
3. `What file should be used for Database Rules?` -- Just click enter since we'll not be using the database for our application
4. `What do you want to use as your public directory?` -- Type in `dist` and hit enter (this is because when you run a build with Angular CLI, the compiled code that should be deployed is located in this directory)
5. `Configure as a single-page app?` -- Yep

And that's it. Since you specified your default project, all you'll need to do is run the following to create a production build and deploy it.

{% highlight bash %}
ng build --prod
firebase deploy
{% endhighlight %}

<img alt="Firebase Deploy" title="Firebase Deploy" data-src="/assets/continuous-integration-angular-firebase-travisci/firebase-deploy.png" class="lazyload shadow" />

Now if you navigate to the URL provided, you'll see your application!

<img alt="Firebase Hosted" title="Firebase Hosted" data-src="/assets/continuous-integration-angular-firebase-travisci/boom-shakalaka-firebase.png" class="lazyload shadow" />

In your terminal, run the following command to get your token (you'll be asked to authenticate). We'll need it in a bit.

{% highlight bash %}
firebase login:ci
{% endhighlight %}

<img alt="Firebase Token" title="Firebase Token" data-src="/assets/continuous-integration-angular-firebase-travisci/firebase-token.png" class="lazyload shadow" />

## Travis CI

Travis CI is a continuous integration platform that you can use with your Github projects. Once synced with your repository, it will build the project and run your tests every time you push to your branch (or merge a pull request).

[Sign in](https://travis-ci.org/) to Travis CI with your Github account and you should see a list of your repositories.

<img alt="Travis CI Repositories" title="Travis CI Repositories" data-src="/assets/continuous-integration-angular-firebase-travisci/travis-ci-repositories.png" class="lazyload shadow" />

Check the one you wish to sync and click the little **cog** icon to enter its settings.

<img alt="Travis CI Settings" title="Travis CI Settings" data-src="/assets/continuous-integration-angular-firebase-travisci/travis-ci-settings.png" class="lazyload shadow" />

You can see that I have **`Build Pushes`** and **`Build Pull Requests`** turned *ON*. This means that anytime I push directly to this repository or merge a pull-request, Travis CI will trigger a build.

You also need to add an environment variable for your token. Let's name it `FIREBASE_TOKEN` and copy the token we just generated in our terminal.

Now the final thing we need to do is set up our configurations, which we can do by creating a `.travis.yml` file at the root of our project (notice how I also have **`Build only if .travis.yml is present`** turned *ON*).

{% highlight bash %}
#.travis.yml

language: node_js
node_js:
  - "6.9"

branches:
  only:
    - master

before_script:
  - npm install -g firebase-tools
  - npm install -g @angular/cli

script:
  - ng build --prod

after_success:
  - firebase deploy --token $FIREBASE_TOKEN

notifications:
  email:
    on_failure: change
    on_success: change
{% endhighlight %}

The [docs](https://docs.travis-ci.com/user/customizing-the-build/#The-Build-Lifecycle_) do a great job explaining the build lifecycle, but I'll quickly summarize these configurations.

**`before_script:`** These are commands that run before the build step. Here I just install `firebase-tools` and `angular-cli`.

**`script:`** The build step where we run a production build for our application.

**If you needed to, you can have multiple commands here and they will fire in order. A good example would be generating a service worker after every build.**

**`after_success:`** These are additional commands that run if the build succeeds. In our case, we just deploy to Firebase.

**If you have multiple Firebase projects/aliases set up, you can specify `firebase use YOUR_PROJECT_ALIAS` before the deploy command to specify which project you want to deploy.**

**`notifications:`** You can specify the type of notifications you would like and when to receive them. More info in the [docs](https://docs.travis-ci.com/user/notifications/).

## Unit tests

I didn't cover tests in my configuration, but it is important to mention that Angular CLI uses [Karma](http://karma-runner.github.io/0.13/index.html) for it's unit tests which run against a browser. Here's a [great article](http://blog.500tech.com/setting-up-travis-ci-to-run-tests-on-latest-google-chrome-version/) that explains how to setup your configurations to have Travis CI run unit tests on Google Chrome. Here's another [article](http://gist.asciidoctor.org/?github-mraible%2Fng2-demo%2F%2FREADME.adoc#_continuous_integration) that shows how you can have your unit and end-to-end tests run as part of your build for your Angular CLI project.

## Triggering a build

Now that we have our `.travis.yml` file set up, I'm going to modify the application slightly to look like this.

<img alt="Boom Shakalaka" title="Boom Shakalaka" data-src="assets/continuous-integration-angular-firebase-travisci/boom-shakalaka-final.png" class="lazyload shadow" />

Now all we need to do is commit and push our changes.

{% highlight bash %}
git add .
git commit -m "set up .travis.yml"
git push origin master
{% endhighlight %}

And that's it! You can always take a look at your build status on your repository in Travis CI. After a few minutes, you should see your newly built application deployed. You can see mine [here](https://boom-shakalaka-84034.firebaseapp.com/).

## Conclusion

If you were looking to find a simple way to set up an Angular project with continuous integration, then I hope this helped <i class="fa fa-smile-o" aria-hidden="true"></i>. As always, please don't hesitate to let me know if you have any questions or feedback!
