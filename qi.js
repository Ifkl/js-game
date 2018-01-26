var canvas;
function getContext(id){
  canvas=document.getElementById(id);
  return canvas.getContext("2d");
}
var ctx = getContext('canvas'),rad=50,isFollow=false,mapDot = [10,210,410,610],black = createImg('./black.png'),green = createImg('./green.png'),whichChess=0,currPos = [10,10,1],auth=null,authval=0;
var chessDot = [
	[10,10,1],
	[210,10,1],
	[410,10,1],
	[610,10,1],
	[10,610,2],
	[210,610,2],
	[410,610,2],
	[610,610,2]
];
auth = document.getElementsByName('auth');

function run(){
	ctx.clearRect(0,0,700,650);
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(10,10);
	ctx.lineTo(10,610);
	ctx.lineTo(610,610);
	ctx.lineTo(610,10);
	ctx.closePath();
	ctx.strokeStyle="green";
	ctx.stroke();
	drawStraight(10,210,610,210);
	drawStraight(10,410,610,410);
	drawStraight(210,10,210,610);
	drawStraight(410,10,410,610);
	genarateChessPieces();
	setTimeout(run,24);
}
function drawStraight(sartx,starty,endx,endy){
	ctx.beginPath();
	ctx.moveTo(sartx,starty);
	ctx.lineTo(endx,endy);
	ctx.closePath();
	ctx.strokeStyle="green";
	ctx.stroke();
}
function drawCircle(x, y, rad){
	ctx.beginPath();
	ctx.arc(x,y,rad,0,2*Math.PI)
	ctx.closePath();
	ctx.strokeStyle="white";
	ctx.stroke();
}
function drawImag(img,sx,sy,sw,sh){
	ctx.beginPath();
	ctx.drawImage(img,sx,sy,sw,sh);
	ctx.closePath();
}
function genarateChessPieces(){
	var i,j,half=rad/2,len =chessDot.length;
	for (i = 0; i < len; i++) {
		for (j = 0; j < 2; j++) {
			if (chessDot[i][2] == 2) {
				drawImag(black,chessDot[i][0]-half,chessDot[i][1]-half,rad,rad);
			}else{
				drawImag(green,chessDot[i][0]-half,chessDot[i][1]-half,rad,rad);
			}

		}
	}
}
canvas.addEventListener('mousedown', function(e){
	for (var i = 0; i < auth.length; i++) {
		if(auth[i].checked){
			authval = auth[i].value;
		}
	}
	if (authval){
		if (cllisionDot(getMousePos(e)).isCollide && !isFollow) {
			var chess = cllisionChess(getMousePos(e));
			if (chess.isCollide) {
				currPos[0] = chess.dotx;
				currPos[1] = chess.doty;
				currPos[2] = chess.id;
				isFollow = true;
			}
		}
		
	}
});
canvas.addEventListener('mousemove', function(e){
	if (isFollow) {
		var a = getMousePos(e);
		chessDot[whichChess][0] = a.x;
		chessDot[whichChess][1] = a.y;		
	}
});
canvas.addEventListener('mouseup', function(e){
	if (currPos[2] != authval){
		return false;
	}
	isFollow 	= false;
	var a 		= getMousePos(e);
	var clldot 	= cllisionDot(a);
	var lessDis = islatestDistance({'originx':currPos[0],'originy':currPos['1'],'dotx':clldot.dotx,'doty':clldot.doty,'dis':200});
	if (clldot.isCollide && !isExitChess({'x':clldot.dotx,'y':clldot.doty}) && lessDis) {
			currPos[0] = chessDot[whichChess][0] = clldot.dotx;
			currPos[1] = chessDot[whichChess][1] = clldot.doty;
			currPos[2] = chessDot[whichChess][2];
			var rm = isEat({'chessx':clldot.dotx,'chessy':clldot.doty});
			console.log(rm);
			if (rm.length>0){
				for (var i = 0; i < rm.length; i++) {
					removeChess({'x':rm[i][0],'y':rm[i][1]});
				}
			}

	}else{
			chessDot[whichChess][0] = currPos[0];
			chessDot[whichChess][1] = currPos[1];
	}
});
function createImg(img){
  var imgObj = new Image();
  imgObj.src=img;
  return imgObj;
}
function isExitChess(cllide){
	var len =chessDot.length;
	for (i = 0; i < len; i++) {
		if (cllide.x == chessDot[i][0] && cllide.y == chessDot[i][1]) {
			return {'exitchessx':cllide.x,'exitchessy':cllide.y,'id':chessDot[i][2]};
		}
	}
	return false;
}
function cllisionChess(a){
	var chessObj,len =chessDot.length;;
	for (i = 0; i < len; i++) {
		if (chessDot[i][2] != authval) {
			continue;
		}
		chessObj = {'mousex':a.x,'mousey':a.y,'dotx':chessDot[i][0],'doty':chessDot[i][1],'id':chessDot[i][2],'r':rad};
		if (checkCllision(chessObj)) {
			whichChess = i;
			chessObj.isCollide = true;
			return chessObj;
		}
	}
	return {'i':whichChess};
}
function cllisionDot(a){
	var chessObj;
	for (i = 0; i < 4; i++) {
		for(j = 0; j< 4; j++){
			chessObj = {'mousex':a.x,'mousey':a.y,'dotx':mapDot[i],'doty':mapDot[j],'r':rad};
			if(checkCllision(chessObj)){
				chessObj.isCollide = true;
				return chessObj;
			}
		}
	}
	return {};
}
function checkCllision(a){
	var dis,xdiff,ydiff;
	xdiff = a.mousex - a.dotx;
	ydiff = a.mousey - a.doty;
	dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
	if (dis < a.r) {
		return true;
	}
	return false;
}
function islatestDistance(a){
	var dis,xdiff,ydiff;
	xdiff = a.originx - a.dotx;
	ydiff = a.originy - a.doty;
	dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
	if (dis <= a.dis) {
		return true;
	}
	return false;
}
function getMousePos(event){
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x': x-canvas.offsetLeft, 'y': y-canvas.offsetTop };
}
function isEat(a){
	var nextx,nexty,tempx=[],tempy=[],j=0,k=0,exitchessx,exitchessy,curid;
	for (var i = 0; i < 4; i++) {
		nextx = mapDot[i];
		exitchessx = isExitChess({'x':nextx,'y':a.chessy});
		if (exitchessx){
			tempx[j] = [nextx,a.chessy,exitchessx.id];
			j++;
		}
		nexty = mapDot[i];
		exitchessy = isExitChess({'x':a.chessx,'y':nexty});
		if(exitchessy){
			tempy[k] = [a.chessx,nexty,exitchessy.id];
			k++;
		}
		if (a.chessy == nexty) {
			curid = exitchessy.id;
		}
	}
	var res = [],n=0;
	if (tempx.length ==3 ){
		if (tempx[1][0]-tempx[0][0] == tempx[2][0] - tempx[1][0] ) {
			if(tempx[0][2] == tempx[1][2] && tempx[1][2] != tempx[2][2] && curid == tempx[1][2]){
				// return tempx[2];
				res[n] = tempx[2];
				n+=1;
			}
			if (tempx[2][2] == tempx[1][2] && tempx[1][2] != tempx[0][2] && curid == tempx[1][2]) {
				// return tempx[0];
				res[n] = tempx[0];
				n+=1;
			}
		}
	}
	if (tempy.length == 3){
		if (tempy[1][1]-tempy[0][1] == tempy[2][1] - tempy[1][1] ) {
			if(tempy[0][2] == tempy[1][2] && tempy[1][2] != tempy[2][2] && curid == tempy[1][2]){
				// return tempy[2];
				res[n] = tempy[2];
				n+=1;
			}
			if (tempy[2][2] == tempy[1][2] && tempy[1][2] != tempy[0][2] && curid == tempy[1][2]) {
				// return tempy[0];
				res[n] = tempy[0];
				n+=1;
			}
		}
	}

	return res;	
}
function removeChess(a){
	// var len =chessDot.length;
	for (var i = 0; i < chessDot.length; i++) {
		if (a.x == chessDot[i][0] && a.y == chessDot[i][1]) {
			chessDot.splice(i,1);
		}
	}
}
run();