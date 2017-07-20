/**
 * Created by Administrator on 2017/7/3.
 */
var formidable = require('formidable');
var ObjectID = require('mongodb').ObjectID
var operaDb = require("../model/operaDb.js");
var md5 = require("../model/md5.js");        //使用封装好的MD5加密函数
var sillytime = require("silly-datetime")
var path = require("path")
var fs = require("fs")
//首页
exports.showIndex = function (req, res, next) {
    var pageSize = 6;
    var page = 0
    var user = {};
    operaDb.finddb("user", function (err, result) {
        if(err){
            return
        }
        user = result

    })

    operaDb.finddb("comment", [pageSize, page], function (err, result, total) {
        if(err){
            next()
            return;
        }
        console.log(result)
        operaDb.finddb("discuss", function (err, dis) {

            res.render("index",{
                "loginname":req.session.username,
                "isLogin":req.session.isLogin,
                "comment":result,
                "discuss":dis,
                "total":total,
                "user":user,
                "active":"index"
            })
        })


    })


}

//注册页面
exports.showRegister = function (req, res, next) {
    res.render("register",{
        "loginname":req.session.username,
        "isLogin":req.session.isLogin,
        "active":"register"
    })
}

//登录
exports.showLogin = function (req, res) {
    res.render("login",{
        "loginname":req.session.username,
        "isLogin":req.session.isLogin,
        "active":"login"
    })
}

//退出
exports.loginOut = function (req, res) {
    delete req.session.username;
    delete req.session.isLogin ;
    res.redirect("/")
}

//注册
exports.doRegister = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
       var username = fields.username;
       var password = fields.password;
       password = md5(md5(password) + "ciyel");

       operaDb.finddb("user", {"usename":username}, function (err, result) {
           var checkMsg = {
               "success":false,
               "message":""
           };
           if(err){
               checkMsg.message = err;
               res.send(checkMsg)
               return
           }

           if(result.length !== 0){
               checkMsg.message = "该用户名已被注册";
               res.send(checkMsg)

               return
           }else{

               req.session.username = username;
               req.session.isLogin = true;
               operaDb.insertOne("user",{
                       "username":username,
                       "password":password,
                        "touxiang":""
                   },function (err, result) {

                       if(err){

                           checkMsg.message = err;
                           return
                       }else{
                           checkMsg.success = true;
                           res.send(checkMsg)
                       }
               })

           }

       })
    });
}


exports.doLogin = function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password) + "ciyel");

        operaDb.finddb("user", {"username":username}, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };
            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return
            }

            if(result.length == 0){
                checkMsg.message = "该用户不存在";
                res.send(checkMsg)

                return
            }else{

                req.session.username = username;
                req.session.isLogin = true;

                var dataPwd = result[0].password;      //数据库中的密码
                if(password == dataPwd){
                    checkMsg.success = true

                    res.send(checkMsg);  //登录成功
                }else{
                    checkMsg.message = "用户名或密码不正确！"
                    res.send(checkMsg); //密码不匹配
                }

            }

        })
    });
}

exports.doPunish = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err,fields) {
        var username = req.session.username;
        var content = fields.content;
        var time = sillytime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        operaDb.insertOne("comment",{
            "username":username,
            "content":content,
            "datetime":time
        }, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };

            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return;
            }else{
                checkMsg.success = true;
                res.send(checkMsg)
            }

        })
    })
}

exports.doPunishComment = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err,fields) {
        var discussId = fields.discussId;
        console.log(discussId)
        var content = fields.content;
        var time = sillytime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

        operaDb.insertOne("discuss",{
            "discussId":discussId,
            "content":content,
            "datetime":time,
            "username":req.session.username
        }, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };

            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return;
            }else{
                checkMsg.success = true;
                res.send(checkMsg)
            }

        })
    })
}

exports.showPersonal = function (req, res) {
    var pageSize = 6;
    var page = 0
    var username = req.params.username.split(":")[1]



    operaDb.finddb("user", {
        "username":username
    }, function (err, user) {

       operaDb.finddb("comment", {
           "username":username
       },  [pageSize, page], function (err, comment, total) {

           operaDb.finddb("discuss", function (err, dis) {

               res.render("personal",{

                   "username":username,
                   "user":user,
                   "loginname":req.session.username,
                   "isLogin":req.session.isLogin,
                   "comment":comment,
                   "discuss":dis,
                   "total":total,
                   "pageNum": Math.ceil(total / pageSize),
                   "active":"personal"

               })
           })
       })
    })
}

