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
      spotifyUser: {
          model: 'spotifyuser'
      },
      isAdmin: 'boolean',

      fullName: function() {
          return this.firstName + ' ' + this.lastName;
      }

  },
  
  createOrUpdate: function(options, cb){
	  sails.log.info('User :: createOrUpdate');
	  // find user
	  this.findOne({spotifyUser: options.id}).exec(function (err, user) {
		  if (err) { 
			  return cb(err);
		  } else if (!user){
			  // create user
			  sails.log.info('create user');
			  User.create({
                  spotifyUser: options.id
                  //TODO agregar los datos restantes
              }).exec(function (err, user) {
            	  if (err) {
            		  return cb(err);
            	  }   
            	  sails.log.info('created user');
            	  user.save(cb);           	  
              });
		  }else {
			  // update user
			  sails.log.info('update user');
			  user.spotifyUser = options.id;
			  sails.log.info('updated user');
			  //TODO agregar los datos restantes
			  user.save(cb);			  
		  }          			  
	  });
  }

};
