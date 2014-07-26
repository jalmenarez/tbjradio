/**
 * Spotify
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Spotify;
try {
	var SpotifyWebApi = require('spotify-web-api-node');
	Spotify = new SpotifyWebApi();
} catch (e) {
	console.error('Could not find dependency: `spotify-web-api-node`.');
    console.error('Your `.sailsrc` file(s) will be ignored.');
    console.error('To resolve this, run:');
    console.error('npm install spotify-web-api-node --save');
    Spotify = function () { return {}; };
}

module.exports = Spotify;