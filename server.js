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
                            font-weight: bold;
                            font-family: Verdana;                            
                        }
                        #graph{
                            display: inline-flex;
                        }
                        #topics{
                            margin: 0px 10px 0px 0px;
                        }
                        li{
                            height: 44px;
                            padding-top: 11px;
                        }
                        h1{
                            font-size: 60px;
                        }
                    </style>
                </head>
                <body>
                    <h1 align="center">Trending on Twitter</h1>
                    <div id="graph">
                        <ol id="topics"></ol>
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
                                var topic=document.createElement('li');
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
                                    context.fill();
                                    context.closePath();                                    
                                    
                                    //draw text
                                    let text=Math.round(trends[i].tweet_volume*widths[i]/maxWidths[i]);
                                    context.fillStyle='black';
                                    context.beginPath();
                                    context.font='20px arial';
                                    context.fillText(text, widths[i]+25, 30+44*i);
                                    context.fill();
                                    
                                    //draw tweet volume content box
                                    let width=context.measureText(text).width + 22; 
                                        height=42,
                                        x=widths[i]+15,
                                        y=(height+2)*i+7,
                                        cornerRadius=5,
                                        lineWidth=2;
                                    context.beginPath();
                                    context.moveTo(x, y);    
                                    context.lineTo(x, y+=(height-2*cornerRadius-lineWidth)); 
                                    context.arc(x+=cornerRadius, y, cornerRadius, Math.PI, Math.PI/2, true);
                                    context.lineTo(x+=(width-2*cornerRadius-lineWidth), y+=cornerRadius);
                                    context.arc(x, y-=cornerRadius, cornerRadius, Math.PI/2, 0, true);  
                                    context.lineTo(x+=cornerRadius, y-=(height-2*cornerRadius-lineWidth));
                                    context.arc(x-=cornerRadius, y, cornerRadius, 0, -Math.PI/2, true);
                                    context.lineTo(x-=(width-2*cornerRadius-lineWidth), y-=cornerRadius);
                                    context.arc(x, y+=cornerRadius, cornerRadius, -Math.PI/2, Math.PI, true);
                                    context.closePath();                                    
                                    context.lineWidth=lineWidth;
                                    context.stroke();     
                                    
                                    //draw arrow head
                                    let center = y + 15;
                                    context.beginPath();
                                    context.moveTo(x-10, center-5);    
                                    context.lineTo(x-15, center);
                                    context.lineTo(x-10, center+5);
                                    context.closePath();
                                    context.lineWidth=lineWidth;
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