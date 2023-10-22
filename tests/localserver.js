var easynodes = require('easynodes');

easynodes.init();

easynodes.http.newServer(function(request){
    var url = request.url;
    if (url === "/") {
        url = "/index.html";
    }
    var currentPath = "/home/vscode/Packetgun/tests";
    if (easynodes.files.exists.sync(currentPath + url)){
        var filetype;
        if (url.endsWith(".html")) {
            filetype = "text/html";
        }
        else{
            if (url.endsWith(".js")) {
                filetype = "text/javascript";
            }
        }
        request.end(`${easynodes.files.read.sync(currentPath + url)}`, 200, {"Content-Type": filetype, "Access-Control-Allow-Origin": "*"});
    }
    else{
        request.end("404", 404, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
    }
}, 1234);