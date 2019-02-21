/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/assets/, workbox.strategies.staleWhileRevalidate({ "cacheName":"image-assets", plugins: [] }), 'GET');
workbox.routing.registerRoute("asynchronous-javascript-callbacks", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-asynchronous-javascript-callbacks", plugins: [] }), 'GET');
workbox.routing.registerRoute("event-and-style-binding-in-angular2", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-event-and-style-binding-in-angular2", plugins: [] }), 'GET');
workbox.routing.registerRoute("angular2-hacker-news", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-angular2-hacker-news", plugins: [] }), 'GET');
workbox.routing.registerRoute("angular2-with-immutablejs-and-redux", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-angular2-with-immutablejs-and-redux", plugins: [] }), 'GET');
workbox.routing.registerRoute("continuous-integration-angular-firebase-travisci", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-continuous-integration-angular-firebase-travisci", plugins: [] }), 'GET');
workbox.routing.registerRoute("progressive-angular-applications", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-progressive-angular-applications", plugins: [] }), 'GET');
workbox.routing.registerRoute("progressive-angular-applications-2", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-progressive-angular-applications-2", plugins: [] }), 'GET');
workbox.routing.registerRoute("progressive-angular-applications-3", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-progressive-angular-applications-3", plugins: [] }), 'GET');
workbox.routing.registerRoute("looking-back-2017", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-looking-back-2017", plugins: [] }), 'GET');
workbox.routing.registerRoute("thinking-prpl", workbox.strategies.staleWhileRevalidate({ "cacheName":"post-thinking-prpl", plugins: [] }), 'GET');
