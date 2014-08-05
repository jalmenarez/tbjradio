
module.exports = {

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    generateRandomString: function(length) {
    	sails.log.debug('SpotifyService :: generateRandomString');
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    isAccessTokenExpired: function(req) {
    	sails.log.debug('SpotifyService :: isAccessTokenExpired');
        if (req.session.tokenExpirationEpoch){
            var timeInSeconds = Math.floor(req.session.tokenExpirationEpoch - new Date().getTime() / 1000);
            sails.log.debug('Retrieved token. It expires in ' + timeInSeconds + ' seconds!');
            if(timeInSeconds > 0) {
                return false;
            }else {
                return true;
            }
        }else {
            return true;
        }
    },
    
    validateTokens: function(req, webApi){
    	sails.log.debug('SpotifyService :: validateTokens');
    	var storedAccessToken = req.session ? req.session.access_token : null;
        sails.log.debug('access_token: ' + storedAccessToken);
        webApi.setAccessToken(storedAccessToken);
        var storedRefreshToken = req.session ? req.session.refresh_token : null;
        webApi.setRefreshToken(storedRefreshToken);
        sails.log.debug('refresh_token: ' + storedRefreshToken);
        if(storedAccessToken != null && storedRefreshToken != null){
        if (SpotifyService.isAccessTokenExpired(req)) {
            webApi.refreshAccessToken().then(function (data) {
                req.session.tokenExpirationEpoch = (new Date().getTime() / 1000) + data['expires_in'];
                sails.log.debug('Refreshed token. It now expires in ' + Math.floor(req.session.tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
                return true;
            }, function (err) {
                sails.log.error(err);
                return false;
            });
        }else {
        	return true;
        }
        }else {
        	return false;
        }
    }

};

