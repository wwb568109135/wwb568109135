// udpClient.js

var dgram = require('dgram');

var client = dgram.createSocket('udp4');

client.bind(function() {
    client.setBroadcast(true);
});

var message = new Buffer('hello shiyanlou');

var messages = [
    'Hello, Echo Server.',
    'Are you OK?',
    'I am happy.',
    'A little panda found a pumpkin.'
];

function set_messages() {
    console.log()
    var request_url =
        "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=100";
    var request = require('request');
    request(request_url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(typeof body) // 打印google首页
            var data = JSON.parse(body) // 打印google首页
            console.log(data.subjects.length) // 打印google首页
            for (var i = 0; i < data.subjects.length; i++) {
                messages.push(
                    new Buffer("热门电影名称：" + data.subjects[i]
                        ["title"]))
            }

        }
        console.log(message)
    })
}
setInterval(function() {
    set_messages()
}, 1000 * 60)

var index = 0;

function sendMsg() { //send to server
    var msg = messages[index];
    index = index + 1;
    if (index == messages.length) {
        index = 0;
    }
    client.send(msg, 0, msg.length, 41234,
        "localhost");
}

setInterval(sendMsg, 1000);
set_messages()

// client.send(message, 0, message.length, 41234, 'localhost', function(err, bytes) {
//     client.close();
// });
