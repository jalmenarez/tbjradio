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

var SpotifyWebApi = require('spotify-web-api-node');

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
     *    `/playlist/get_all`
     */
    get_all: function (req, res) {
        Playlist.find().exec(function (err, playlists) {
            if (!err) {
                return res.json({
                    status: 'OK',
                    playlists: playlists
                });
            } else {
                return res.json({
                    status: 'NOK'
                });
            }
        });
    },

    /**
     * Action blueprints:
     *    `/playlist/synchronize`
     */
    synchronize: function (req, res) {
        sails.log.info('/playlist/synchronize');
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        if (SpotifyService.validateTokens(req, webApi)) {
            if (req.session.spotifyUser && req.session.spotifyUser.id) {
                webApi.getUserPlaylists(req.session.spotifyUser.id)
                    .then(function (playlists) {
                        //TODO terminar de agregar la informacion de las playlists
                        var total = playlists.total;
                        var limit = playlists.limit;
                        var next = playlists.next;
                        var offset = playlists.offset;
                        var previous = playlists.previous;
                        var href = playlists.href;
                        //TODO solo agregar las playlists propias del usuario
                        Playlist.createOrUpdateAll(playlists.items, req.session.spotifyUser.id, function (err) {
                            if (err) {
                                return res.json({
                                    result: 'NOK',
                                    error: err
                                });
                            } else {
                                return res.json({
                                    result: 'OK'
                                });
                            }
                        });
                    }).catch(function (err) {
                        sails.log.error(err);
                        return res.json({
                            result: 'NOK',
                            message: err
                        });
                    });
            } else {
                sails.log.error('userSpotify.id is null');
                return res.json({
                    result: 'NOK',
                    message: 'userSpotify.id is null'
                });
            }
        } else {
            var error = 'INVALID_TOKENS';
            sails.log.error(error);
            return res.json({
                result: 'NOK',
                error: error
            });
        }
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PlaylistController)
     */
    _config: {}


};
