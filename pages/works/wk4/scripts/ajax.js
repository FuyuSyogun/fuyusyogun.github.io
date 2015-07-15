var picLoaded = 0;
var piclist = new Array();
var picOn = false;
var picNumber = 20;
var currentPicId = 0;
var supportPosition = true;
var currentPosition = {x: 0, y: 0};

$.ajaxSetup({error: function (x, e){
	alert(e);
}});

(function Init(){
	$.getJSON("jsons/pics.json", function(json){
		for(x in json.piclist){
			piclist[x] = {
				"src": json.piclist[x].src,
				"description": json.piclist[x].description
			};
		}
		addEle("ul1");
		reUl();
		addEle("ul1");
		reUl();
		addEle("ul1");
		reUl();
		addEle("ul1");
		reUl();
	});
})();

function addEle(liName) {
	var picId = (++picLoaded) % picNumber;
	var mySrc = piclist[picId].src;
	var myDescription = piclist[picId].description;
	var newNode = document.createElement('li');
	newNode.setAttribute("class", "pic-item");
	newNode.setAttribute("id", "pic" + picLoaded);
	newNode.innerHTML = '<a href="#"; onClick = "displayPic(' + picId + '); return false;"><img src="images/s' + mySrc + '";/></a><div><p class="descrip">' + myDescription + '</p></div>';
	$("#" + liName).append(newNode);
	$(newNode).hide();
	$(newNode).fadeIn();
	$(newNode).hover(function(){$(newNode).animate({'opacity': 0.5}, 100);}, function(){$(newNode).animate({'opacity': 1}, 100);});
}

function reUl() {
	var uls = new Array(), heightMax = 0;
	for (i = 0; i < 4; ++i) {
		uls[i] = document.getElementById(("ul") + (i + 1));
		if (uls[i].clientHeight > heightMax) {
			heightMax = uls[i].clientHeight;
		}
	}
	for (i = 0; i < 4; ++i) {
		while (uls[i].clientHeight < heightMax) {
			addEle("ul" + (i + 1));
		}
	}
	document.getElementById("maintext").style.height = heightMax + 250 + "px";
}

window.onscroll = function () {
	var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
	var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
	var clientHeight = document.documentElement.clientHeight||document.body.clientHeight;
	if (scrollTop >= scrollHeight - clientHeight - 500) {
		addEle("ul1");
		reUl();
	}
}

var block = document.getElementById("block");
block.style.width = document.documentElement.clientWidth + "px";
block.style.height = document.documentElement.clientHeight + "px";
block.style.opacity = 0.5;
var modal = document.getElementById("modal");
modal.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
modal.style.top = ((document.documentElement.clientHeight - 500) / 2) + "px";
var modalBlock = document.getElementById("modalBlock");
modalBlock.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
modalBlock.style.top = ((document.documentElement.clientHeight - 500) / 2) + "px";
var body = document.getElementById("bodyM");
var detailpic = document.getElementById("detailpic");

function disappear(){
	modal.style.left = 0;
	modal.style.opacity = 0;
	block.style.opacity = 0;
	modalBlock.style.opacity = 0;
	modalBlock.style.width = 0;
	modalBlock.style.left = 0;
	block.style.width = 0;
	modal.style.width = 0;
	picOn = false;
	currentPicId = 0;
	body.style.filter = "";
	body.setAttribute("class", "");
};

(function getLocation(){
	if(navigator.geolocation)
	{
		supportPosition = true;
		navigator.geolocation.getCurrentPosition(position, error);
	}else{
		supportPosition = false;
	}
})();

function position(position){
	currentPosition.x = position.coords.latitude;
	currentPosition.y = position.coords.longitude;
}

function error(error){
	switch(error.code) {
		case error.PERMISSION_DENIED:
		console.log("PERMISSION_DENIED");
		break;
		case error.POSITION_UNAVAILABLE:
		console.log("POSITION_UNAVAILABLE");
		break;
		case error.TIMEOUT:
		console.log("TIMEOUT");
		break;
		case error.UNKNOWN_ERROR:
		console.log("UNKNOWN_ERROR");
		break;
	}
}

disappear();

var earthR = 6378137.00;

