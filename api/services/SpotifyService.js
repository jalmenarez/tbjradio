
var SpotifyWebApi = require('spotify-web-api-node');

var config = global.Hook.config.adapters.spotify;

var webApi = new SpotifyWebApi({
					clientId : config.client_id,
					clientSecret : config.client_secret,
					redirectUri : config.redirect_uri
				});

module.exports = {

    config: config,

    webApi: webApi,

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    generateRandomString: function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

};

