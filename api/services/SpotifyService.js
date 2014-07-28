
var SpotifyWebApi = require('spotify-web-api-node');

var config = global.Hook.config.adapters.spotify;

var webApi = new SpotifyWebApi({
					clientId : config.client_id,
					clientSecret : config.client_secret,
					redirectUri : config.redirect_uri
				});

module.exports = {

    config: config,

    code: 'AQDhA19vNZfYJoTu9cMLbvbIpeVrHyKzjmSc6_EGhvZMWwkGdGftaK-qusvIKQPoAMx_ao1334kGMb3E6whkuuegutRnKdDfhHlnB6lpSCZ3QifrudB2nUb8k58nMq1aXPRknPTeSASAAqhSENSSAguXE-3FEK4uIbDNbl0tTu1W9adOfLiSIr6Nr69x91PCVh41YgEiOjJ1D9zcmqqrECXCpcb4WxIk2ij6nHt2cwti2haY5FruPKZjaohoRnbkcA',

    clientCredentialsGrant: function(){
        sails.log.debug('clientCredentialsGrant()');
        return webApi.clientCredentialsGrant();
    },

    authorizationCodeGrant: function(){
        sails.log.debug('authorizationCodeGrant()');
        return webApi.authorizationCodeGrant(this.code);
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