function getRad(d){
	return d*Math.PI/180.0;
}

function getGreatCircleDistance(lat1,lng1,lat2,lng2){
	var rLat1 = getRad(lat1);
	var rLat2 = getRad(lat2);
	var a = rLat1 - rLat2;
	var b = getRad(lng1) - getRad(lng2);
	var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(rLat1)*Math.cos(rLat2)*Math.pow(Math.sin(b/2),2)));
	s = s*earthR;
	s = Math.round(s*10000)/10000.0;
	s = s / 1000.0;
	return s;
} 

function displayPic(picId){
	modal.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
	modalBlock.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
	currentPicId = picId;
	picOn = true;
	modal.style.opacity = 1;
	modalBlock.style.opacity = 1;
	block.style.opacity = 0.5;
	block.style.width = document.documentElement.clientWidth + "px";
	modal.style.width = 300 + "px";
	modalBlock.style.width = 300 + "px";
	body.style.filter = "blur(2px)";
	body.setAttribute("class", "blur");
	detailpic.innerHTML = '<a href="#"; onClick = "disappear(); return false;"><img src="images/' + piclist[picId].src + '"; style = "width:95%"; id = "detailPicture"/></a><div><p class="descrip">' + piclist[picId].description + '</p></div>';
	var comments = document.getElementById("comments");
	var nomorecomments = document.getElementById("nomorecomments");
	var morecomments = document.getElementById("morecomments");
	var distance = document.getElementById("distance");
	var detailPicture = document.getElementById("detailPicture");
	var picx, picy;
	$(detailPicture).hover(function(){$(detailPicture).animate({'opacity': 0.5}, 100);}, function(){$(detailPicture).animate({'opacity': 1}, 100);});
	comments.innerHTML = "";
	distance.innerHTML = "";
	nomorecomments.innerHTML = "无法加载评论";
	morecomments.innerHTML = "";
	$.getJSON("jsons/comments.json", function(json){
		picx = json.piccomments[picId].x;
		picy = json.piccomments[picId].y;
		distance.innerHTML = "据您 " + getGreatCircleDistance(picx, picy, currentPosition.x, currentPosition.y).toFixed(0) + "km";
		if(json.piccomments[picId].comments.length == 0){
			nomorecomments.innerHTML = "无评论";
		}
		else if(json.piccomments[picId].comments.length <= 2){
			for(x in json.piccomments[picId].comments){
				var newcomment = document.createElement('li');
				newcomment.innerHTML = '<B>' + json.piccomments[picId].comments[x].username + '</B>: ' + json.piccomments[picId].comments[x].detail;
				$(comments).append(newcomment);
			}
			nomorecomments.innerHTML = "无更多评论";
		}
		else{
			for(x = 0; x < 2; x++){
				var newcomment = document.createElement('li');
				newcomment.innerHTML = '<B>' + json.piccomments[picId].comments[x].username + '</B>: ' + json.piccomments[picId].comments[x].detail;
				$(comments).append(newcomment);
			}
			nomorecomments.innerHTML = "";
			morecomments.innerHTML = "加载更多评论";
		}

		modalBlock.style.height = $(modal).height() + "px";
	});

};

window.onresize = function(){
	if(picOn){
		block.style.width = document.documentElement.clientWidth + "px";
		block.style.height = document.documentElement.clientHeight + "px";
		modal.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
		modal.style.top = ((document.documentElement.clientHeight - 500) / 2) + "px";
		modalBlock.style.left = ((document.documentElement.clientWidth - 300) / 2) + "px";
		modalBlock.style.top = ((document.documentElement.clientHeight - 500) / 2) + "px";
	}
}

function addComment(){
	$.getJSON("jsons/comments.json", function(json){
		for(x in json.piccomments[currentPicId].comments){
			if(x >= 2){
				var newcomment = document.createElement('li');
				newcomment.innerHTML = '<B>' + json.piccomments[currentPicId].comments[x].username + '</B>: ' + json.piccomments[currentPicId].comments[x].detail;
				$(comments).append(newcomment);
			}
		}
		modalBlock.style.height = $(modal).height() + "px";
		nomorecomments.innerHTML = "无更多评论";
		morecomments.innerHTML = "";
	});
}