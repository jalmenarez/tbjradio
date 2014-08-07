/**
 * SpotifyController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var request = require('request');
var querystring = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {


    /**
     * Action blueprints:
     *    `/spotify/callback`
     */
    callback: function (req, res) {

        sails.log.debug('/spotify/callback');

        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);

        var code = req.query.code || null;
        var state = req.query.state || null;
        var stateKey = sails.config.spotify.stateKey;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        var redirect_url = sails.config.url_base + '/spotify/callback_result?';

        if (state === null || state !== storedState) {
            res.redirect(redirect_url +
                    querystring.stringify({
                        error: 'state_mismatch'
                    })
            );
        } else {
            res.clearCookie(stateKey);

            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: sails.config.spotify.credentials.redirectUri,
                    grant_type: 'authorization_code',
                    client_id: sails.config.spotify.credentials.clientId,
                    client_secret: sails.config.spotify.credentials.clientSecret
                },
                json: true
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token;
                    var refresh_token = body.refresh_token;

                    sails.log.debug('Se agrega al objeto session los tokens obtenidos');
                    // Save the amount of seconds until the access token expired
                    req.session.tokenExpirationEpoch = (new Date().getTime() / 1000) + body.expires_in;
                    req.session.access_token = access_token;
                    req.session.refresh_token = refresh_token;
                    req.session.code = code;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {
                        if (!error && body && body.type === 'user') {                          
                            SpotifyUser.createOrUpdate(body, function(err, spotifyUser){
                            	if(err) {
                            		sails.log.error(err);
                            	}else if(!spotifyUser) {
                            		sails.log.error("SpotifyUser.createOrUpdate void answer");
                            	} else {                           		                               	
                               		req.session.spotifyUser = spotifyUser;                            			                                	                   		                            		
                            	}
                            	res.redirect(redirect_url);
                            });
                        }
                    });
                } else {
                    res.redirect(redirect_url +
                            querystring.stringify({
                                error: 'invalid_token'
                            })
                    );
                }
            });
        }
    },

    /**
     * Action blueprints:
     *    `/spotify/refresh_token`
     */
    refresh_token: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    /**
     * Action blueprints:
     *    `/spotify/authorize`
     */
    authorize: function (req, res) {
        sails.log.debug('/spotify/authorize');
        var state = SpotifyService.generateRandomString(16);
        // Lista de scopes a los que se les va pedir al usuario.
        var scopes = ['playlist-read-private', 'user-read-private'];
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        var authorizeURL = webApi.createAuthorizeURL(scopes, state);
        res.cookie(sails.config.spotify.stateKey, state);
        // Se hace un redirect a la url de autorizacion.
        res.redirect(authorizeURL);
    },

    /**
     * Action blueprints:
     *    `/spotify/get_authorize_url`
     */
    get_authorize_url: function (req, res) {
        sails.log.debug('/spotify/authorize');
        var state = SpotifyService.generateRandomString(16);
        // Lista de scopes a los que se les va pedir al usuario.
        var scopes = ['playlist-read-private', 'user-read-private'];
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        var authorizeURL = webApi.createAuthorizeURL(scopes, state);
        if (authorizeURL != null) {
            sails.log.debug('authorizeURL: ' + authorizeURL);
            res.cookie(sails.config.spotify.stateKey, state);
            return res.json({
                result: 'OK',
                authorize_url: authorizeURL
            });
        } else {
            return res.json({
                result: 'NOK',
                message: 'No fu\u00e9 posible obtener la url para autenticarse en Spotify'
            });
        }
    },

    /**
     * Action blueprints:
     *   `/spotify/callback_result`
     */
    callback_result: function (req, res) {
        sails.log.debug('/spotify/callback_result');
        var redirect_url = null;
        var error = req.query.error || null;

        if (error == null) {             	
        	if(req.session.spotifyUser){
        		req.session.authenticated = true;
        		redirect_url = sails.config.url_base + '/admin/dashboard?';
                res.redirect(redirect_url +
                        querystring.stringify({
                            result: 'OK'
                        })
                );
        	} else {
        		req.session.authenticated = false;
        		redirect_url = sails.config.url_base + '/admin?';
        		error = 'No se ha autenticado';
        		sails.log.error(error);
        		res.redirect(redirect_url +
        				querystring.stringify({
        					result: 'NO_SESSION'
        				})
        		);
        	}       	
        } else {
            redirect_url = sails.config.url_base + '/admin?';
            sails.log.error(error);
            res.redirect(redirect_url +
                    querystring.stringify({
                        result: 'NOT_LOGGED'
                    })
            );
        }
    },

    /** Action blueprints:
     *   `/spotify/get_user_play_lists`
     */
    get_user_playlists: function (req, res) {
        sails.log.debug('/spotify/get_user_playlists');
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        if (SpotifyService.validateTokens(req, webApi)) {
            if (req.session.spotifyUser && req.session.spotifyUser.id) {
                webApi.getUserPlaylists(req.session.spotifyUser.id)
                    .then(function (playlists) {
                        return res.json({
                            result: 'OK',
                            playlists: playlists
                        });
                    }).catch(function (err) {
                        sails.log.error(err);
                        return res.json({
                            result: 'NOK',
                            message: err
                        });
                    });
            } else {
                sails.log.error('userSpotify.id is null');
                return res.json({
                    result: 'NOK',
                    message: 'userSpotify.id is null'
                });
            }
        } else {
            var error = 'INVALID_TOKENS';
            sails.log.error(error);
            return res.json({
                result: 'NOK',
                error: error
            });
        }
    },

    /**
     * Action blueprints:
     *    `/spotify/get_user_playlist`
     */
    get_user_playlist: function (req, res) {
        sails.log.debug('/spotify/get_user_playlist');
        var playlist_id = req.query.playlist_id;
        sails.log.debug('playlist_id: ' + playlist_id);
        var playlist_owner_id = req.query.playlist_owner_id;
        sails.log.debug('playlist_owner_id: ' + playlist_owner_id);
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        //TODO agregar validacion adicional para verificar que venga los campos necesario para hacer la peticion.
        if (SpotifyService.validateTokens(req, webApi)) {
            webApi.getPlaylist(playlist_owner_id, playlist_id).then(function (playlist) {
                return res.json({
                    result: 'OK',
                    playlist: playlist
                });
            }).catch(function (err) {
                sails.log.error(err);
                return res.json({
                    result: 'NOK',
                    error: err
                });
            });
        } else {
            var error = 'INVALID_TOKENS';
            sails.log.error(error);
            return res.json({
                result: 'NOK',
                error: error
            });
        }
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SpotifyController)
     */
    _config: {}

};