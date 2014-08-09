/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }

    log: {
        level: "verbose"
    },

    connections: {
        someMongodbServer: {
            host: 'localhost',
            port: 27017,
            user: 'jalmenarez',
            password: '12345',
            database: 'tbjradiodb'
        }
    },

    session: {
        host: 'localhost',
        port: 27017,
        db: 'tbjradiodb',
        collection: 'sessions',
        username: 'jalmenarez',
        password: '12345'
    },

    url_base: 'http://localhost:1337',

    spotify: {
        credentials: {
            redirectUri: "http://localhost:1337/spotify/callback"
        }
    }

};
