//获取服务器
var ref = new Firebase("https://blistering-inferno-2915.firebaseIO.com");
refMessages = ref.child("chat");
refUsers = ref.child("users");

//全局变量 用户名 在线用户列表 最后一个发言的人
var name;
var userList;
var lastSpeaker = "";

//发消息
function sendMessage(e) {
	if (e.keyCode == 13) {
		if(name == ""){
			alert("Login first");
			return;
		}
		var username = name;
		var message = $("#input").val();
		if(message == ""){
			alert("Blank messages are not allowed");
			return;
		}
		console.log("message sent: " + message);
		$("#input").val("");
		refMessages.push({name: username, text: message});
	}
}

//设定昵称
function setName(e) {
	if (e.keyCode == 13) {
		var inputName = $("#nickName").val();
		console.log("input: " + inputName);
		if(inputName == ""){
			alert("Blank usernames are not allowed");
			return;
		}else if(inputName.length > 8){
			alert("Maximum length 8 characters");
			return;
		}else{
			logOut();
		}
		for(x in userList){
			if(userList[x].name == inputName){
				alert("Exsiting username");
				return;
			}
		}
		name = inputName;
		$("#userName").text(name + ": ");
		refUsers.push({name: name});
		nickNameDisappear();
	}
}

//登出
function logOut(){
	if(name == ""){
		return;
	}
	for(x in userList){
		if(userList[x].name == name){
			refUsers.child(x).remove();
		}
	}
	name = "";
	nickNameDisplay();
}

//弹出对话框
function nickNameDisplay(){
	$("#block").fadeIn("fast");
	$("#nickNameWindow").fadeIn("fast");
	$("#body").attr("class", "blurBody");
}

//隐藏对话框
function nickNameDisappear(){
	$("#block").fadeOut("fast");
	$("#nickNameWindow").fadeOut("fast");
	$("#body").attr("class", "body");
}

//退出时候自动登出
window.onbeforeunload = function(){
	logOut();
};

//获取新消息
refMessages.limitToLast(20).on('child_added', function (snapshot) {
	var data = snapshot.val();
	var message = $("<li class='chatText'></li>");
	var name = $("<li class='userName'></li>");
	name.text(data.name);
	message.text(data.text);
	if(data.name != lastSpeaker){ //避免重复显示用户名
		$("#display").append(name);
	}
	lastSpeaker = data.name;
	$("#display").append(message);
	console.log("received:" + message);
	$("#display")[0].scrollTop = $("#display")[0].scrollHeight;
});

//随时更新用户列表
refUsers.on('value', function (data) {
	userList = data.val();
	$("#userList").html("");
	for(x in userList){
		var nameElement = $("<li><span class='userName'></span></li>");
		nameElement.text(userList[x].name);
		console.log("id: " + x);
		$("#userList").append(nameElement);
		console.log("user:" + userList[x].name);
	}
});