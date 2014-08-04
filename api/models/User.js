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
  }

};
