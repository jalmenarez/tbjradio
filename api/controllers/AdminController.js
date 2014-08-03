/**
 * AdminController
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

var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {


    /**
     * Action blueprints:
     *    `/admin/login`
     */
    login: function (req, res) {
        sails.log.debug('/admin/login');
        if (req.query.type == 'spotify') {
            res.redirect(sails.config.url_base + '/spotify/authorize');
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
        sails.log.debug('/admin/index');
        return res.view({
            title: 'tbjradio'
        });
    },

    /**
     * Action blueprints:
     *    `/admin/dashboard`
     */
    dashboard: function (req, res) {
        sails.log.debug('/admin/dashboard');
        var result = req.query.result || null;
        if (result != null && result == 'OK') {
            sails.log.debug('spotifyUser');
            sails.log.debug(req.session.spotifyUser);
            if (req.session.spotifyUser)
                res.view({title: 'tbjradio :: dashboard', spotifyUser: req.session.spotifyUser});
            else {
                res.view({title: 'tbjradio :: dashboard'});
            }
        } else {
            sails.log.error('Something went wrong');
            res.view({title: 'tbjradio :: dashboard'});
        }
    },

    /**
     * Action blueprints:
     *    `/admin/logout`
     */
    logout: function (req, res) {
        sails.log.debug('/admin/logout');
        res.clearCookie(sails.config.spotify.access_token_key);
        res.clearCookie(sails.config.spotify.refresh_token_key);
        res.clearCookie(sails.config.spotify.code_key);
        res.clearCookie(sails.config.spotify.code_key);
        res.clearCookie(sails.config.spotify.user_id_key);
        res.redirect('/admin');
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AdminController)
     */
    _config: {}


};
