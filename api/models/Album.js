/**
 * Album.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
		
	identity: 'album',	
	
	autoPK: false,
	
    attributes: {
    	
    	id: {
    		type: 'integer',
    		autoIncrement: true,
    		primaryKey: true
    	},

        spotifyId: {
            type: 'string',
            unique: true
        },

        name: 'string',

        // a reference to Track
        tracks: {
            collection: 'track',
            via: 'album'
        }
    }

};