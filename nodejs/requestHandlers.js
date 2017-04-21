var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("./formidable");

function start(response) {

    console.log("Request handler 'start' was called.");

    //
    // var body = '<html>' + '<head>' +
    //
    //     '<meta http-equiv="Content-Type" content="text/html; ' +
    //
    //     'charset=UTF-8" />' +
    //
    //     '</head>' +
    //
    //     '<body>' +
    //
    //     '<form action="/upload" method="post">' +
    //
    //     '<textarea name="text" rows="20" cols="60"></textarea>' +
    //
    //     '<input type="submit" value="Submit text" />' +
    //
    //     '</form>' +
    //
    //     '</body>' +
    //
    //     '</html>';
    var body = '<html>' +

        '<head>' +

        '<meta http-equiv="Content-Type" ' +

        'content="text/html; charset=UTF-8" />' +

        '</head>' +

        '<body>' +

        '<form action="/upload" enctype="multipart/form-data" ' +

        'method="post">' +

        '<input type="file" name="upload">' +

        '<input type="submit" value="Upload file" />' +

        '</form>' +

        '</body>' +

        '</html>';
    response.writeHead(200, {
        "Content-Type": "text/html"
    });

    response.write(body);
    response.end();
}

function upload(response, request) {

    var form = new formidable.IncomingForm();
    // 实例化一个formidable.IncomingForm；
    console.log("about to parse");
    form.uploadDir = "tmp";
    // 指定上传目录

    form.parse(request, function(error, fields, files) {
        // parse负责解析文件
        console.log("parsing done");

        fs.renameSync(files.upload.path, "./tmp/test.png");
        // fs模块的renameSync进行重命名
        response.writeHead(200, {
            "Content-Type": "text/html"
        });

        response.write("received image:<br/>");

        response.write("<img src='/show' />");
        // 使用img 标签来显示图片 ，因为show方法会返回一张图片
        response.end();

    });


}

function show(response) {

    console.log("Request handler 'show' was called.");

    fs.readFile("./tmp/test.png", "binary", function(error, file) {

        if (error) {

            response.writeHead(500, {
                "Content-Type": "text/plain"
            });

            response.write(error + "\n");

            response.end();

        } else {

            response.writeHead(200, {
                "Content-Type": "image/png"
            });

            response.write(file, "binary");

            response.end();

        }

    });

}

exports.show = show;

exports.start = start;

exports.upload = upload;
