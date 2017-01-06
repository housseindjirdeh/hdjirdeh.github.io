---
layout: post
title:  "Continuous Integration for Angular CLI with Firebase and Travis CI"
date:   2017-01-11 9:20:00 -0400
categories: angular progressive web app javascript
description: After crossing the first step of building your application, the first thing most of us do is pick a hosting platform (like Github Pages for example) and deploy it. This is awesome, but whenever we update the app, we need to make sure to deploy our brand new build. If we have unit tests, we also need to run them and make sure they pass beforehand...
tags:
- angular
- progressive web app
- javascript
comments: true
type: post
image: assets/continuous-integration-angular-firebase-travisci/continuous-integration-banner.jpg
permalink: /:title
published: false
---
![Banner](assets/continuous-integration-angular-firebase-travisci/continuous-integration-banner.jpg "Continuous Integration for Angular CLI with Firebase and Travis CI"){: .article-image }

After crossing the first step of building your application, the first thing most of us do is pick a hosting platform (like [Github Pages](https://pages.github.com/) for example) and deploy it. This is awesome, but whenever we update the app, we need to make sure to always deploy our new build. If we have unit tests, we also need to run them and make sure they pass beforehand.

Thankfully, there are continuous integration and deployment tools that can make this process a lot simpler. This isn't something you only need to do for large scale production applications, but even updating a small hobby project can be a lot easier if all you had to do is `push` to your repository and let your integration pipeline do the rest.

The breakdown
==================

In this post, we'll begin with setting up an Angular application using the CLI from scratch. We'll then use Firebase as our hosting service and Travis CI as our continuous integration platform. Once setup, your workflow will look something like this.

<div id="cont-integration-flow" class="row">
  <div class="item col-md-2 col-md-offset-1">
    <i class="fa fa-4x fa-github" aria-hidden="true"></i>
    <p>You push to your Github repository</p>
  </div>
  <div class="item col-md-2">
    <i class="fa fa-4x fa-coffee" aria-hidden="true"></i>
    <p>Grab a coffee</p>
  </div>
  <div class="item col-md-2">
    <i class="fa fa-4x fa-terminal" aria-hidden="true"></i>
    <p>TravisCI begins by installing all the dependencies</p>
  </div>
  <div class="item col-md-2">
    <i class="fa fa-4x fa-wrench" aria-hidden="true"></i>
    <p>The build script is run</p>
  </div>
  <div class="item col-md-2">
    <i class="fa fa-4x fa-check" aria-hidden="true"></i>
    <p>If your build passes, it's deployed to Firebase</p>
  </div>
</div>

Let's get the ball rolling
==================

Let's begin by creating a brand new project. We start by installing `angular-cli`.

{% highlight bash %}
npm install -g angular-cli
{% endhighlight %}

And now we can create and run our project. I'm going to call it `Boom Shakalaka`.

{% highlight bash %}
ng new boom-shakalaka
cd boom-shakalaka
ng serve
{% endhighlight %}

If you go to `localhost:4200`, you'll see your application!

![Boom Shakalaka App](assets/continuous-integration-angular-firebase-travisci/boom-shakalaka.png){: .article-image-with-border }

Since Travis CI easily syncs with your Github repository, let's create our initialize our repository.

![Github Repository](assets/continuous-integration-angular-firebase-travisci/boom-shakalaka-github.png){: .article-image-with-border }

{% highlight bash %}
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/boom-shakalaka.git
git push -u origin master
{% endhighlight %}

Firebase
==================

[Firebase](https://firebase.google.com/) is an awesome platform that provides a number of different services that you can you use for your mobile or web application. There are two that I use quite often when setting up a simple hobby project, it's [database](https://firebase.google.com/docs/database/) as well as it's [hosting](https://firebase.google.com/docs/hosting/) platform.

For `Boom Shakalaka`, we'll only need to host it. We can do that by using the Firebase CLI, but first you'll need to [sign in](https://firebase.google.com/) and head to the console. Once that's done, you can create your project.

![Create New Project](assets/continuous-integration-angular-firebase-travisci/create-project.png){: .article-image-with-border .fix }

Once you've created it, you can head to your terminal and run the following at the root of your project to set up the CLI.

{% highlight bash %}
npm install -g firebase-tools
firebase login
firebase init
{% endhighlight %}

You should see the following in your terminal.

![Firebase init](assets/continuous-integration-angular-firebase-travisci/firebase-init.png){: .article-image-with-border }

1. Select hosting
2. If it asks you which Firebase project do you want to associate as default, select the correct project
3. `What file should be used for Database Rules?` - Just click enter since we'll not be using the database for this app
4. `What do you want to use as your public directory?` - Type in `dist` and hit enter
5. `Configure as a single-page app?` - Yep

And that's it. Since you specified your default project, all you'll need to do is run the following to create a production build and deploy it.

{% highlight bash %}
ng build --prod
firebase deploy
{% endhighlight %}

![Firebase Deploy](assets/continuous-integration-angular-firebase-travisci/firebase-deploy.png){: .article-image-with-border }

Now if you navigate to the URL provided, you'll see your application!

![Firebase Hosted](assets/continuous-integration-angular-firebase-travisci/boom-shakalaka-firebase.png){: .article-image-with-border  }

In your terminal, run the following command to get your token (you'll be asked to authenticate). We'll need it in a bit.

{% highlight bash %}
firebase login:ci
{% endhighlight %}

![Firebase Token](assets/continuous-integration-angular-firebase-travisci/firebase-token.png){: .article-image-with-border  }

Travis CI
==================
Login to [Travis CI](https://travis-ci.org/) with your Github account and you should see a list of your repositories.

![Travis CI Repositories](assets/continuous-integration-angular-firebase-travisci/travis-ci-repositories.png){: .article-image-with-border }

Check the one you wish to sync and click the little **cog** icon to enter it's settings.

![Travis CI Settings](assets/continuous-integration-angular-firebase-travisci/travis-ci-settings.png){: .article-image-with-border}

You can see that I have **Build Pushes** and **Build Pull Requests** turned to *ON*. This means that anytime I push directly to this repository or if I merge a pull-request, Travis CI will trigger a build.
