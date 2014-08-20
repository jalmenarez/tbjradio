/**
 * TrackController
 *
 * @description :: Server-side logic for managing tracks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {

    /**
     * `TrackController.synchronize()`
     */
    synchronize: function (req, res) {
        sails.log.info('/tracks/synchronize');
        var playlist_id = req.query.playlist_id;
        sails.log.debug('playlist_id: ' + playlist_id);
        var playlist_owner_id = req.query.playlist_owner_id;
        sails.log.debug('playlist_owner_id: ' + playlist_owner_id);
        var page = req.query.page ? req.query.page : 1;
        sails.log.debug('page: ' + playlist_owner_id);
        var limit = 100;
        var offset = ((page - 1) * limit);
        var total = 0;
        var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
        if (SpotifyService.validateTokens(req, webApi)) {
            if (req.session.spotifyUser && req.session.spotifyUser.id) {
                var options = {
                    offset: offset,
                    limit: limit
                };
                webApi.getPlaylistTracks(playlist_owner_id, playlist_id, options)
                    .then(function (response) {
                        total = response.total;
                        sails.log.debug('total: ' + total);
                        offset = response.offset;
                        sails.log.debug('offset: ' + offset);
                        var pages = Math.round((total / limit) + 1);
                        Track.createOrUpdateAll(response.items, function (err) {
                            if (err) {
                                return res.json({
                                    result: 'NOK',
                                    error: err
                                });
                            } else {
                                return res.json({
                                    result: 'OK',
                                    page: parseInt(page),
                                    pages: pages
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

    get: function(req, res){
        sails.log.info('/tracks/get');
        var page = req.query.page ? req.query.page : 1;
        sails.log.debug('page: ' + playlist_owner_id);
        var limit = 100;
        var skip = ((page - 1) * limit);

        Track.find({skip: skip, limit: limit }, function(err, tracks) {
            if(err) return res.json({ status: 'NOK', error: err });
            return res.json({status: 'OK', data: tracks});
        });
    }

};