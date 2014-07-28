
var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {

	spotify: {},

	init: function (config, cb) {
		this.spotify['web'] = {
			api: new SpotifyWebApi({
						clientId : config.client_id,
						clientSecret : config.client_secret,
						redirectUri : config.redirect_uri
			})
		};
		cb();
	}
	
};	