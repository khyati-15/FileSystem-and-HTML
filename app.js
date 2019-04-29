var http=require('http');
var url=require('url');
var fs=require('fs');
function readAndServe(path, contentType, response) 
{
  fs.readFile(path, function(error, data) {
    if (error) {
      throw error;
    }
    response.writeHead(200, {'Content-type': contentType});
    response.write(data);
    response.end();
  });
}


function readTasks(path,callback) 
{
  fs.readFile(path, function(error, contents) 
  {
    if (error) 
	{
      throw error;
    }

    var tasks;
    if (contents.length === 0) 
	{
      tasks = '';
    } 
	else 
	{
      tasks = contents;
     //console.log(tasks);
    }
    callback(tasks);
  });
}


function createTask(path,text, callback) 
{
  readTasks(path,function(tasks) 
  {
    //  console.log({ text: text });
    tasks+=( text );
     // console.log(tasks);
    writeTasks(path,tasks, callback);
  });
}

function writeTasks(path,tasks, callback) 
{
 //var tasksJSON = JSON.stringify(tasks);
 //var   tasksJSON=tasks;
   //  console.log(tasksJSON);
//tasksJSON=JSON.parse(tasksJSON);
  fs.writeFile(path, tasks, function(error) {
  if (error) 
  {
    throw error;
  }

    callback();
  });
}

function readJSONBody(request, callback) 
{
  var body = '';
  request.on('data', function(chunk) {
					 body+=chunk;
			});
//console.log(body);
  request.on('end', function() {
					var data = JSON.parse(body);
					callback(data);
          
		   });
}


http.createServer(function(request,response)
{
      var pathname = url.parse(request.url).pathname;
    if(request.method=="GET")
        {
            if (pathname === "/") {
      readAndServe('index.html', 'text/html', response);}
                else    if(pathname==="/1")
                    {
                        readAndServe('.'+pathname,'application/json',response);
                    }
                else    if(pathname==="/2")
                    {
                        readAndServe('.'+pathname,'application/json',response);
                    }
            else    if(pathname==="/3")
                    {
                        readAndServe('.'+pathname,'application/json',response);
                    }
        }
     else if (request.method === "POST") {
    if (pathname === "/1"   ||  pathname==="/2" ||  pathname==="/3") {
        var pp=pathname[1];
      readJSONBody(request, function(task) {
  //        console.log(task);
        createTask(pp,task.text, function() {
          // must wait until task is stored before returning response
          response.end();
        });
      });
    } else {
      response.end();
    }
  } 
}).listen(8000, '127.0.0.1');
console.log('Running on 127.0.0.1:8000');
