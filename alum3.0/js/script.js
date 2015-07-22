var score = 0;	//分数
var multiplier = 1;	//倍率
var combo = 0;	//连击
var maxCombo = 0;	//最大连击
var offset;	//音频偏移
var currentTime;	//网页运行时间
var accuracy = 1;	//
var noteValid = new Array(false, false, false, false, false, false, false);	//判定
var superNoteValid = new Array(false, false, false, false, false, false, false);	//超级音符判定
var noteList;	//音符列表
var startTime;	//记录游戏开始时间
var jsonReady = false;
var audioReady = false;
var notes = new Array();	//屏幕音符坐标
var currentNote = 0;	//当前音符
var explodeImg = new Array();	//特效图片/位置/帧数信息
var explodeEffect = new Array();
var missEffect = new Array();
var missImg = new Array();
var ifSupNote = false;	//是否该生成超级音符
var endFlag = true;	//是否结束
var missNotes = 0;	//错误音符
var correctNotes = 0;	//正确音符 用于计算正确率
var audio = document.getElementById("audio");
var noteImg = document.createElement("img");
var supNoteImg = document.createElement("img");
var background = document.createElement("img");
var foreground = document.createElement("img");
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
var hit = $("<div>");
var infoZone = $("<div>");
var resultPage = $("<div>");
var restart = $("<button>");
var showMulti = $("<p>");
var showAccuracy = $("<p>");
var showScore = $("<p>");

restart.click(function(){
	location.reload();
});

(function init(){	//初始化
	$.getJSON("tabs/alum.json", function(data) {	//读取音符数据 小节顺序排列 记录音符位置与其在小节中的拍数
		noteList = data;
		jsonReady = true;
	});
	$(hit).appendTo(document.body);	//加载各种元素 排列位置
	showMulti.attr("class","multiZone");
	resultPage.attr("class","resultPage");
	infoZone.attr("class","infoZone").appendTo(document.body);
	showMulti.appendTo($(".infoZone"));
	showScore.attr("class","scoreZone");
	showScore.appendTo($(".infoZone"));
	$("<hr>").appendTo($(".infoZone"));
	showAccuracy.attr("class","accuracyZone");
	showAccuracy.appendTo($(".infoZone"));
	canvas.id = "canvas";
	background.className = "background";
	foreground.className = "foreground";
	foreground.src = "images/ground/Foreground1.png";
	background.src = "images/ground/Background1.png";
	noteImg.src = "images/note.png";
	supNoteImg.src = "images/noteSuper.png";
	canvas.width = 500;
	canvas.height = 620;
	document.body.appendChild(canvas);
	document.body.appendChild(background);
	document.body.appendChild(foreground);
	for(var i = 1; i <9 ;i++)
	{
		missImg[i] = document.createElement("img");
		missImg[i].src = "images/miss/miss000" + i +".png";
		missImg[0] = null 
	}
	for(i = 1; i < 7; i++){
		missEffect[i] = 0;
	}
	for(var i = 1; i <10 ;i++)
	{
		explodeImg[i] = document.createElement("img");
		explodeImg[i].src = "images/Explode/hit000" + i +".png";
		explodeImg[0] = null 
	}
	for(i = 1; i < 7; i++){
		explodeEffect[i] = 0;
	}
})();

audio.addEventListener('canplaythrough', function(){
	audioReady = true;
});

$("#begin").click(function(){	//开始游戏
	if(jsonReady == false)
	{
		alert("cannot open jsonFile");
	}
	if(audioReady == false)
	{
		alert("cannot open audioFile");
	}
	if(jsonReady && audioReady){
		endFlag = false;
		$("#begin").fadeOut(300);
		$(".infoZone").fadeIn(300);
		$(".background").animate({opacity:'1'},500);
		$(".foreground").animate({opacity:'1'},500);
		var dateElem = new Date();
		startTime = dateElem.getTime();
		startPlay(noteList, 0);
		refreshCanvas();
		setTimeout(function(){audio.play();}, 600);
		showScore.html(score)
		showAccuracy.html(accuracy.toPercent());
		showMulti.html("x" + multiplier);
	}
});

function refreshCanvas(){	//绘制函数
	context.clearRect(0, 0, 500, 620);
	for(x = currentNote; x < notes.length; x++){
		if(notes[x].y <= 620){	//绘制音符
			if(notes[x].type == 0){	//绘制正常音符
				context.drawImage(noteImg,notes[x].x, notes[x].y);
				notes[x].y += 25;
			}else{	//绘制超级音符
				context.drawImage(supNoteImg,notes[x].x, notes[x].y);
				notes[x].y += 25;
			}
		}
		else{	//将已出现音符进行标记
			currentNote = x;
		}
	}
	for(x = 1; x < 7; x++){	//绘制音符击中特效
		if(explodeEffect[x] != 0){
			context.drawImage(explodeImg[explodeEffect[x]], x * 70 - 95.5, -110);
			explodeEffect[x]++;
			if(explodeEffect[x] > 9){
				explodeEffect[x] = 0;
			}
		}
	}
	for(x = 1; x < 7; x++){	//绘制失误特效
		if(missEffect[x] != 0){
			context.drawImage(missImg[missEffect[x]], x * 70 - 303.5, 170);
			missEffect[x]++;
			if(missEffect[x] > 8){
				missEffect[x] = 0;
			}
		}
	}
	if (endFlag == false) {setTimeout(function(){refreshCanvas()}, 20);};	//20ms后进行下一帧绘制
}

