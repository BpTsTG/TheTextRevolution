fs 	= 	require("node-fs-extra");
express =	require("express");
app	=	express();
server  =	require("http").createServer(app);
io 	= 	require('socket.io').listen(server);
database=	require("nedb");
// Database
clients   = new database({ filename: 'data/clients', autoload: true });
dokuments = new database({ filename: 'data/files', autoload: true });

//Pages
var aPage={title: "House"};
var start={title: "House"};
// Routing
app.get("/", function(request, response)
{	
	response.render("home.ejs", {page: start});
	
});

app.get("/:file", function(request, response)
{	
	var fileurl = "file/"+request.params.file;
	var fileName = request.params.file;
	fs.exists(fileurl, function(exists) {
    		if (exists == false) 
		{
			console.log("file not found, make it");
			//fs.createReadStream('file/default').pipe(fs.createWriteStream(fileurl));  		
			fs.copy("file/default/", "file/"+fileName+"/", function (err) {if (err) { throw err;console.log(err); }});
			dok = {name: fileName, fileHtml:fileurl+"/html", fileCss:fileurl+"/css"}
			dokuments.insert(dok, function (err, newDoc) {});
		}

	});
	var data = fs.readFileSync(fileurl+"/html")
	response.render("base.ejs", 
		{page: {title: request.params.file} 
		,dokument: data}
	);


	
});


app.get('/css/:file', function(req, res) 
{	res.sendFile(__dirname+'/css/'+req.params.file);	});
app.get('/js/:file', function(req, res) 
{	res.sendFile(__dirname+'/js/'+req.params.file);	});


// Static
//app.use(express.static(__dirname+'/css'));
//app.use(express.directory(__dirname+'/css'));

//-Clients---
var clientlist=[];
// -------------------------------- Serveur Temps Réel ----------------------
io.sockets.on('connection', function (socket) 
{
	
	socket.on('newClient', function(client) 
{	


	console.log("nouveau client : "+client.name);
	
	socket.info=client;
	//eval(fs.readFileSync("client/"+client.name));
	clients.insert(socket.info, function (err, newDoc) {});

	
	socket.broadcast.emit('newClient', {client: client});});
	socket.on('test', function() 
{	//socket.get('client', function(client){socket.emit('test',client);});		
	socket.emit('alert', socket.info.name);		});

	socket.on('update', function(data)
{	socket.broadcast.emit('update', data);
	console.log(data.element+" - "+data.content+" - "+data.file);		
	fs.writeFile("file"+data.file+"/html", data.content, function(err){});
});


});

server.listen(8005);
