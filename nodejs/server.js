var http = require("http");
var url = require("url");


function start(route, handle) {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;

        console.log("Request for " + pathname + " received.");
        route(handle, pathname, response, request);

        // var postData = "";
        // request.setEncoding("utf8");
        //
        // request.addListener("data", function(postDataChunk) {
        //
        //     postData += postDataChunk;
        //
        //     console.log("Received POST data chunk '" + postDataChunk +
        //         "'.");
        //
        // });
        //
        // request.addListener("end", function() {
        //
        //     route(handle, pathname, response, postData);
        //
        // });
    }

    http.createServer(onRequest).listen(8888);
    //这里的console.log只是为了调试
    console.log("Server has started.");
}
exports.start = start;
