/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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

