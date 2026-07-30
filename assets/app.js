'use strict';

var last = null;
var lastGeometry = null;
var requestSerial = 0;
var liveTimer = null;
var view3d = { yaw: -0.72, pitch: 0.48, zoom: 1, drag: false, x: 0, y: 0 };

var progressTimer=null;
function setProgress(value,stage){
  value=clamp(Math.round(value),0,100);
  var ring=byId('progressRing'),bar=byId('progressBar'),label=byId('progressValue'),stageEl=byId('progressStage');
  if(ring)ring.style.setProperty('--progress',(value*3.6)+'deg');
  if(bar)bar.style.width=value+'%';
  if(label)label.textContent=value+'%';
  if(stageEl&&stage)stageEl.textContent=stage;
}
function openProgress(){
  var overlay=byId('calculationOverlay');if(!overlay)return;overlay.classList.add('is-visible');overlay.setAttribute('aria-hidden','false');
  setProgress(4,'Preparing geometry');var p=4;clearInterval(progressTimer);
  progressTimer=setInterval(function(){
    if(p<28){p+=4;setProgress(p,'Building the serpentine channel');}
    else if(p<58){p+=3;setProgress(p,'Solving hydraulic resistance');}
    else if(p<84){p+=2;setProgress(p,'Resolving the temperature field');}
    else if(p<94){p+=1;setProgress(p,'Preparing engineering figures');}
  },180);
}
function closeProgress(success){
  clearInterval(progressTimer);progressTimer=null;setProgress(success?100:0,success?'Calculation completed':'Calculation stopped');
  setTimeout(function(){var overlay=byId('calculationOverlay');if(overlay){overlay.classList.remove('is-visible');overlay.setAttribute('aria-hidden','true');}},success?350:120);
}


