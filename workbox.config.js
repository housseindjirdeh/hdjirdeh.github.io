module.exports = {
  globDirectory: '_site',
  globPatterns: ['**/*.{js,svg,html}'],
  runtimeCaching: [{
    urlPattern: /assets/,
    handler: 'staleWhileRevalidate',
    options: {
      cacheName: 'image-assets',
    },
  }],
  swDest: '_site/service-worker.js',
  globIgnores: ['**/service-worker.js']
};