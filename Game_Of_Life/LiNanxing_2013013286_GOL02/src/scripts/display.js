var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

function redraw(){
	lives = 0;
	ctx.clearRect(0, 0, width * scale,height * scale);
	for(i = 0; i < width; i++){
		for (j = 0; j < height; j++){
			if(map[i][j] == 1){
				lives += map[i][j];
				ctx.fillStyle = "#000";
				ctx.fillRect(i * scale, j * scale, scale, scale);
			}else if(map[i][j] == -1){
				ctx.fillStyle = "#33a";
				ctx.fillRect(i * scale, j * scale, scale, scale);
			}else{
				ctx.strokeRect(i * scale, j * scale, scale, scale);
			}
		}
	}
}

function refresh() {
	redraw();
	if(flag == 1)
		grow();
	setTimeout("refresh()", refreshRate);
	$(".livecells")[0].innerHTML= String(lives);
}

function drawMap(x, y){
	ctx.clearRect(0, 0, 700, 700);
	width = x;
	height = y;
	for(i = 0; i < width; i++)
		for(j = 0; j < height; j++)
			ctx.strokeRect(i * scale, j * scale, scale, scale);
}

drawMap(width, height);

function continueGrow(){
	if(flag == 0){
		flag = 1;
		redraw();
	}
}

function pauseGrow(){
	flag = 0;
}

function getPointOnCanvas(canvas, x, y) {
	var canvasRect =canvas.getBoundingClientRect();
	return {x:x - canvasRect.left * (canvas.width / canvasRect.width),
			y:y - canvasRect.top * (canvas.height / canvasRect.height)};
}

canvas.onmousedown = function(e){
	var mouse = getPointOnCanvas(canvas, e.pageX, e.pageY);
	var x, y;
	x = parseInt(mouse.x / scale);
	y = parseInt(mouse.y / scale);
	if(map[x][y] != -1)
		map[x][y] = -1;
	else if(map[x][y] == -1)
		map[x][y] = 0;
	redraw();
}

refresh();
initializeMap(width, height, rate);

function generate(){
	var widthValue = document.getElementById("width").value;
	if (isNaN(widthValue)) {
		alert("输入异常1");
		return;
	}
	if(widthValue.indexOf(".") > 0 ){
		alert("类型异常1");
		return;
	}
	if ((parseInt(widthValue) < 5) || (parseInt(widthValue) > 100)){
		alert("超出范围1");
		return;
	}
	width = parseInt(widthValue);

	var heightValue = document.getElementById("height").value;
	if (isNaN(heightValue)) {
		alert("输入异常2");
		return;
	}
	if(heightValue.indexOf(".") > 0 ){
		alert("类型异常2");
		return;
	}
	if ((parseInt(heightValue) < 5) || (parseInt(heightValue) > 100)){
		alert("超出范围2");
		return;
	}
	height = parseInt(heightValue);

	var rateValue = document.getElementById("rate").value;
	if (isNaN(rateValue)) {
		alert("输入异常3");
		return;
	}
	if ((parseFloat(rateValue) < 0) || (parseFloat(rateValue) > 1)){
		alert("超出范围3");
		return;
	}
	rate = parseFloat(rateValue);

	var refreshRateValue = document.getElementById("refreshRate").value;
	if (isNaN(refreshRateValue)) {
		alert("输入异常4");
		return;
	}
	if(refreshRateValue.indexOf(".") > 0 ){
		alert("类型异常4");
		return;
	}
	if ((parseInt(refreshRateValue) < 1) || (parseInt(refreshRateValue) > 30)){
		alert("超出范围4");
		return;
	}
	refreshRate = parseInt(1000 / parseInt(refreshRateValue));
	scale = 700 / Math.max(width, height)
	drawMap(width, height);
	initializeMap(width, height, rate);
}