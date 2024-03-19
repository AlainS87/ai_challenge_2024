// Set up our own proxy using the http-proxy-middleware package.
// This code is adapted from the Spotify Web Playback SDK example available at:
// https://github.com/spotify/spotify-web-playback-sdk-example
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/auth/**',
        createProxyMiddleware({
            target: 'http://localhost:5003'
        })
    );
};