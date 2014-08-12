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

      album: {
        model: 'album'
      },

      artists: {
        collection: 'artist',
        via: 'tracks',
        dominant: true
      },

      includedIn: {
          collection: 'playlist',
          via: 'tracks'
      }

  }
};

