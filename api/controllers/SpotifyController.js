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
    if(code != null){
        sails.log.debug('Spotify code: '+code);
        SpotifyService.code = code;
    }

    var state = req.query.state || null;
    if(state != null){
        sails.log.debug('Spotify state: '+state);
    }

    var stateKey = SpotifyService.config.stateKey;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/spotify/callback_result/?' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);

      res.redirect('/main/index/?' + querystring.stringify({
          code: code
        })
      );
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
      var authorizeURL = SpotifyService.createAuthorizeURL(SpotifyService.config.scopes, state);
      sails.log.debug('authorizeURL: '+authorizeURL);
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

      sails.log.debug('req.query: '+req.query);

      //TODO informar al usuario que hubo un error cuando venga en la url (?error=state_mismatch).

      // Send a JSON response
      return res.json({
          hello: 'world'
      });
  },

 /** Action blueprints:
   *   `/spotify/ajax_get_user_play_lists`
   */
    ajax_get_user_play_lists: function (req, res){
     SpotifyService.authorizationCodeGrant()
         .then(function(data){
            sails.log.debug('The access token expires in ' + data['expires_in']);
            sails.log.debug('The access token is ' + data['access_token']);
            SpotifyService.setAccessToken(data['access_token']);
            return data['access_token'];
         })
         .then(function(access_token){
            SpotifyService.getUserPlaylists().then(function(list){
                     return res.json({
                         result: 'ok',
                         data: list
                     });
                 },
                 function(fail){
                     return res.json({
                         result: 'nok',
                         error: fail
                     });
                 });
         }).catch(function(error) {
             sails.log.error(error);
         });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SpotifyController)
   */
  _config: {}

  
};
