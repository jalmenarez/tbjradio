/**
 * AlbumController
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
     *   `/album/create`
     *   POST `/album
     */
    create: function (req, res) {
        var status = null;
        var message = null;

        if (req.body) {
            if (req.body.name) {
                //TODO completar metodo para crear un album en el sistema.
                status = 'NOK';
                message = 'Todavia no se ha terminado de impletar el metodo';
            } else {
                status = 'NOK';
                message = 'Se espera en el json que venga con el nombre del album para asi poder crear el album';
            }
        } else {
            status = 'NOK';
            message = 'Se espera un json con la informacion para crear el album';
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
     *    `/album/edit`
     */
    edit: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/album/destroy/:id?`
     */
    destroy: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/album/all`
     */
    all: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AlbumController)
     */
    _config: {}


};
