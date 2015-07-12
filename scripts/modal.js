var block = document.getElementById("block");
block.style.width = document.documentElement.clientWidth + "px";
block.style.height = document.documentElement.clientHeight + "px";
block.style.opacity = 0.5;
var modal = document.getElementById("modal");
modal.closeKey = 27;
modal.draggable = true;
modal.style.left = ((document.body.clientWidth + document.documentElement.clientWidth - 100) / 4) + "px";
modal.style.top = ((document.body.clientHeight + document.documentElement.clientHeight) / 4) + "px";
modal.init = function(arg){
	if(typeof (arg.content) != "undefined"){
		document.getElementById("modalContent").innerHTML = arg.content;
	}
	if(typeof (arg.draggable) != "undefined"){
		modal.draggable = arg.draggable;
	}
	if(typeof (arg.closeKey) != "undefined"){
		modal.closeKey = arg.closeKey;
	}
}
function myClickFunc(){
	modal.style.opacity = 0;
	block.style.opacity = 0;
	block.style.width = 0;
	modal.style.width = 0;
}
function myKeyFunc(event){
	if(event.keyCode == modal.closeKey){
		modal.style.opacity = 0;
		block.style.opacity = 0;
		block.style.width = 0;
		modal.style.width = 0;
	}
}
modal.onmousedown = function(event){
	if(modal.draggable == true)
	{
		var disX = event.clientX - modal.offsetLeft;
		var disY = event.clientY - modal.offsetTop;
		document.onmousemove = function(event){
			var left = event.clientX - disX;
			var top = event.clientY - disY;
			modal.style.left = left + "px";
			modal.style.top = top + "px";
		}
		document.onmouseup = function(){
			document.onmouseup = null;
			document.onmousemove = null;
		}
		return false;
	}
}