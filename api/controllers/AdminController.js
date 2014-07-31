/**
 * AdminController
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

var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/admin/login`
   */
   login: function (req, res) {
	if(req.query.type == 'spotify') {
		 res.redirect('/spotify/authorize');
	} else {
		 //TODO otro tipo de login.
	}
  },


  /**
   * Action blueprints:
   *    `/admin/index`
   *    `/admin`
   */
   index: function (req, res) {
    return res.view({
    	title: 'tbjradio'
    });
  },
  
  /**
   * Action blueprints:
   *    `/admin/dashboard`
   */
   dashboard: function (req, res) {
	   var result = req.query.result || null;
	   if(result != null && result == 'OK'){
		   var code = req.query.code || null;			   
		   var access_token = req.query.access_token;
		   var refresh_token = req.query.refresh_token;
		   if(code != null){				   
			  var webApi = new SpotifyWebApi({
		        	clientId : sails.config.spotify.client_id,
		        	clientSecret : sails.config.spotify.client_secret,
		        	redirectUri : sails.config.spotify.redirect_uri
		       });
			   webApi.setAccessToken(access_token);
			   webApi.setRefreshToken(refresh_token);
			   webApi.getMe()
			   .then(function(profile) {
				   res.view({title: 'tbjradio :: dashboard', profile: profile});
			   })
			   .catch(function(err) {
				   sails.log.error('Something went wrong', err);
				   res.view({title: 'tbjradio :: dashboard'});
			   });
		   }		   
	   }
  },
  
  /**
   * Action blueprints:
   *    `/admin/logout`
   */
   logout: function (req, res) {
	   //TODO limpiar la session y todo lo necesario para que se haga el logout.
	   res.redirect('/admin');
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AdminController)
   */
  _config: {}

  
};
