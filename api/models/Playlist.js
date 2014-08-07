/**
 * Playlist
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var async = require('async');

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
  	sails.log.debug('Playlist :: createOrUpdateAll');
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
  		    sails.log.debug('All items have been processed successfully');
  		    cb();
  		}
  	});    	
  } 

};
