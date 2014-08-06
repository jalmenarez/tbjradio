/**
 * PlaylistController
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

module.exports = {


    /**
     * Action blueprints:
     *    `/playlist/create`
     */
    create: function (req, res) {
        var status = null;
        var message = null;

        if (req.body) {
            if (req.body.name) {
                //TODO completar metodo para crear una playlist en el sistema.
                status = 'NOK';
                message = 'Todavia no se ha terminado de impletar el metodo';
            } else {
                status = 'NOK';
                message = 'Se espera en el json que venga con el nombre de la playlist para asi poder crear la playlist';
            }
        } else {
            status = 'NOK';
            message = 'Se espera un json con la informacion para poder crear la playlist';
        }

        var result = {
            status: status,
            message: message
        };

        sails.log.debug(result);

        // Send a JSON response
        return res.json(result);
    },


    /**
     * Action blueprints:
     *    `/playlist/edit`
     */
    edit: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/playlist/delete`
     */
    delete: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },

    /**
     * Action blueprints:
     *    `/playlist/get_all`
     */
    get_all: function (req, res) {
        SpotifyPlaylist.find().exec(function(err, playlists){
            if(!err){
                return res.json({
                    status: 'OK',
                    playlists: playlists
                });
            }else {
                return res.json({
                    status: 'NOK'
                });
            }
        });
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PlaylistController)
     */
    _config: {}


};
