
module.exports = {

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    generateRandomString: function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    isAccessTokenExpired: function(req) {
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
    }

};

