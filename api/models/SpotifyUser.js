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

      // Add a reference to User
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
	  
	  this.findOne(options.id).exec(function (err, spotifyUser) {
		  if (err) return cb(err);
		  if(!spotifyUser){
			  // create spotifyUser
			  this.create({
                  id: options.id,
                  display_name: options.display_name,
                  email: options.email,
                  product: options.product,
                  country: options.country
              }).exec(function (err, spotifyUser) {
            	  if (err) return cb(err);
            	  if (!spotifyUser) return cb(new Error('spotifyUser not created.'));
            	  User.createOrUpdate(spotifyUser, function(err, user){
            		  if (err) return cb(err);
            		  if (!user) return cb(new Error('user not created.'));
            		  spotifyUser.userId = user.id;
            		  spotifyUser.save(cb);          		  
            	  });
              });
		  } else {
			  // update spotifyUser
			  spotifyUser.display_name = options.display_name;
			  //TODO agregar los campos restantes
			  spotifyUser.save(cb);
		  }

	  });
  }

};
