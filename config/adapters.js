/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'disk',

  // Persistent adapter for DEVELOPMENT ONLY
  // (data is preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // Spotify
  spotify: {
    client_id: "c4b3222976e34dd581d9bd71a37e7677",
    client_secret: "b6a298fad16a4cdfbc0a7b3bdab0e6d4",
    redirect_uri: "http://tbjradio.jit.su/spotify/callback",
    stateKey: "spotify_auth_state"
  }

};