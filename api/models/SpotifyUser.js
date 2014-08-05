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

  }

};
