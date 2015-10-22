var lives = 0;
var scale = 7;
var width = 100, height = 100;
var map = new Array(100);
var tempMap = new Array(100);
var refreshRate = 100;
var rate = 0.5;
var flag = 0;
for (i = 0; i < 100; i++) {
	map[i] = new Array(100);
	tempMap[i] = new Array(100);
}
function getNeighbour(i, j){
	var num = 0;
	for(y = j - 2; y <= j + 2; y++){
		if(y < 0){
			if(map[i][y + height] == 1){
				num += 1;
			}
		}
		else if(y >= height){
			if(map[i][y - height] == 1){
				num += 1;
			}
		}
		else if(map[i][y] == 1)
			num += 1;
	}
	for(x = i - 2; x <= i + 2; x++){
		if(x < 0){
			if(map[x + width][j] == 1){
				num += 1;
			}
		}
		else if(x >= width){
			if(map[x - width][j] == 1){
				num += 1;
			}
		}
		else if(map[x][j] == 1)
			num += 1;
	}
	num -= map[i][j];
	num -= map[i][j];
	return num;
}
function grow(){
	for(i = 0; i < width; i++){
		for(j = 0; j < height; j++){
			tempMap[i][j] = map[i][j];
			if(tempMap[i][j] != -1){
				if(getNeighbour(i, j) == 3)
					tempMap[i][j] = 1;
				else if(getNeighbour(i, j) != 2)
					tempMap[i][j] = 0;
			}
		}
	}
	for(i = 0; i < width; i++){
		for(j = 0; j < height; j++){
			map[i][j] = tempMap[i][j];
		}
	}
}
function reset(){
	for(i = 0 ; i < width ; i++)
		for(j = 0 ; j < height ; j++){
			map[i][j] = 0;
		}
		flag = 0;
//		redraw();
}
function initializeMap(x, y, r) {
	flag = 0;
	width = x;
	height = y;
	rate = r;
	lives = 0;
	for (i = 0; i < width; i++)
		for (j = 0; j < height; j++)
			if(map[i][j] != -1){
				if (Math.random() < rate){
					map[i][j] = 1;
					lives += 1;
				}
				else map[i][j] = 0;
			}
//	redraw();
}

function returnWidth(){
	return width;
}

function returnHeight(){
	return height;
}

function returnRate(){
	return rate;
}

function returnLives(){
	return lives;
}

module.exports.lives = lives;
module.exports.scale = scale;
module.exports.width = width;
module.exports.height = height;
module.exports.map = map;
module.exports.tempMap = tempMap;
module.exports.refreshRate = refreshRate;
module.exports.rate = rate;
module.exports.flag = flag;

module.exports.getNeighbour = getNeighbour;
module.exports.grow = grow;
module.exports.reset = reset;
module.exports.initializeMap = initializeMap;

module.exports.returnWidth = returnWidth;
module.exports.returnHeight = returnHeight;
module.exports.returnRate = returnRate;
module.exports.returnLives = returnLives;