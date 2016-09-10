// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;

// crypto 是一个可以生成散列值加密密码的模块。
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录~~~');
        res.redirect('/login');
    }
    next();
}


module.exports = function(app) {
    app.get('/', function(req, res) {
        if (req.session.isVisit) {
            req.session.isVisit++;
            console.log('<test>第 ' + req.session.isVisit +
                '次来到此页面</test>');
        } else {
            req.session.isVisit = 1;
            console.log('欢迎第一次来这里');
        }


        // 获取发表记录
        Post.get(null, function(err, posts) {
            if (err) {
                posts = [];
            }
            console.log("req.session.user:" + req.session.user)
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    // 发表业务 开始
    app.get('/post', function(req, res) {
        console.log("发表-发表-post")
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body
                .post);
        post.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');
        });
    });
    // 发表业务 结束

    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', function(req, res) {
        /*
        password_re 可以检测两次密码是否相同，
        User.get可以读取用户信息，
        newUser.save可以新增用户。
        */
        console.log("app.post('/reg'")
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];

        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });

        User.get(newUser.name, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.save(function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功，用户名：' +
                    req.session.user +
                    ' 请马上登陆！');
                res.redirect('/login');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', function(req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });
};
