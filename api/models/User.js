/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
	  firstName: 'string',
	  lastName: 'string',
	  fullName: function() {
	      return this.firstName + ' ' + this.lastName;
	  },
      spotifyUserId: 'string',
      isAdmin: 'boolean'
  },
  
  createOrUpdate: function(options, cb){
	  // find user
	  this.findOne({spotifyUserId: options.spotifyUserId}).exec(function (err, user) {
		  if (err) return cb(err);
		  if (!user){
			  // create user
			  User.create({
                  spotifyUserId: options.spotifyUserId
              }).exec(function (err, user) {
            	  if (err) return cb(err);
            	  cb(user);
              });
		  }else {
			  // update user
			  //TODO completar metodo
		  }          			  
	  });
  }

};
