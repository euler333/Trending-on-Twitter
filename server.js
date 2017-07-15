const express=require('express'),
    authorization=require('./Twitter/authorization.js'),    
    trends=require('./Twitter/trends.js'),
    app=express(),
    path=require('path');

authorization.authorize();
app.get('/currentTrends', (req, res) => {
    trends.callTwitter(trends.trendOptions, twitter => {
        var trends=twitter[0].trends,
            i=trends.length-1;
        for (i; i >= 0; i--) {//removes all trends without tweet volume iterating from back to front to preserve indices
            if (!trends[i].tweet_volume) trends.splice(i, 1);
        }
        trends.sort((a, b) => {//sorts all trends in descending order
            return b.tweet_volume-a.tweet_volume;
        });        
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        *{
                            box-sizing: border-box;
                        }
                        #graph{
                            display: inline-flex;
                        }
                        #topics{
                            margin: 0px 10px 0px 0px;
                        }
                        dt{
                            height: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div id="graph">
                        <dl id="topics"></dl>
                    </div>
                    <script>
                        (() => {
                            var trends=${JSON.stringify(trends)},
                                graph=document.getElementById('graph'),
                                topics=document.getElementById('topics'),
                                max=trends[0].tweet_volume,
                                widths=[],
                                maxWidths=[],
                                canvas,
                                context,
                                requestAnimationFrame=window.requestAnimationFrame || 
                                                        window.mozRequestAnimationFrame || 
                                                        window.webkitRequestAnimationFrame || 
                                                        window.msRequestAnimationFrame;                                
                            trends.forEach(trend => {
                                var topic=document.createElement('dt');
                                topic.innerHTML=trend.name;
                                topics.appendChild(topic);
                                widths.push(0);
                                maxWidths.push(Math.round(500*trend.tweet_volume/max));
                            });
                            console.log(getComputedStyle(graph).height);
                            //height and width of canvas element must be set inline                           
                            graph.insertAdjacentHTML('beforeend', '<canvas id="chart" height= "'+getComputedStyle(graph).height+'" width="500px"></canvas>');
                            canvas=document.getElementById('chart');
                            context=canvas.getContext('2d');
                            function draw() {
                                context.clearRect(0, 0, canvas.width, canvas.height);
                                for (let i=0; i < widths.length; i++){ 
                                    context.fillRect(0, 1+20*i, widths[i], 18);
                                    context.fillStyle='blue';
                                    context.fill();
                                }
                                for (let i=0; i < widths.length; i++){ 
                                    if (widths[i] < maxWidths[i]) widths[i]++;
                                }
                                requestAnimationFrame(draw);
                            }
                            draw();
                        })();
                    </script>                    
                </body>
            </html>    
        `);
    });     
});
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}.`);
});