/**
 * Track.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        spotifyId: {
            type: 'string'
        },

        name: 'string',

        // a reference to Album
        album: {
            model: 'album'
        },

        // a reference to Artist
        artists: {
            collection: 'artist',
            via: 'tracks',
            dominant: true
        },

        // a reference to Playlist
        includedIn: {
            collection: 'playlist',
            via: 'tracks'
        }

    },

    createOrUpdateAll: function (items, cb) {
        sails.log.info('Track :: createOrUpdateAll');
        async.each(items, function (item, callback) {
            //TODO registrar mas informacion
            if(item.track != null && item.track.id != null && item.track.id.length > 0){
            Track.findOne({ spotifyId: item.track.id }).exec(function (err, track) {
                if (!err && !track) {
                    // create
                    //TODO createOrUpdate Album
                    Track.create({
                        name: item.track.name,
                        spotifyId: item.track.id
                    }).exec(function (err, track) {
                        if (!err) {                            
                            callback();
                        } else {
                            sails.log.error('error creating track', err);
                            callback(err);
                        }
                    });
                } else if (!err) {
                    // update
                    //TODO createOrUpdate Album
                    Track.update({ spotifyId: item.track.id },
                        {
                            name: item.track.name
                        }).exec(function (err, track) {
                            if (!err) {
                                callback();
                            } else {
                                sails.log.error('error updating track', err);
                                callback(err);
                            }
                        });
                } else {
                    sails.log.error(err);
                    callback(err);
                }
            });
            } else {
                // No se procesan por el momento lo que no tenga id.
                sails.log.debug('track: '+JSON.stringify(item.track));
                callback();
            }
        }, function (err) {
            if (err) {
                sails.log.error('An item failed to process', err);
            } else {
                sails.log.info('All items have been processed successfully');
                cb();                
            }
        });

    }

};

