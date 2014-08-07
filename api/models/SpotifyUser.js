/**
 * SpotifyUser
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

      display_name: 'string',
      email: 'string',
      product: 'string',
      country: 'string',
      href: 'string',
      uri: 'string',

      // a reference to User
      userId: {
          type: 'integer'
      },

      images: {
          type: 'json'
      },

      external_urls: {
          type: 'json'
      }

  },
  
  createOrUpdate: function(options, cb){
	  sails.log.debug('SpotifyUser :: createOrUpdate');
	  //find spotifyUser
	  SpotifyUser.findOne(options.id).exec(function (err, spotifyUser) {
		  if (err) {
			  return cb(err);
		  } else if(!spotifyUser){
			  // create spotifyUser
			  sails.log.debug("create spotifyUser");
			  SpotifyUser.create({
                  id: options.id,
                  display_name: options.display_name,
                  email: options.email,
                  product: options.product,
                  country: options.country,
                  external_urls: options.external_urls,
                  images: options.images,
                  href: options.href,
                  uri: options.uri
              }).exec(function (err, spotifyUser) {
            	  if (err){ 
            		  return cb(err);
            	  } else if (!spotifyUser) { 
            		  return cb(new Error('spotifyUser not created.'));
            	  } else {
            		  sails.log.debug('created spotifyUser');            		  
            		  User.createOrUpdate(spotifyUser, function(err, user){
                   		  if (err){
                   			  sails.log.error(err);
                   		  } else if (!user) {
                   			  sails.log.error("User.createOrUpdate void answer");
                   		  } else {
                   			sails.log.debug("updated spotifyUser");
                   		    spotifyUser.userId = user.id;                       			  
                   		  } 
                   		  spotifyUser.save(cb);    
                   	  });
            	  }          	  
              });
		  } else {
			  // update spotifyUser
			  sails.log.debug("update spotifyUser");
			  spotifyUser.display_name = options.display_name;
			  spotifyUser.email = options.email;
			  spotifyUser.images = options.images;
			  spotifyUser.product = options.product;
			  spotifyUser.external_urls = options.external_urls;
			  spotifyUser.href = options.href;
			  spotifyUser.uri = options.uri;
			  spotifyUser.country = options.country;
			  User.createOrUpdate(spotifyUser, function(err, user){
           		  if (err){
           			  sails.log.error(err);
           		  } else if (!user) {
           			  sails.log.error("User.createOrUpdate void answer");
           		  } else {
           			sails.log.debug("updated spotifyUser");
           		    spotifyUser.userId = user.id;                       			  
           		  } 
           		  spotifyUser.save(cb);    
           	  });  			   
		  }
	  });
  }

};