function byId(id){ return document.getElementById(id); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rgba(hex,a){
  var n=parseInt(hex.replace('#',''),16);
  return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
}

var defaults = {};
document.querySelectorAll('.cfg').forEach(function(el){
  defaults[el.id] = el.type === 'checkbox' ? el.checked : el.value;
});

function readNumber(el){
  var value = Number(String(el.value).trim().replace(',', '.'));
  if (!Number.isFinite(value)) throw new Error('Invalid numerical input: ' + el.id + '.');
  return value;
}

function config(){
  var out={};
  document.querySelectorAll('.cfg').forEach(function(el){
    if(el.type==='checkbox') out[el.id]=el.checked;
    else if(el.tagName==='SELECT') out[el.id]=el.value;
    else out[el.id]=readNumber(el);
  });
  if(out.coverageFollowsCpu){out.coverageX=0;out.coverageY=0;out.coverageL=out.cpuL;out.coverageW=out.cpuW;}
  return out;
}

function setStatus(kind,title,text){
  var box=byId('status');
  box.className='status-box status-'+kind;
  box.innerHTML='<span class="status-dot"></span><div><strong>'+title+'</strong><small>'+text+'</small></div>';
}

function setup(id){
  var canvas=byId(id), rect=canvas.getBoundingClientRect();
  var w=Math.max(300,rect.width||canvas.parentElement.clientWidth||300);
  var h=Math.max(280,rect.height||360);
  var d=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(w*d); canvas.height=Math.round(h*d);
  var ctx=canvas.getContext('2d'); ctx.setTransform(d,0,0,d,0,0); ctx.clearRect(0,0,w,h);
  return [ctx,w,h];
}

function niceTicks(min,max,count){
  if(!Number.isFinite(min)||!Number.isFinite(max)) return [0,1];
  if(min===max){min-=0.5;max+=0.5;}
  var raw=(max-min)/Math.max(1,(count||6)-1), p=Math.pow(10,Math.floor(Math.log10(raw))), q=raw/p;
  var step=(q<1.5?1:q<3?2:q<7?5:10)*p, start=Math.floor(min/step)*step, end=Math.ceil(max/step)*step, out=[];
  for(var v=start;v<=end+step*0.1;v+=step) out.push(v);
  return out;
}
function formatTick(v){var a=Math.abs(v);return a>=100?v.toFixed(0):a>=10?v.toFixed(1):v.toFixed(2);}

function roundedLabel(ctx,x,y,text,fill,align){
  ctx.save();ctx.font='700 10px Inter,Arial';
  var px=7,h=19,w=ctx.measureText(text).width+px*2;
  var left=align==='right'?x-w:x;
  left=clamp(left,5,ctx.canvas.width/(window.devicePixelRatio||1)-w-5); y=Math.max(5,y);
  ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(left,y,w,h,5);ctx.fill();
  ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(text,left+px,y+h/2);ctx.restore();
}

function makePlanAxes(ctx,c,w,h,rightExtra){
  var m={left:58,right:28+(rightExtra||0),top:34,bottom:50};
  var xmin=-c.plateL/2,xmax=c.plateL/2,ymin=-c.plateW/2,ymax=c.plateW/2;
  function X(v){return m.left+(v-xmin)/(xmax-xmin)*(w-m.left-m.right);}
  function Y(v){return m.top+(ymax-v)/(ymax-ymin)*(h-m.top-m.bottom);}
  ctx.save();ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.font='10px Inter,Arial';
  ctx.strokeStyle='#e4ebf2';ctx.lineWidth=1;
  niceTicks(xmin,xmax,7).forEach(function(v){var x=X(v);ctx.beginPath();ctx.moveTo(x,m.top);ctx.lineTo(x,h-m.bottom);ctx.stroke();ctx.fillStyle='#62758a';ctx.textAlign='center';ctx.fillText(formatTick(v),x,h-m.bottom+17);});
  niceTicks(ymin,ymax,7).forEach(function(v){var y=Y(v);ctx.beginPath();ctx.moveTo(m.left,y);ctx.lineTo(w-m.right,y);ctx.stroke();ctx.fillStyle='#62758a';ctx.textAlign='right';ctx.fillText(formatTick(v),m.left-8,y+3);});
  ctx.strokeStyle='#9fb0c2';ctx.strokeRect(m.left,m.top,w-m.left-m.right,h-m.top-m.bottom);
  ctx.fillStyle='#43566d';ctx.textAlign='center';ctx.fillText('x [mm]',(m.left+w-m.right)/2,h-10);
  ctx.save();ctx.translate(15,(m.top+h-m.bottom)/2);ctx.rotate(-Math.PI/2);ctx.fillText('y [mm]',0,0);ctx.restore();ctx.restore();
  return {X:X,Y:Y,m:m};
}

function drawZone(ctx,ax,cx,cy,L,W,fill,stroke,dash,label){
  var x=ax.X(cx-L/2),y=ax.Y(cy+W/2),ww=ax.X(cx+L/2)-x,hh=ax.Y(cy-W/2)-y;
  ctx.save();ctx.fillStyle=fill;ctx.fillRect(x,y,ww,hh);ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.setLineDash(dash||[]);ctx.strokeRect(x,y,ww,hh);ctx.restore();
  if(label) roundedLabel(ctx,x+8,y+8,label,stroke,'left');
}

function drawGeometry(result){
  var c=result.c,g=result.g,d=setup('geo2d'),ctx=d[0],w=d[1],h=d[2];
  var ax=makePlanAxes(ctx,c,w,h,0);
  drawZone(ctx,ax,c.coverageX,c.coverageY,c.coverageL,c.coverageW,'rgba(40,104,216,.035)','#2868d8',[4,4],'COOLING ZONE');
  drawZone(ctx,ax,0,0,c.cpuL,c.cpuW,'rgba(196,61,84,.055)','#c43d54',[7,4],'CPU FOOTPRINT');
  ctx.save();ctx.strokeStyle='#159ab7';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  g.path.forEach(function(p,i){i?ctx.lineTo(ax.X(p[0]),ax.Y(p[1])):ctx.moveTo(ax.X(p[0]),ax.Y(p[1]));});ctx.stroke();ctx.restore();
  [[g.inlet,'#17885b','INLET',1],[g.outlet,'#d06b18','OUTLET',-1]].forEach(function(a){
    var x=ax.X(a[0][0]),y=ax.Y(a[0][1]);ctx.fillStyle='#fff';ctx.strokeStyle=a[1];ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,6.5,0,Math.PI*2);ctx.fill();ctx.stroke();
    roundedLabel(ctx,x+(a[3]>0?10:-10),y-27,a[2],a[1],a[3]<0?'right':'left');
  });
  ctx.save();ctx.font='600 10px Inter,Arial';ctx.fillStyle='#52667d';
  var items=[['#159ab7','Channel centerline'],['#c43d54','CPU footprint'],['#2868d8','Required cooling zone']];
  items.forEach(function(it,i){var x=ax.m.left+i*155;ctx.strokeStyle=it[0];ctx.lineWidth=i===0?3:1.5;ctx.setLineDash(i===0?[]:(i===1?[7,4]:[4,4]));ctx.beginPath();ctx.moveTo(x,18);ctx.lineTo(x+24,18);ctx.stroke();ctx.setLineDash([]);ctx.fillText(it[1],x+31,21);});ctx.restore();
  draw3D(result);
}

