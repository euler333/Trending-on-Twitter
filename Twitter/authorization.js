exports.authorize = () => {
    var https = require('https'),
        oauthJsonFile = require('fs').createWriteStream('/home/ubuntu/workspace/app/Twitter/oauth.json'),
        gettingAccess = {
            consumerKey: 'lPMNYMa4sgP2UR7RvFMQZqDZT',
            consumerSecretKey: 'NPHeGLtNkfikwtp7d1kr3fVnKlvMdgLpX579BcaFXsSxfmyYZL' 
        },
        request = https.request({
            method: 'POST',
            host: 'api.twitter.com',
            path: '/oauth2/token',
            headers: {
                'User-Agent': 'Coding Defined',
                Authorization: 'Basic ' + Buffer((encodeURIComponent(gettingAccess.consumerKey) + ':' + encodeURIComponent(gettingAccess.consumerSecretKey))).toString('base64'),
                'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-length': 29
            }
        });
    request.end('grant_type=client_credentials');
    request.on('response', response => {
        if (response.statusCode !== 200) return console.error(response.statusCode);
        response.pipe(oauthJsonFile);
    });
};