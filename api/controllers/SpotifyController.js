/**
 * SpotifyController
 *
 * @description :: Server-side logic for managing spotifies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');
var querystring = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
	


  /**
   * `SpotifyController.callback()`
   */
  callback: function (req, res) {
      sails.log.info('/spotify/callback');

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

                  sails.log.info('Se agrega al objeto session los tokens obtenidos');
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

                  sails.log.info('Se hace la peticion a Spotify para obtener el perfil del usuario logueado');
                  // use the access token to access the Spotify Web API
                  request.get(options, function (error, response, body) {
                      if (!error && body && body.type === 'user') {
                          sails.log.info('Se obtiene el perfil del usuario logueado');
                          SpotifyUser.createOrUpdate(body, function(err, spotifyUser){
                              if(err) {
                                  sails.log.error(err);
                              }else if(!spotifyUser) {
                                  sails.log.error("SpotifyUser.createOrUpdate void answer");
                              } else {
                                  sails.log.info('Se agrega a la session actual el spotifyUser logueado');
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
   * `SpotifyController.authorize()`
   */
  authorize: function (req, res) {
      sails.log.info('/spotify/authorize');
      var state = SpotifyService.generateRandomString(16);
      // Lista de scopes a los que se les va pedir al usuario.
      var scopes = ['playlist-read-private', 'user-read-private'];
      var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
      var authorizeURL = webApi.createAuthorizeURL(scopes, state);
      res.cookie(sails.config.spotify.stateKey, state);
      sails.log.debug("authorizeURL: "+authorizeURL);
      // Se hace un redirect a la url de autorizacion.
      res.redirect(authorizeURL);
  },


  /**
   * `SpotifyController.callback_result()`
   */
  callback_result: function (req, res) {
      sails.log.info('/spotify/callback_result');
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


  /**
   * `SpotifyController.get_user_playlists()`
   */
  get_user_playlists: function (req, res) {
    return res.json({
      todo: 'get_user_playlists() is not implemented yet!'
    });
  },


  /**
   * `SpotifyController.get_user_playlist()`
   */
  get_user_playlist: function (req, res) {
    return res.json({
      todo: 'get_user_playlist() is not implemented yet!'
    });
  }
};

