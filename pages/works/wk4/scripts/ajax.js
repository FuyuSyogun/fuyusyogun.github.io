var picLoaded = 0;
var piclist = new Array();

(function ReadList(){
	$.getJSON("pics.json", function(json){
		for(x in json.piclist){
			piclist[x] = {
				"src": json.piclist[x].src,
				"description": json.piclist[x].description
			};
		}
	AddLi("ul1");
	AdjustUl();
	});
})();

function AddLi(elemName) {
	var picId = (++picLoaded) % 4;
	var mySrc = piclist[picId].src;
	var myDescription = piclist[picId].description;
	document.getElementById(elemName).innerHTML += ('<li class="pic-item" id=pic' + picLoaded + '><img src="images/mini' + mySrc + '"><div class="info"><div class="tool"></div><p class="desc">' + myDescription + '</p></div></li>');
	var thisPic = $("#pic" + picLoaded);
	thisPic.hide();
	thisPic.fadeIn({fail: function(){alert("fuck!");this.show();}});
}

function AdjustUl() {
	var ulelem = new Array(), mostHeight = 0;
	for (i = 0; i < 4; ++i) {
		ulelem[i] = document.getElementById(("ul") + (i + 1));
		if (ulelem[i].clientHeight > mostHeight) {
			mostHeight = ulelem[i].clientHeight;
		}
	}
	for (i = 0; i < 4; ++i) {
		while (ulelem[i].clientHeight < mostHeight) {
			AddLi("ul" + (i + 1));
		}
	}
	document.getElementById("maintext").style.height = mostHeight + 250 + "px";
}

window.onscroll = function () {
	var scrollT = document.documentElement.scrollTop||document.body.scrollTop;
	var scrollH = document.documentElement.scrollHeight||document.body.scrollHeight;
	var clientH = document.documentElement.clientHeight||document.body.clientHeight;
	if (scrollT >= scrollH - clientH - 300) {
		AddLi("ul1");
		AdjustUl();
	}
}