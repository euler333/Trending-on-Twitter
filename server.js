const express=require('express'),
    authorization=require('./Twitter/authorization.js'),    
    trends=require('./Twitter/trends.js'),
    app=express();

authorization.authorize();
app.get('/currentTrends', (req, res) => {
    trends.callTwitter(trends.trendOptions, data => {
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
                            height: 44px;
                            padding-top: 11px;
                            font-weight: bold;
                            font-family: Verdana;
                        }
                    </style>
                </head>
                <body>
                    <div id="graph">
                        <dl id="topics"></dl>
                    </div>
                    <script>
                        (() => {
                            var trends=${JSON.stringify(data[0].trends)},
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
                            //height and width of canvas element must be set inline                           
                            graph.insertAdjacentHTML('beforeend', '<canvas id="chart" height= "'+getComputedStyle(graph).height+'" width="650px"></canvas>');
                            canvas=document.getElementById('chart');
                            context=canvas.getContext('2d');
                            function draw() {
                                context.clearRect(0, 0, canvas.width, canvas.height);
                                for (let i=0; i<widths.length; i++){ 
                                    //draw bars
                                    context.fillStyle='blue';
                                    context.beginPath();
                                    context.fillRect(0, 1+44*i, widths[i], 42);
                                    context.closePath();                                    
                                    context.fill();
                                    
                                    //draw text
                                    let text = Math.round(trends[i].tweet_volume*widths[i]/maxWidths[i]),
                                        textWidth = context.measureText(text).width + 5;                                    
                                    context.fillStyle='black';
                                    context.beginPath();
                                    context.font = '20px arial';
                                    context.fillText(text, widths[i]+15, 30+44*i);
                                    context.closePath();                                    
                                    context.fill();                                    
                                    
                                    //draw tweet volume content box
                                    let x = widths[i]+3,
                                        y = 22.5+44*i,
                                        width = textWidth;
                                    context.beginPath();
                                    context.moveTo(x, y);    
                                    context.lineTo(x+=5, y+=5);    
                                    context.lineTo(x, y+=5);
                                    context.arc(x+=5, y+=5, 5, Math.PI, Math.PI/2, true);
                                    context.lineTo(x+=width, y+=5);
                                    context.arc(x, y-=5, 5, Math.PI/2, 0, true);
                                    context.lineTo(x+=5, y-=30);
                                    context.arc(x-=5, y, 5, 0, -Math.PI/2, true);
                                    context.arc(x-=width, y, 5, -Math.PI/2, Math.PI, true);
                                    context.lineTo(x-=5, y+=10);
                                    context.lineTo(x-=5, y+=5);
                                    context.lineWidth = 2;
                                    context.closePath();
                                    context.stroke();                                    
                                }
                                for (let i=0; i<widths.length; i++){ 
                                    if (widths[i]<maxWidths[i]) widths[i]++;
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