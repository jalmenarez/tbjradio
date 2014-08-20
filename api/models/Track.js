/**
 * Track.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        id: {
            type: 'string',
            primaryKey: true
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
            Track.findOne({ id: item.track.id }).exec(function (err, track) {
                if (!err && !track) {
                    // create
                    Track.create({
                        name: item.track.name,
                        id: item.track.id
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
                    Track.update({ id: item.track.id },
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
                sails.log.error("track: "+item.track);
                callback("track.id: "+item.track);
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

