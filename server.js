const express = require('express'),
    authorization = require('./Twitter/authorization.js'),    
    trends = require('./Twitter/trends.js'),
    app = express();

authorization.authorize();
app.get('/currentTrends', (req, res) => {
    trends.callTwitter(trends.trendOptions, trends => {
        res.json(trends);
    });    
});
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}.`);
});