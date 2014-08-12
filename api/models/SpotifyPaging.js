/**
 * SpotifyPaging
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: { 	
	  href: 'string',
	  limit: 'integer',
	  next:  'string',
	  offset: 'integer',
	  previous: 'string',
	  total: 'integer',  
	  items: 'json',
	  spotifyPlaylistId: 'string'
  }

};
