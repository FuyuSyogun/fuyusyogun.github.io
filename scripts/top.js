var BackToTop = document.getElementById('BackToTop');

BackToTop.init = function myInit(arg){
	if(arg.LeftUp == true){
		BackToTop.style.left = "10px";
		BackToTop.style.top = "10px";
	}
	else if(arg.LeftDown == true){
		BackToTop.style.left = "10px";
		BackToTop.style.bottom = "10px";
	}
	else if(arg.RightUp == true){
		BackToTop.style.right = "10px";
		BackToTop.style.top = "10px";
	}
	else if(arg.RightDown == true){
		BackToTop.style.right = "10px";
		BackToTop.style.bottom = "10px";
	}
	else{
		BackToTop.style.left = (arg.x) + "px";
		BackToTop.style.top = (arg.y) + "px";
	}
}

BackToTop.init({RightUp: true});


var Top = document.documentElement.scrollTop + document.body.scrollTop;
if(Top == 0){
	BackToTop.style.opacity = 0;
}
else{
	BackToTop.style.opacity = 1;
}

window.onscroll = function(){ 
	var Top = document.documentElement.scrollTop + document.body.scrollTop;
	if(Top == 0){
		BackToTop.style.opacity = 0;
	}
	else{
		BackToTop.style.opacity = 1;
	}
}

function myScrollToTop(){
	window.scrollBy(0, -50);
	var scrolldelay = setTimeout('myScrollToTop()',10);
	var Top = document.documentElement.scrollTop + document.body.scrollTop;
	if(Top == 0){
		clearTimeout(scrolldelay);
	}
}

function myKeyFunc(event){
	if(event.keyCode == 66){
		myScrollToTop();
	}
}