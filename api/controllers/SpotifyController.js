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

module.exports = {


    /**
     * Action blueprints:
     *    `/spotify/callback`
     */
    callback: function (req, res) {

        sails.log.debug('/spotify/callback');

        var code = req.query.code || null;
        if (code != null) {
            sails.log.debug('code: ' + code);
        }

        var state = req.query.state || null;
        if (state != null) {
            sails.log.debug('state: ' + state);
        }

        var stateKey = SpotifyService.config.stateKey;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        var redirect_url = '/spotify/callback_result/?';

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
                    redirect_uri: SpotifyService.config.redirect_uri,
                    grant_type: 'authorization_code',
                    client_id: SpotifyService.config.client_id,
                    client_secret: SpotifyService.config.client_secret
                },
                json: true
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token;
                    var refresh_token = body.refresh_token;

                    SpotifyService.webApi.setAccessToken(access_token);
                    SpotifyService.webApi.setRefreshToken(refresh_token);

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {
                        sails.log.debug(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect(redirect_url +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            code: code
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
        var authorizeURL = SpotifyService.webApi.createAuthorizeURL(scopes, state);
        sails.log.debug('authorizeURL: ' + authorizeURL);
        res.cookie(SpotifyService.config.stateKey, state);
        // Se hace un redirect a la url de autorizacion.
        res.redirect(authorizeURL);
    },

    /**
     * Action blueprints:
     *   `/spotify/callback_result`
     */
    callback_result: function (req, res){
        sails.log.debug('/spotify/callback_result');
        var redirect_url = '/admin/dashboard/?';     
        var access_token = req.query.access_token || null;
        var refresh_token = req.query.refresh_token || null;
        var code = req.query.code || null;
        var error = req.query.error || null;

        if (access_token != null && refresh_token != null && code != null) {
            SpotifyService.webApi.setAccessToken(access_token);
            SpotifyService.webApi.setRefreshToken(refresh_token);
            //TODO almacenar code en session.
            res.redirect(redirect_url + 
               querystring.stringify({
            	   result: 'OK',
            	   access_token: access_token,
            	   refresh_token: refresh_token
               })
            );
        } else {
        	redirect_url = 'admin/index';
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
        SpotifyService.webApi.getMe().then(function (data) {
            return  SpotifyService.webApi.getUserPlaylists(data.id.toLowerCase());
        }).then(function (playlists) {
            sails.log.debug(playlists);
            return res.json({
                result: 'ok',
                playlists: playlists
            });
        }).catch(function (err) {
            sails.log.error('Something went wrong!', err);
            return res.json({
                result: 'nok',
                message: err
            });
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SpotifyController)
     */
    _config: {}


};
