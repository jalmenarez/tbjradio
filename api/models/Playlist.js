/**
 * Playlist
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

<<<<<<< HEAD
=======
var async = require('async');

>>>>>>> ea379a853466b0fbc99eedbd39a15a03d034a2dc
module.exports = {

  attributes: {

  	id: {
         type: 'string',
         primaryKey: true
    },

    name: 'string',
    description: 'string',
    external_urls: 'json',
    images: 'json',
    owner: 'json',
    uri: 'string',
    href: 'string',
    
    // Add a reference to SpotifyUser
    spotifyUserId: {
          type: 'string'
    }      

  },

  createOrUpdateAll: function(items, cb){
<<<<<<< HEAD
  	sails.log.info('Playlist :: createOrUpdateAll');
=======
  	sails.log.debug('Playlist :: createOrUpdateAll');
>>>>>>> ea379a853466b0fbc99eedbd39a15a03d034a2dc
  	async.each(items, function( item, callback) {
  		Playlist.findOne({ id: item.id }).exec(function (err, playlist) {
  			if (!err && !playlist) {
  				// create
  				Playlist.create({
  					name: item.name,
  					id: item.id
  				}).exec(function (err, playlist) {
  					if (!err) {
  						sails.log.info('created playlist: '+JSON.stringify(playlist));
  						callback();
  					} else {
  						sails.log.error('error creating playlist', err);
  						callback(err);
  					}
  				});
  			} else if (!err) {
  				// update
  				Playlist.update({ id: item.id },
  						{
  						 name: item.name
  						}).exec(function (err, playlist) {
  							if (!err) {
  								sails.log.info('updated playlist: '+JSON.stringify(playlist));
  								callback();
  							} else {
  								sails.log.error('error updating playlist', err);
  								callback(err);
  							}
  						});
  			} else {
  				sails.log.error(err);
  				callback(err);
  			}
  		}); 		
  	}, function(err){
  		if(err) {
  			sails.log.error('An item failed to process');
  		} else {
<<<<<<< HEAD
  		    sails.log.info('All items have been processed successfully');
=======
  		    sails.log.debug('All items have been processed successfully');
>>>>>>> ea379a853466b0fbc99eedbd39a15a03d034a2dc
  		    cb();
  		}
  	});    	
  } 

};
