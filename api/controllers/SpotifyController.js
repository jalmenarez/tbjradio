/**
 * SpotifyController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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
        
        var webApi = new SpotifyWebApi({
        	clientId : sails.config.spotify.client_id,
        	clientSecret : sails.config.spotify.client_secret,
        	redirectUri : sails.config.spotify.redirect_uri
        });

        var code = req.query.code || null;
        if (code != null) {
            sails.log.debug('code: ' + code);
        }

        var state = req.query.state || null;
        if (state != null) {
            sails.log.debug('state: ' + state);
        }

        var stateKey = sails.config.spotify.stateKey;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        var redirect_url = sails.config.url_base + '/spotify/callback_result/?';

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
                    redirect_uri: sails.config.spotify.redirect_uri,
                    grant_type: 'authorization_code',
                    client_id: sails.config.spotify.client_id,
                    client_secret: sails.config.spotify.client_secret
                },
                json: true
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token;
                    var refresh_token = body.refresh_token;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    var user_id = null;
                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {
                    	user_id = body.id.toLowerCase();
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect(redirect_url +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            code: code,
                            user_id: user_id
                        }));
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
     *    `/spotify/login`
     */
    login: function (req, res) {

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
        var webApi = new SpotifyWebApi({
        	clientId : sails.config.spotify.client_id,
        	clientSecret : sails.config.spotify.client_secret,
        	redirectUri : sails.config.spotify.redirect_uri
        });
        var authorizeURL = webApi.createAuthorizeURL(scopes, state);
        sails.log.debug('authorizeURL: ' + authorizeURL);
        res.cookie(sails.config.spotify.stateKey, state);
        // Se hace un redirect a la url de autorizacion.
        res.redirect(authorizeURL);
    },

    /**
     * Action blueprints:
     *   `/spotify/callback_result`
     */
    callback_result: function (req, res){
        sails.log.debug('/spotify/callback_result');
        var redirect_url = sails.config.url_base + '/admin/dashboard/?';
        var access_token = req.query.access_token || null;
        var refresh_token = req.query.refresh_token || null;
        var user_id = req.query.user_id || null;
        var code = req.query.code || null;
        var error = req.query.error || null;

        if (access_token != null && refresh_token != null && code != null) {
        	res.cookie(sails.config.spotify.access_token_key, access_token);
        	res.cookie(sails.config.spotify.refresh_token_key, refresh_token);
            res.cookie(sails.config.spotify.user_id_key, user_id);
            res.cookie(sails.config.spotify.code_key, code);
            res.redirect(redirect_url + 
               querystring.stringify({
                   result: 'OK'
               })
            );
        } else {
            redirect_url = sails.config.url_base + '/admin/?';
            res.redirect(redirect_url + 
                querystring.stringify({
                	result: 'NOK',
                	error: error,
                	message: 'No fu\u00e9 posible autenticarse en Spotify'
                })
            );
        }
    },

    /** Action blueprints:
     *   `/spotify/get_user_play_lists`
     */
    get_user_play_lists: function (req, res) {
        sails.log.debug('/spotify/get_user_play_lists');
        var webApi = new SpotifyWebApi({
        	clientId : sails.config.spotify.client_id,
        	clientSecret : sails.config.spotify.client_secret,
        	redirectUri : sails.config.spotify.redirect_uri
        });
    	
    	var storedAccessToken = req.cookies ? req.cookies[sails.config.spotify.access_token_key] : null;
        sails.log.debug('access_token: ' + storedAccessToken);
    	webApi.setAccessToken(storedAccessToken);
    	var storedRefreshToken = req.cookies ? req.cookies[sails.config.spotify.refresh_token_key] : null;
    	webApi.setRefreshToken(storedRefreshToken);
        sails.log.debug('refresh_token: ' + storedRefreshToken);
        if (storedAccessToken != null) {
            webApi.getMe().then(function (data) {
                res.cookie(sails.config.spotify.user_id_key, data.id.toLowerCase());
                return  webApi.getUserPlaylists(data.id.toLowerCase());
            }).then(function (playlists) {
                sails.log.debug(playlists);
                return res.json({
                    result: 'OK',
                    playlists: playlists
                });
            }).catch(function (err) {
                sails.log.error('Something went wrong!', err);
                return res.json({
                    result: 'NOK',
                    message: err
                });
            });
        } else {
            sails.log.error('access_token is null');
            return res.json({
                result: 'NOK',
                message: 'access_token is null'
            });
        }
    },
    
    /**
     * Action blueprints:
     *    `/spotify/get_user_play_list`
     */
    get_user_play_list: function (req, res) {
        sails.log.debug('/spotify/get_user_play_list');
        var playlist_id = req.query.playlist_id;
        sails.log.debug('playlist_id: ' + playlist_id);
        var playlist_owner_id = req.query.playlist_owner_id;
        sails.log.debug('playlist_owner_id: ' + playlist_owner_id);
    	var webApi = new SpotifyWebApi({
        	clientId : sails.config.spotify.client_id,
        	clientSecret : sails.config.spotify.client_secret,
        	redirectUri : sails.config.spotify.redirect_uri
        });
    	var storedAccessToken = req.cookies ? req.cookies[sails.config.spotify.access_token_key] : null;
    	webApi.setAccessToken(storedAccessToken);
    	var storedRefreshToken = req.cookies ? req.cookies[sails.config.spotify.refresh_token_key] : null;
    	webApi.setRefreshToken(storedRefreshToken);
        webApi.getPlaylist(playlist_owner_id, playlist_id).then(function (playlist) {
            return res.json({
                result: 'OK',
                playlist: playlist
            });
        }).catch(function (err) {
            return res.json({
                result: 'NOK',
                error: err
            });
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SpotifyController)
     */
    _config: {}


};