function fall(noteZone){
	if(ifSupNote == true){	//生成超级音符
		notes.push({"type": 1, "x": noteZone * 70 - 60, "y": -251});
		ifSupNote = false;
		setTimeout("superNoteValid[" + noteZone + "] = true", 420);
		setTimeout("superNoteValid[" + noteZone + "] = false", 580);
	}else{	//生成正常音符
		notes.push({"type": 0, "x": noteZone * 70 - 60, "y": -251});
	}
}

function startPlay(noteList, bar){	//生成音符函数
	if(bar >= noteList.bars.length){
		if(bar >= noteList.bars.length + 2){
			endFlag = true;
			showResults();
			return;
		}
	}else{
		var dateElem = new Date();
		currentTime = dateElem.getTime();
		offset = currentTime - startTime - (audio.currentTime * 1000) - 600;	//音频延迟修正
		for(x in noteList.bars[bar].notes){	//生成音符和对应判定
			setTimeout("fall(" + noteList.bars[bar].notes[x].note + ")", (noteList.bars[bar].notes[x].time) * 1000 * 2 / 3 - 500 + offset - 180);
			setTimeout("noteValid[" + noteList.bars[bar].notes[x].note + "] = true", (noteList.bars[bar].notes[x].time) * 1000 * 2 / 3 - 120 + offset - 100);
			setTimeout("if(noteValid[" + noteList.bars[bar].notes[x].note + "]== true){noteValid[" + noteList.bars[bar].notes[x].note + "] = false; miss(" + noteList.bars[bar].notes[x].note + ");}", (noteList.bars[bar].notes[x].time) * 1000 * 2 / 3 + 120 + offset - 100);
		}
	}
	if(bar % 3 == 0){	//模3修正
		setTimeout(function(){startPlay(noteList, bar + 1);}, 2666);
	}
	else{
		setTimeout(function(){startPlay(noteList, bar + 1);}, 2667);
	}
}

Number.prototype.toPercent = function(){
	return (Math.round(this * 10000)/100).toFixed(2) + '%';
}

function explode(x){	//击中
	combo++;
	if(combo > maxCombo)
	{
		maxCombo = combo;
	}
	correctNotes++;
	if(combo % 10 == 0){	//每10个+1倍率
		multiplier++;
	}
	if(superNoteValid[x]){	//击中超级音符+1倍率
		multiplier++;
	}
	score += multiplier * 50;
	if(combo % 13 == 0){
		ifSupNote = true;
	}
	showScore.html(score);
	hitEffect(true, combo);
	noteValid[x] = false;
	explodeEffect[x] = 1;
	accuracy = correctNotes / (correctNotes + missNotes);	//刷新计分区域
	showAccuracy.html(accuracy.toPercent());
	showMulti.html("x" + multiplier);
}

function miss(x){	//失误
	missEffect[x] = 1;
	hitEffect(false, 0);
	combo = 0;
	multiplier = 1;
	missNotes++;
	showScore.html(score);
	accuracy = correctNotes / (correctNotes + missNotes);
	showAccuracy.html(accuracy.toPercent());
	showMulti.html("x" + multiplier);
}

document.onkeydown = function(e){	//按键判定
	if(endFlag == false){
		if(e.keyCode == 83){
			if(noteValid[1] == true){
				explode(1);
			}
			else{
				miss(1);
			}
		}
		if(e.keyCode == 68){
			if(noteValid[2] == true){
				explode(2);
			}
			else{
				miss(2);
			}
		}
		if(e.keyCode == 70){
			if(noteValid[3] == true){
				explode(3);
			}
			else{
				miss(3);
			}
		}
		if(e.keyCode == 74){
			if(noteValid[4] == true){
				explode(4);
			}
			else{
				miss(4);
			}
		}
		if(e.keyCode == 75){
			if(noteValid[5] == true){
				explode(5);
			}
			else{
				miss(5);
			}
		}
		if(e.keyCode == 76){
			if(noteValid[6] == true){
				explode(6);
			}
			else{
				miss(6);
			}
		}
	}
}

function hitEffect(hitFlag, hitTimes){	//特效 true为击中 false为失误
	if(hitFlag == true)
	{
		hit.attr("class","hitNeon");
		hit.html(hitTimes);
	}
	else
	{
		hit.attr("class","missNeon");
		hit.html("X");
	}
	hit.stop(true, true);
	hit.show();
	hit.fadeOut();
}

function showResults(){	//结果显示
	resultPage.html("");
	var finalScore = $("<p>");
	finalScore.html(score);
	finalScore.attr("class", "finalScore");
	finalScore.appendTo(resultPage);
	var finalAccuracy = $("<p>");
	finalAccuracy.html(accuracy.toPercent());
	finalAccuracy.attr("class", "finalAccuracy");
	finalAccuracy.appendTo(resultPage);
	var finalMaxCombo = $("<p>");
	finalMaxCombo.html("Max. C: " + maxCombo);
	finalMaxCombo.attr("class", "finalMaxCombo");
	finalMaxCombo.appendTo(resultPage);
	restart.attr("class", "restart");
	restart.html("restart");
	restart.appendTo(resultPage);
	resultPage.appendTo(document.body);
	$(".background").animate({opacity:'0.5'}, 500);
	$(".foreground").animate({opacity:'0.5'}, 500);
	infoZone.fadeOut();
	resultPage.fadeIn();
}