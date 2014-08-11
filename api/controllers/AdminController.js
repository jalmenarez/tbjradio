/**
 * AdminController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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
     * `AdminController.login()`
     */
    login: function (req, res) {
        sails.log.info('/admin/login');
        if (req.query.type == 'spotify') {
            res.redirect(sails.config.url_base + '/spotify/authorize');
        } else {
            //TODO otro tipo de login.
        }
    },

    /**
     * `AdminController.index()`
     */
    index: function (req, res) {
        sails.log.info('/admin/index');
        return res.view('admin/index',{
            title: 'tbjradio'
        });
    },

    /**
     * `AdminController.dashboard()`
     */
    dashboard: function (req, res) {
        sails.log.info('/admin/dashboard');
        var result = req.query.result || null;
        var redirect_url = sails.config.url_base + '/admin?';
        if (result != null && result == 'OK') {
            if (req.session.spotifyUser)
                res.view('admin/dashboard', {title: 'tbjradio :: dashboard', spotifyUser: req.session.spotifyUser});      
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
     * `AdminController.logout()`
     */
    logout: function (req, res) {
        sails.log.info('/admin/logout');
        //TODO eliminar el registro de session en la base de datos
        req.session = null;
        res.redirect('/admin');
    }

};
