var https = require('https'),
	headers = {
		'User-Agent': 'Coding Defined',
		Authorization: 'Bearer ' + require('./oauth.json').access_token
	},
	callTwitter = (options, callback) => {
		https.get(options, response => {
			jsonHandler(response, callback);
		}).on('error', e => {
			console.error(e.message);
		});
	},
	trendOptions = {
		host: 'api.twitter.com',
		path: '/1.1/trends/place.json?id=1', // id = 1 for global trends
		headers: headers
	},
	jsonHandler = (response, callback) => {
		var json = '';
		response.setEncoding('utf8');
		if (response.statusCode === 200) {
			response.on('data', chunk => {
				json += chunk;
			}).on('end', () => {
		        var data = JSON.parse(json), 
		        	trends=data[0].trends,
		            i=trends.length-1;
		        for (i; i>=0; i--) {//removes all trends without tweet volume iterating from back to front to preserve indices
		            if (!trends[i].tweet_volume) trends.splice(i, 1);
		        }
		        trends.sort((a, b) => {//sorts all trends in descending order
		            return b.tweet_volume-a.tweet_volume;
		        });
				callback(data);
			});
		} else console.error(response.statusCode);
	};
exports.callTwitter = callTwitter;
exports.trendOptions = trendOptions;