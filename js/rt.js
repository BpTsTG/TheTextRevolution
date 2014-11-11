//-Function---
function newClient()
{
	$().append();
}

function addDok(name)
{
	var dok="<div class='dokbox' contenteditable='true'>"+
		"<div class='dokument' id="+name+"></div>"+	
		"</div>";	
	$("body").append(dok);
}


function makeCss(property, params)
{
	switch(property)
	{	
		case "padding":
		case "margin":
		case "letter-spacing":
		case "font-size":
			return params.val+params.unit;	
			break;
		case "color":
		case "background-color":
			return params.val;	
			break;
		case "background":
			return "url(\"" + params.val + "\")";
			break;
		case "text-align":
			return params.val;
			break;
		case "text-shadow":
			return params.shadowx+params.unit+" "+params.shadowy+params.unit+" "+params.shadowsize+params.unit;
			break;


		default:
		break;
	}
}
//-Globals Vars----------------------------------------------------------------------------------
clientInfo={name:Math.round(Math.random(100)*10)*Math.random(10)};
var clientlist = [clientInfo];
//var CssParser = new CSSParser();

var stylebox={};
var idcssbind={};
idcssbind["dokstyle_fontcolor"]="color";
idcssbind["dokstyle_fontsize"]="font-size";
idcssbind["dokstyle_fontfamily"]="font-family";
idcssbind["dokstyle_letterspacing"]="letter-spacing";
idcssbind["dokstyle_margin"]="margin";
idcssbind["dokstyle_padding"]="padding";
idcssbind["dokstyle_backgroundcolor"]="background-color";
idcssbind["dokstyle_backgroundimage"]="background";
idcssbind["dokstyle_"]="";
idcssbind["dokstyle_textalign"]="text-align";

//-NewClient-------------------------------------------------------------------------------------
var socket = io.connect('http://localhost:8005/');


socket.emit("newClient", clientInfo);


//-File------------------------------------------------------------------------------------------
var file=window.location.pathname;
console.log(file);
//-Test------------------------------------------------------------------------------------------
var list= [1,2,{name:"Robert"}];

list[list[2].name]={name:"huh"};
console.log(list["Robert"].name);
console.log(list.length);
//-Signals---------------------------------------------------------------------------------------
socket.on('newClient', function(res)
{	
	console.log("new name : "+res.client.name);
	alert(res.client.name+ " s'est connecté ! - list: "+res.list[0].info.name);
});

socket.on('alert',  function(msg){alert(msg);});

socket.on('update', function(data)
{
	$(".dokument").html(data.content);
	console.log(" - "+data.content);
});

//socket.emit("signal", "data");
//socket.on('signal', function(msg){});



//-Button----------------------------------------------------------------------------------------
$(function(){
		$("#showcontainer").click(function()
	{	$(".dokument *").addClass("show");  	});

		$(".updatename").click(function()
	{	
		clientInfo.name=$("#clientname").val();
		socket.emit("newClient", clientInfo);	});
	
	$("button#test").click(function()
	{	alert();socket.emit("test");	});
	$(".addcontainer").click(function()
	{	$(".dokument").append("<div class=\"container\"></div>");	});



	$(".dokument").keydown(function()
	{
	
		socket.emit('update', {content: $(".dokument").html(), element: $(".dokument"), file: file});});
		console.log("data edited !");
	$(".container").attr("draggable", "true");	
	$(".container").click(function(){
	
		console.log($(this).attr("id"));
		$(this).toggleClass("selected");
	});	

	$("input").change(function()
	{
		var id = $(this).attr("id");
		var cssName= idcssbind[id];
		var value=$(this).val();
		stylebox[cssName]=makeCss(cssName, {val:value, unit:"px"});
		$(".selected").css(cssName, stylebox[cssName]);
		console.log(cssName+": "+stylebox[cssName]+";");
	});


});
