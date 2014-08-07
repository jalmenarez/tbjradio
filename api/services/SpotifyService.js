
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

    getTimeInSeconds: function(req) {
    	sails.log.debug('SpotifyService :: getTimeInSeconds');
        if (req.session.tokenExpirationEpoch){
            var timeInSeconds = Math.floor(req.session.tokenExpirationEpoch - new Date().getTime() / 1000);
            sails.log.info('Retrieved token. It expires in ' + timeInSeconds + ' seconds!');
            return timeInSeconds;
        }else {
            return -1;
        }
    },
    
    validateTokens: function(req, webApi){
    	sails.log.debug('SpotifyService :: validateTokens');
    	var storedAccessToken = req.session ? req.session.access_token : null;       
        webApi.setAccessToken(storedAccessToken);
        var storedRefreshToken = req.session ? req.session.refresh_token : null;
        webApi.setRefreshToken(storedRefreshToken);   
        if(storedAccessToken != null && storedRefreshToken != null){
        	var timeInSeconds = SpotifyService.getTimeInSeconds(req);
        if (timeInSeconds < 120 && timeInSeconds > 0) {
            webApi.refreshAccessToken().then(function (data) {
                req.session.tokenExpirationEpoch = (new Date().getTime() / 1000) + data['expires_in'];
                sails.log.debug('Refreshed token. It now expires in ' + Math.floor(req.session.tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
                return true;
            }, function (err) {
                sails.log.error(err);
                return false;
            });
        }else if(timeInSeconds > 120) {
        	return true;
        }else {
        	return false;
        }
        }else {
        	return false;
        }
    }

};

