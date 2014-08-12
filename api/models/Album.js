/**
 * Album.js
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

        tracks: {
            collection: 'track',
            via: 'album'
        }
    }

};