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
                            font-family: Helvetica;                            
                        }
                        #graph{
                            display: inline-flex;
                        }
                        #topics{
                            margin: 2px 10px 0px 40px;
                            box-sizing: content-box;
                        }
                        li.topic{
                            height: 47px;
                            padding-top: 11px;
                            color: white;
                            font-weight: bold;
                            font-size: 25px;
                        }
                        body{
                            background: rgb(64,153,255);
                        }
                        header{
                            display: flex;
                            margin-bottom: 20px;
                        }
                        header > h1{
                            font-size: 70px;
                            color: white;
                            margin: 0px 0px 10px 50px;
                            line-height: 50px;
                        }
                        header > svg {
                            height: 70px;
                            margin-left: 10px;
                        }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>Trending on Twitter</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                            <defs>
                              <style type="text/css"><![CDATA[
                                 path {
                                   fill: white;
                                 }
                              ]]></style>
                            </defs>
                            <path d="M326.3,902.3c-108.9,0-214.8-31-306.3-89.7c-8.5-5.5-12.2-16.1-8.8-25.7c3.4-9.6,13.1-15.7,23.1-14.2c76.7,8.9,156.8-6.7,224-45.1c-66.4-20-120.5-71.4-142.3-139.6c-2.4-7.4-0.7-15.4,4.5-21.1c3.1-3.5,7.3-5.8,11.8-6.8C80.4,520.4,47.6,458,47.6,389.5c0-7.7,4.1-16,10.8-20c6.7-3.9,14.9-5.1,21.6-1.5c1.9,1.1,3.9,2.1,5.8,3.1c-23.6-34.8-36.6-76.5-36.6-119.9c0-37.7,10-74.9,29-107.5c3.6-6.2,10-10.2,17.1-10.8c7.1-0.5,14,2.4,18.6,7.9C202,248.9,329.6,317.5,467.2,331.6c-0.6-6.6-0.9-13.3-0.9-19.9c0-117.9,96-213.9,213.9-213.9c54.8,0,107.8,21.2,147.3,58.7c36.4-8.3,71.2-22.3,103.8-41.6c7.8-4.5,17.6-3.9,24.7,1.7c7.1,5.7,9.9,15.1,7.2,23.7c-6.9,21.7-17.2,41.9-30.4,60.1c9.1-3.1,17.9-6.7,26.7-10.5c8.8-4,19.3-1.6,25.5,5.9c6.2,7.4,6.8,18.1,1.4,26.1c-25.3,37.7-56.2,70.6-91.8,97.9c0.1,4.7,0.2,9.5,0.2,14.2C894.8,613.3,682.1,902.3,326.3,902.3z M120.3,816.5c64.8,27.8,134.7,42.2,206.1,42.2c328.5,0,524.9-266.8,524.9-524.9c0-8-0.2-16-0.5-24c-0.3-7.3,3.1-14.3,9-18.6c15.7-11.3,30.4-23.8,44-37.4c-14.2,3.3-28.6,5.8-43.2,7.5c-10.1,1.4-19.9-4.8-23.2-14.6c-3.3-9.7,0.6-20.4,9.4-25.7c17.3-10.4,32.5-23.6,44.9-38.9c-21.7,8.3-44.1,14.8-67,19.3c-7.3,1.5-14.9-0.9-20.1-6.4c-32.1-34.2-77.4-53.8-124.4-53.8c-93.9,0-170.3,76.4-170.3,170.3c0,13,1.5,26.1,4.4,38.9c1.5,6.6-0.1,13.6-4.5,18.9c-4.4,5.2-10.9,8.8-17.8,7.8c-148.7-7.5-288.8-73.6-389.4-182.9c-6.4,18.2-9.8,37.5-9.8,56.9c0,57.2,28.3,110.1,75.7,141.8c8.1,5.4,11.6,15.5,8.7,24.7c-3,9.2-12.2,14.8-21.4,15.2c-20.8-0.7-41.4-4.4-61.1-11c13.5,67.5,65.4,121,133.1,134.6c9.9,2,17.2,10.5,17.5,20.6c0.3,10.1-6.3,19.1-16,21.8c-18.8,5.1-38.5,8-57.8,7.6c29.2,51.6,84,85.2,145.2,86.4c9.2,0.2,17.3,6.2,20.2,14.9c2.9,8.7,0,18.4-7.2,24.1C268.4,779.9,196.7,808.7,120.3,816.5z"/>
                        </svg>                           
                    </header>
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
                                topic.className='topic';
                                topic.setAttribute('data-url', trend.url);                                
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
                                    context.beginPath();
                                    context.strokeRect(4, 5+47*i, widths[i], 38);
                                    context.strokeStyle='white';
                                    context.lineWidth=4;
                                    context.closePath();                                    
                                    
                                    //draw text
                                    let text=Math.round(trends[i].tweet_volume*widths[i]/maxWidths[i]);
                                    context.fillStyle='white';
                                    context.font='20px Helvetica';
                                    context.fillText(text, widths[i]+35, 31+47*i);
                                    
                                    //draw tweet volume content box
                                    let width=context.measureText(text).width+22; 
                                        height=42,
                                        x=widths[i]+26,
                                        y=(height+5)*i+12,
                                        cornerRadius=8,
                                        lineWidth=4;
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
                                    context.strokeStyle='white';        
                                    context.stroke();     
                                    
                                    //draw arrow head
                                    let center=y+12;
                                    context.beginPath();
                                    context.moveTo(x-16, center-5);    
                                    context.lineTo(x-21, center);
                                    context.lineTo(x-16, center+5);
                                    context.closePath();
                                    context.lineWidth=lineWidth;
                                    context.fillStyle='white';
                                    context.fill();
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