function draw3D(result){
  var c=result.c,g=result.g,d=setup('geo3d'),ctx=d[0],w=d[1],h=d[2];ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  var yaw=view3d.yaw,pitch=view3d.pitch,zoom=view3d.zoom;
  function P(p,z){
    var x=p[0],y=p[1],zz=(z||0)-c.plateH/2,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    var xr=x*cy-y*sy, yr=x*sy+y*cy, zr=zz*cp-yr*sp;
    var s=Math.min((w-150)/(c.plateL+c.plateW*.65),(h-95)/(c.plateH+c.plateW*.60))*zoom;
    return [w/2+xr*s,h/2-zr*s,s];
  }
  function polygon(points,fill,stroke){ctx.beginPath();points.forEach(function(q,i){i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
  var corners=[[-c.plateL/2,-c.plateW/2],[c.plateL/2,-c.plateW/2],[c.plateL/2,c.plateW/2],[-c.plateL/2,c.plateW/2]],lo=corners.map(function(p){return P(p,0);}),hi=corners.map(function(p){return P(p,c.plateH);});
  polygon([lo[0],lo[1],hi[1],hi[0]],'#edf3f8','#7c91a8');polygon([lo[1],lo[2],hi[2],hi[1]],'#e4edf5','#7c91a8');polygon([lo[2],lo[3],hi[3],hi[2]],'#f3f7fa','#7c91a8');polygon(hi,'rgba(248,250,252,.92)','#647d96');
  var cpu=[[-c.cpuL/2,-c.cpuW/2],[c.cpuL/2,-c.cpuW/2],[c.cpuL/2,c.cpuW/2],[-c.cpuL/2,c.cpuW/2]].map(function(p){return P(p,c.plateH+.12);});polygon(cpu,'rgba(196,61,84,.12)','#c43d54');
  ctx.strokeStyle='#159ab7';ctx.lineWidth=3.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();g.path.forEach(function(p,i){var q=P(p,c.baseT+c.channelH/2);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();
  [[g.inlet,'#17885b','INLET'],[g.outlet,'#d06b18','OUTLET']].forEach(function(a){var b=P(a[0],c.baseT),t=P(a[0],c.plateH+c.portHeight);ctx.strokeStyle=a[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(t[0],t[1]);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(t[0],t[1],6,0,Math.PI*2);ctx.fill();ctx.stroke();roundedLabel(ctx,t[0]+9,t[1]-25,a[2],a[1],'left');});
  var cc=P([0,0],c.plateH+.2);roundedLabel(ctx,cc[0]+8,cc[1]-11,'CPU FOOTPRINT','#c43d54','left');
  ctx.fillStyle='#63778e';ctx.font='10px Inter,Arial';ctx.fillText('Plate '+c.plateL.toFixed(1)+' × '+c.plateW.toFixed(1)+' × '+c.plateH.toFixed(1)+' mm',12,h-12);
}

function drawLine(id,x,y,title,xLabel,yLabel,color){
  var d=setup(id),ctx=d[0],w=d[1],h=d[2],m={left:64,right:24,top:42,bottom:52};
  var xmin=Math.min.apply(null,x),xmax=Math.max.apply(null,x),ymin=Math.min.apply(null,y),ymax=Math.max.apply(null,y),pad=(ymax-ymin)*0.10||0.5;
  ymin-=pad;ymax+=pad;var xt=niceTicks(xmin,xmax,7),yt=niceTicks(ymin,ymax,6);ymin=yt[0];ymax=yt[yt.length-1];
  function X(v){return m.left+(v-xmin)/(xmax-xmin||1)*(w-m.left-m.right);}function Y(v){return m.top+(ymax-v)/(ymax-ymin||1)*(h-m.top-m.bottom);}
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.font='10px Inter,Arial';
  ctx.strokeStyle='#e5ebf1';xt.forEach(function(v){var xx=X(v);ctx.beginPath();ctx.moveTo(xx,m.top);ctx.lineTo(xx,h-m.bottom);ctx.stroke();ctx.fillStyle='#64758a';ctx.textAlign='center';ctx.fillText(formatTick(v),xx,h-m.bottom+17);});
  yt.forEach(function(v){var yy=Y(v);ctx.beginPath();ctx.moveTo(m.left,yy);ctx.lineTo(w-m.right,yy);ctx.stroke();ctx.fillStyle='#64758a';ctx.textAlign='right';ctx.fillText(formatTick(v),m.left-8,yy+3);});
  ctx.strokeStyle='#9fb0c2';ctx.strokeRect(m.left,m.top,w-m.left-m.right,h-m.top-m.bottom);
  ctx.strokeStyle=color;ctx.lineWidth=2.3;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();y.forEach(function(v,i){i?ctx.lineTo(X(x[i]),Y(v)):ctx.moveTo(X(x[i]),Y(v));});ctx.stroke();
  var a=[X(x[0]),Y(y[0])],b=[X(x[x.length-1]),Y(y[y.length-1])];ctx.fillStyle=color;[a,b].forEach(function(p){ctx.beginPath();ctx.arc(p[0],p[1],3.5,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#23364d';ctx.font='700 12px Inter,Arial';ctx.textAlign='center';ctx.fillText(title,w/2,20);ctx.fillStyle='#64758a';ctx.font='10px Inter,Arial';ctx.fillText(xLabel,(m.left+w-m.right)/2,h-10);ctx.save();ctx.translate(15,(m.top+h-m.bottom)/2);ctx.rotate(-Math.PI/2);ctx.fillText(yLabel,0,0);ctx.restore();
  roundedLabel(ctx,a[0]+7,a[1]-25,'INLET','#17885b','left');roundedLabel(ctx,b[0]-7,b[1]-25,'OUTLET','#d06b18','right');
}

function sequentialRgb(t){
  t=clamp(t,0,1);var stops=[[24,83,120],[25,154,183],[79,190,169],[246,190,72],[206,76,64]],u=t*(stops.length-1),i=Math.min(stops.length-2,Math.floor(u)),f=u-i,a=stops[i],b=stops[i+1];
  return [Math.round(lerp(a[0],b[0],f)),Math.round(lerp(a[1],b[1],f)),Math.round(lerp(a[2],b[2],f))];
}
function sequentialColor(t){var c=sequentialRgb(t);return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}

function drawColorbar(ctx,x,y,h,min,max,label){
  for(var k=0;k<h;k++){ctx.fillStyle=sequentialColor(1-k/h);ctx.fillRect(x,y+k,12,1);}ctx.strokeStyle='#8296aa';ctx.strokeRect(x,y,12,h);ctx.fillStyle='#52667d';ctx.font='9px Inter,Arial';ctx.textAlign='right';ctx.fillText(max.toFixed(2),x-4,y+3);ctx.fillText(min.toFixed(2),x-4,y+h);ctx.save();ctx.translate(x+28,y+h/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText(label,0,0);ctx.restore();
}

function drawSpatialPath(result){
  var d=setup('velocityMap'),ctx=d[0],w=d[1],h=d[2],c=result.c,g=result.g,ax=makePlanAxes(ctx,c,w,h,48),mn=Math.min.apply(null,result.vel),mx=Math.max.apply(null,result.vel);
  ctx.save();ctx.strokeStyle='#cdd9e5';ctx.lineWidth=5.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();g.path.forEach(function(p,i){i?ctx.lineTo(ax.X(p[0]),ax.Y(p[1])):ctx.moveTo(ax.X(p[0]),ax.Y(p[1]));});ctx.stroke();
  for(var i=1;i<g.path.length;i++){var t=(result.vel[Math.min(i,result.vel.length-1)]-mn)/(mx-mn||1);ctx.strokeStyle=sequentialColor(t);ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(ax.X(g.path[i-1][0]),ax.Y(g.path[i-1][1]));ctx.lineTo(ax.X(g.path[i][0]),ax.Y(g.path[i][1]));ctx.stroke();}ctx.restore();
  [[g.inlet,'#17885b','INLET'],[g.outlet,'#d06b18','OUTLET']].forEach(function(a){var x=ax.X(a[0][0]),y=ax.Y(a[0][1]);ctx.fillStyle=a[1];ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();roundedLabel(ctx,x+8,y-24,a[2],a[1],'left');});
  drawColorbar(ctx,w-30,ax.m.top,h-ax.m.top-ax.m.bottom,mn,mx,'Velocity [m/s]');
}

function drawTemperatureMap(result){
  var d=setup('temperatureMap'),ctx=d[0],w=d[1],h=d[2],c=result.c,ax=makePlanAxes(ctx,c,w,h,52),T=result.Tfield,xg=result.xg,yg=result.yg,mn=Infinity,mx=-Infinity;
  T.forEach(function(row){row.forEach(function(v){mn=Math.min(mn,v);mx=Math.max(mx,v);});});

  /* Render the fine numerical grid through an offscreen raster and use
     bilinear canvas interpolation. This preserves the 0.35 mm solution
     spacing while avoiding visible block cells in the displayed field. */
  var rw=xg.length,rh=yg.length,off=document.createElement('canvas');off.width=rw;off.height=rh;
  var oc=off.getContext('2d'),img=oc.createImageData(rw,rh),data=img.data;
  for(var j=0;j<rh;j++) for(var i=0;i<rw;i++){
    var t=(T[j][i]-mn)/(mx-mn||1),rgb=sequentialRgb(t),row=rh-1-j,k=(row*rw+i)*4;
    data[k]=rgb[0];data[k+1]=rgb[1];data[k+2]=rgb[2];data[k+3]=255;
  }
  oc.putImageData(img,0,0);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(off,ax.m.left,ax.m.top,w-ax.m.left-ax.m.right,h-ax.m.top-ax.m.bottom);ctx.restore();
  ctx.strokeStyle='#9fb0c2';ctx.lineWidth=1;ctx.strokeRect(ax.m.left,ax.m.top,w-ax.m.left-ax.m.right,h-ax.m.top-ax.m.bottom);

  ctx.save();ctx.strokeStyle='rgba(20,38,63,.58)';ctx.lineWidth=1.0;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();result.g.path.forEach(function(p,i){i?ctx.lineTo(ax.X(p[0]),ax.Y(p[1])):ctx.moveTo(ax.X(p[0]),ax.Y(p[1]));});ctx.stroke();
  ctx.setLineDash([7,4]);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(ax.X(-c.cpuL/2),ax.Y(c.cpuW/2),ax.X(c.cpuL/2)-ax.X(-c.cpuL/2),ax.Y(-c.cpuW/2)-ax.Y(c.cpuW/2));ctx.restore();
  roundedLabel(ctx,ax.X(-c.cpuL/2)+8,ax.Y(c.cpuW/2)+8,'CPU FOOTPRINT','#c43d54','left');
  drawColorbar(ctx,w-32,ax.m.top,h-ax.m.top-ax.m.bottom,mn-273.15,mx-273.15,'Temperature [°C]');
}

function drawResults(result){
  drawLine('velocity',result.s.map(function(v){return v*1000;}),result.vel,'Velocity along the flow path','Hydraulic coordinate s [mm]','Mean velocity [m/s]','#2868d8');
  drawLine('temperature',result.s.map(function(v){return v*1000;}),result.Tf.map(function(v){return v-273.15;}),'Coolant temperature along the flow path','Hydraulic coordinate s [mm]','Coolant temperature [°C]','#c75a2a');
  drawSpatialPath(result);drawTemperatureMap(result);
}

function render(result){
  last=result;lastGeometry=result;drawGeometry(result);drawResults(result);
  byId('resultBody').innerHTML=result.rows.map(function(row){var cls=row[1]==='PASS'?'value-pass':(row[1]==='FAIL'?'value-fail':'');var value=typeof row[1]==='number'?row[1].toFixed(Math.abs(row[1])>=100?2:4):row[1];return '<tr><td>'+row[0]+'</td><td class="'+cls+'">'+value+'</td><td>'+row[2]+'</td></tr>';}).join('');
  function find(name){for(var i=0;i<result.rows.length;i++)if(result.rows[i][0]===name)return result.rows[i][1];return null;}
  var metrics=[String(find('Optimized passes')||''),Number(find('Hydraulic length')||0).toFixed(1)+' mm',Number(find('Pressure drop')||0).toFixed(2)+' kPa',Number(find('Maximum CPU region temperature')||0).toFixed(1)+' °C'];
  document.querySelectorAll('#metricStrip strong').forEach(function(el,i){el.textContent=metrics[i];});byId('excel').disabled=false;byId('pdf').disabled=false;
}

async function updateGeometry(options){
  options=options||{};var button=byId('updateGeometry'),serial=++requestSerial;
  try{
    button.disabled=true;
    if(!options.silent)setStatus('running','Updating geometry','Building the serpentine route from the current dimensions.');
    var payload=config();payload._mode='geometry';
    var response=await fetch('calculate.php',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},cache:'no-store',body:JSON.stringify(payload)});
    var text=await response.text();if(serial!==requestSerial)return;if(!text.trim())throw new Error('The geometry model returned no data.');
    var json;try{json=JSON.parse(text);}catch(e){throw new Error('The geometry model returned an invalid response.');}
    if(!response.ok||!json.ok)throw new Error(json.error||'The geometry could not be generated.');
    lastGeometry=json.data;drawGeometry(json.data);
    document.querySelector('#metricStrip article:nth-child(1) strong').textContent=String(json.data.g.N);
    document.querySelector('#metricStrip article:nth-child(2) strong').textContent=(json.data.g.s[json.data.g.s.length-1]).toFixed(1)+' mm';
    setStatus('success','Geometry updated','Planar and three dimensional geometry match the current inputs.');
  }catch(error){if(serial===requestSerial)setStatus('error','Geometry unavailable',error.message);}finally{button.disabled=false;}
}

async function calculate(options){
  options=options||{};var button=byId('calculate'),serial=++requestSerial,ok=false;
  try{
    if(!options.silent){button.disabled=true;openProgress();setStatus('running','Evaluating model','Computing flow resistance and heat transfer.');}
    var response=await fetch('calculate.php',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},cache:'no-store',body:JSON.stringify(config())});
    var text=await response.text();if(serial!==requestSerial)return;if(!text.trim())throw new Error('The physical model returned no data.');
    var json;try{json=JSON.parse(text);}catch(e){throw new Error('The physical model returned an invalid response.');}
    if(!response.ok||!json.ok)throw new Error(json.error||'The physical model could not be evaluated.');
    if(!options.silent)setProgress(97,'Rendering temperature and velocity fields');
    render(json.data);ok=true;
    setStatus('success',options.silent?'Geometry updated':'Model evaluated',options.silent?'Geometry and flow path match the current inputs.':'Geometry and thermal hydraulic results are available.');
  }catch(error){if(serial===requestSerial)setStatus('error','Calculation unavailable',error.message);}finally{if(!options.silent){button.disabled=false;closeProgress(ok);}}
}

function markGeometryPending(){setStatus('idle','Geometry changed','Select Update geometry to refresh the route, or Run calculation for complete results.');}
function postOpen(url,payload){var form=document.createElement('form');form.method='POST';form.action=url;form.target='_blank';Object.keys(payload||{}).forEach(function(key){var input=document.createElement('input');input.type='hidden';input.name=key;input.value=payload[key];form.appendChild(input);});document.body.appendChild(form);form.submit();form.remove();}

byId('updateGeometry').addEventListener('click',function(){updateGeometry({silent:false});});
byId('calculate').addEventListener('click',function(){calculate({silent:false});});
byId('excel').addEventListener('click',function(){postOpen('export.php',{payload:JSON.stringify(config())});});
byId('pdf').addEventListener('click',function(){postOpen('report.php',{payload:JSON.stringify(config())});});
byId('representative').addEventListener('click',function(){window.open('representative-report.php','_blank');});
byId('reset').addEventListener('click',function(){document.querySelectorAll('.cfg').forEach(function(el){if(el.type==='checkbox')el.checked=defaults[el.id];else el.value=defaults[el.id];});updateGeometry({silent:false});});
document.querySelectorAll('.cfg').forEach(function(el){el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',markGeometryPending);});

var geo3dCanvas=byId('geo3d');
geo3dCanvas.addEventListener('pointerdown',function(e){view3d.drag=true;view3d.x=e.clientX;view3d.y=e.clientY;geo3dCanvas.setPointerCapture(e.pointerId);});
geo3dCanvas.addEventListener('pointermove',function(e){if(!view3d.drag)return;view3d.yaw+=(e.clientX-view3d.x)*0.009;view3d.pitch=clamp(view3d.pitch+(e.clientY-view3d.y)*0.009,-1.20,1.20);view3d.x=e.clientX;view3d.y=e.clientY;if(lastGeometry)draw3D(lastGeometry);});
geo3dCanvas.addEventListener('pointerup',function(){view3d.drag=false;});geo3dCanvas.addEventListener('pointercancel',function(){view3d.drag=false;});
geo3dCanvas.addEventListener('wheel',function(e){e.preventDefault();view3d.zoom=clamp(view3d.zoom*(e.deltaY>0?0.92:1.08),0.60,1.75);if(lastGeometry)draw3D(lastGeometry);},{passive:false});

window.addEventListener('resize',function(){clearTimeout(liveTimer);liveTimer=setTimeout(function(){if(lastGeometry)drawGeometry(lastGeometry);if(last)drawResults(last);},120);});
updateGeometry({silent:true});
