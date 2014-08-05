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

var querystring = require('querystring');

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
        var redirect_url = sails.config.url_base + '/admin?';
        if (result != null && result == 'OK') {
            sails.log.debug('result: OK');
            if (req.session.spotifyUser)
                res.view({title: 'tbjradio :: dashboard', spotifyUser: req.session.spotifyUser});
            else {
                sails.log.debug('No hay un spotifyUser en la sesion');
                res.redirect(redirect_url +
                        querystring.stringify({
                            result: 'NO_SESSION'
                        })
                );
            }
        } else {
            sails.log.debug('El usuario no se ha logueado');
            res.redirect(redirect_url +
                    querystring.stringify({
                        result: 'NOT_LOGGED'
                    })
            );
        }
    },

    /**
     * Action blueprints:
     *    `/admin/logout`
     */
    logout: function (req, res) {
        sails.log.debug('/admin/logout');
        req.session = null;
        res.redirect('/admin');
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AdminController)
     */
    _config: {}


};
