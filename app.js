/**
 * Created by Administrator on 2017/7/3.
 */
var express = require("express");
var app = express();
var session = require("express-session")
var router = require("./controller/controller.js")
app.set("view engine","ejs");

app.use(express.static("./public"));
app.use(express.static("./upload"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


app.listen(3000)


app.get("/",router.showIndex);


app.get("/loginOut", router.loginOut)
app.get("/register",router.showRegister)
app.get("/login",router.showLogin)
app.get("/personal:username", router.showPersonal)
app.get("/moodList", router.showMoodList)
app.get("/:pageNum", router.showInfoPage)
app.get("/:personalPage", router.showPersonalInfoPage)


app.post("/doRegister",router.doRegister)
app.post("/doLogin", router.doLogin)
app.post("/doPunish", router.doPunish)
app.post("/doPunishComment", router.doPunishComment)
app.post("/doUpdatePic", router.doUpdatePic)