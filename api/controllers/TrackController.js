/**
 * TrackController
 *
 * @description :: Server-side logic for managing tracks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {

	/**
	 * Action blueprints:
	 *    `/track/synchronize_playlist_tracks`
	 */
	synchronize_playlist_tracks: function(req, res) {
		sails.log.debug('/playlist/synchronize');
		var webApi = new SpotifyWebApi(sails.config.spotify.credentials);
		if (SpotifyService.validateTokens(req, webApi)) {
			if (req.session.spotifyUser && req.session.spotifyUser.id) {
				var playlistId = req.query.playlistId || null;
				if(playlistId != null) {
					webApi.getPlaylistTracks(req.session.spotifyUser.id, playlistId).then(function (response) {
						return res.json({
                            result: 'OK',
                            response: response 
                        });
					}).catch(function (err) {
                        sails.log.error(err);
                        return res.json({
                            result: 'NOK',
                            message: err
                        });
                    });
				} else {
					sails.log.error('playlistId is null');
	                return res.json({
	                    result: 'NOK',
	                    message: 'playlistId is null'
	                });
				}				
			} else {
                sails.log.debug('userSpotify.id is null');
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
	}

};