exports.showMoodList = function (req, res) {
    var pageSize = 6;
    var page = 0
    var user = {}
    operaDb.finddb("user", function (err, result) {
        if(err){
            return
        }
        user = result

    })

    operaDb.finddb("comment", [pageSize, page],function (err, result, total) {
        if(err){
            return;
        }

        operaDb.finddb("discuss", function (err, dis) {

            res.render("moodList",{
                "loginname":req.session.username,
                "isLogin":req.session.isLogin,
                "comment":result,
                "discuss":dis,
                "total":total,
                "pageNum": Math.ceil(total / pageSize),
                "user":user,
                "active":"index"
            })
        })


    })
}

exports.showInfoPage = function (req, res, next) {
    var page = req.params.pageNum.split("=")[1] -1;
    var pageSize = 6;
    var user = {};
    operaDb.finddb("user", function (err, result) {
        if(err){
            return
        }
        user = result

    })

    operaDb.finddb("comment", [pageSize, page], function (err, result, total) {
        if(err){
            next()
            return;
        }

        operaDb.finddb("discuss", function (err, dis) {

            res.render("moodList",{
                "loginname":req.session.username,
                "isLogin":req.session.isLogin,
                "comment":result,
                "discuss":dis,
                "total":total,
                "page":page,
                "pageNum": Math.ceil(total / pageSize),
                "user":user,
                "active":"index"
            })
        })


    })

}

exports.showPersonalInfoPage = function (req, res, next) {
    var page = req.params.personalPage.split("?")[1] -1;
    var pageSize = 6;

    var username = req.params.personalPage.split("?")[0]

    var user = {};
    operaDb.finddb("user", function (err, result) {
        if(err){
            return
        }
        user = result

    })



    operaDb.finddb("user", {
        "username":username
    }, function (err, user) {
        if(err){
            next();
            return
        }

        operaDb.finddb("comment", {
            "username":username
        },  [pageSize, page], function (err, comment, total) {

            operaDb.finddb("discuss", function (err, dis) {

                res.render("personal",{

                    "username":username,
                    "user":user,
                    "loginname":req.session.username,
                    "isLogin":req.session.isLogin,
                    "comment":comment,
                    "discuss":dis,
                    "total":total,
                    "pageNum": Math.ceil(total / pageSize),
                    "user":user,
                    "active":"personal"

                })
            })
        })
    })

    //
    // operaDb.finddb("comment", {
    //     "username":req.session.username
    // }, [pageSize, page], function (err, result, total) {
    //     if(err){
    //         return;
    //     }
    //
    //     operaDb.finddb("discuss", function (err, dis) {
    //
    //         res.render("personal",{
    //             "loginname":req.session.username,
    //             "isLogin":req.session.isLogin,
    //             "comment":result,
    //             "discuss":dis,
    //             "total":total,
    //             "page":page,
    //             "pageNum": Math.ceil(total / pageSize),
    //             "active":"personal"
    //         })
    //     })
    //
    //
    // })

}



exports.doUpdatePic = function (req, res,next) {
    var num = parseInt(Math.random()*89999+10000);
    var uploadtime = sillytime.format(new Date(), 'YYYYMMDDHHmm');
    var form = new formidable.IncomingForm();
    form.uploadDir = "./temp";
    form.parse(req, function(err, fields, file) {

        var extname = path.extname(file.filename.name);

        var nowPath = "userAvatar/" +uploadtime+num+extname

        console.log(req.session.username)
        fs.rename("./" + file.filename.path, "./upload/"+nowPath, function(err,data){
            if(err){
                next();
                console.log("失败");
                return;
            }

            operaDb.updateMany("user", {
                "username":req.session.username
            }, {
                "touxiang":nowPath
            }, function (err, result) {
                if(err){

                    return
                }


                res.redirect("/personal:"+req.session.username)
                res.end();

            })
        })



    });
}