
var SpotifyWebApi = require('spotify-web-api-node');

var config = global.Hook.config.adapters.spotify;

var webApi = new SpotifyWebApi({
					clientId : config.client_id,
					clientSecret : config.client_secret,
					redirectUri : config.redirect_uri
				});

module.exports = {

    config: config,

    authorizationCode: 'AQCyxqXT670lBy5gzs-TDAA2FVRd9Y1jt7OpovA1Mdy9rLNEZyagPDCmBQWTSCccCzRFDX8ZWjBW9VX4Eb9ylGL_6KLxbblFEIDcvrnQbKLci7cLYpdPjWTlQ2SSZtH61eRgVW7MDwzP3tRWPVR9d2_F1i32hv9yUUeu02tzIOr37Ue5X5DM95kuqpZRl6vUdMYgA9BjTHi2PBVRbleS-fTZHa_opZYqwvrysmXi0mxO9QeguHU9nfec-mOIJ3ip',

    authOptions: {
		  url: 'https://accounts.spotify.com/api/token',
		  headers: {
		    'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
		  },
		  form: {
		    grant_type: 'client_credentials'
		  },
		  json: true
    },
    
    clientCredentialsGrant: function(){
        sails.log.debug('clientCredentialsGrant()');
        sails.log.debug(this.authOptions);
        return webApi.clientCredentialsGrant(this.authOptions);
    },

    authorizationCodeGrant: function(){
        sails.log.debug('authorizationCodeGrant()');
        return webApi.authorizationCodeGrant(this.authorizationCode);
    },

    createAuthorizeURL: function(scopes, state){
        sails.log.debug('createAuthorizeURL()');
        return webApi.createAuthorizeURL(scopes, state);
    },

    getUserPlaylists: function() {
        sails.log.debug('getUserPlaylists()');
        return webApi.getUserPlaylists(config.username);
    },

    setAccessToken: function(access_token) {
        sails.log.debug('setAccessToken('+access_token+')');
        webApi.setAccessToken(access_token);
    },
    
   

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

