const posts = [
  'asynchronous-javascript-callbacks',
  'event-and-style-binding-in-angular2',
  'angular2-hacker-news',
  'angular2-with-immutablejs-and-redux',
  'continuous-integration-angular-firebase-travisci',
  'progressive-angular-applications',
  'looking-back-2017',
  'thinking-prpl',
];

const runtimeCache = (pattern, cacheName) => ({
  urlPattern: pattern,
  handler: 'staleWhileRevalidate',
  options: {
    cacheName: cacheName,
  },
});

// probably a better way to dynamic cache posts. Use a subpath (like '/blog')? (if no SEO implications)
module.exports = {
  globDirectory: '_site',
  globPatterns: [],
  runtimeCaching: [
    runtimeCache(new RegExp(/^https:\/\/finallyits2.surge.sh\/$/), 'index'),
    runtimeCache(/assets/, 'image-assets'),
    ...posts.map(title => runtimeCache(title, `post-${title}`)),
  ],
  swDest: '_site/service-worker.js',
};
