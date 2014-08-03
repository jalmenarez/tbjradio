/**
 * Playlist
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

  	id: {
         type: 'string',
         primaryKey: true
    },

    name: 'string',

    // Add a reference to SpotifyUser
    spotifyUserId: {
          type: 'string'
    }

  }

};
