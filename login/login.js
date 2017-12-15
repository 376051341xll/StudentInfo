'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let crypto=require('crypto');
let md5=require('md5');
app.use(express.static(__dirname+'/'));
const nodemailer = require('nodemailer');
let orm = require('orm');

app.use(bodyParser.urlencoded({ extended: true }));

//使用orm连接数据库：
orm.connect('sqlite:/StudentInfo/db/login.db ', function(err, db) {
    if (err) {
        return console.error('Connection error: ' + err);
    }
    else {
        console.log('success!');
    }
});

app.use(orm.express("/StudentInfo/db/login.db", {
    define: function (db, models, next) {
        models.User=db.define("USER",{
            id:{type:'number'},
            username:{type:'text'},
            password:{type:'text'},
            email:{type:'text'},
            tag:{type:"number"}

        });
        models.StudentInfo=db.define("StudentInfo",{
            id:{type:'number'},
            stname:{type:'text'},
            stnumber:{type:'number'},
            chinese:{type:'number'},
            math:{type:'number'},
            english:{type:'number'},
            code:{type:'number'},
            sum:{type:'number'},
            aver:{type:'number'},
            classnum:{type:'number'}
        });
        next();
    }
}));

//加载页面
app.get('/',function (req,res) {
    res.sendFile(__dirname+"/login.html");
});


app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});




//功能1：注册
//对传入的数据进行解析，然后跟数据库数据进行比较，判断是否已经注册。
//1.注册：
app.post(`/user`,function (req,res) {
    let newRecord={};
    let countx=0;
    newRecord.username=req.body.username;
    newRecord.password = req.body.password;
    newRecord.email = req.body.email;
    newRecord.id=req.body.id;
    newRecord.tag=req.body.tag;

    req.models.User.count(null, function (err, edcount) {
        countx = edcount;
        newRecord.id = countx + 1;

        req.models.User.exists({email: newRecord.email}, function (err, user) {
            if (user===true) {
                res.send("该邮箱已存在!!");
                console.log("该邮箱已存在");
            }
            else {
                req.models.User.create(newRecord, function (err, user) {
                });
                console.log(user);
                res.send(newRecord);
                console.log("注册成功！")
            }
        });
    });
});



//登录
app.get("/user/login",function (req,res) {
    var getemail = req.query.email;
    var getpassword=req.query.password;
    console.log(req.query.email);
    req.models.User.find({email:getemail,password:getpassword},function (err,usr) {
        if(usr.length===0){
            console.log("不正确！");
            res.send("不正确！");
        }else {
            console.log(usr);
            res.send({email:getemail,password:getpassword});
            console.log("登录成功！");

        }

    });

});

//1.GET 获得所有学生成绩

app.get("/Student",function(req,res){

    req.models.StudentInfo.find(null,function (err,allstinfo) {
        res.json(allstinfo);
    });
});

//2.POST 提交学生成绩

app.post(`/Student/put`,function (req,res) {
    let newRecord={};
    let countx=0;
    newRecord.stname=req.body.name;
    newRecord.stnumber=req.body.number;
    newRecord.classnum=req.body.classnum;
    newRecord.math=req.body.math;
    newRecord.chinese=req.body.chinese;
    newRecord.english=req.body.english;
    newRecord.code=req.body.code;
    newRecord.aver=(parseInt(newRecord.math)+parseInt(newRecord.chinese)+parseInt(newRecord.english)+parseInt(newRecord.code))/4;
    newRecord.sum=parseInt(newRecord.math)+parseInt(newRecord.chinese)+parseInt(newRecord.english)+parseInt(newRecord.code);


    req.models.StudentInfo.count(null, function (err, edcount) {
        countx = edcount;
        newRecord.id = countx + 1;

        req.models.StudentInfo.exists({number: newRecord.stnumber}, function (err, user) {
            if (user===true) {
                res.send("该学生已存在!!");
                console.log("该学生已存在");
            }
            else {
                req.models.StudentInfo.create(newRecord, function (err, user) {
                });
                console.log(user);
                res.send(newRecord);
                console.log("录入成功！")
            }
        });
    });
});

//3.GET 查询学生成绩
app.get("/Student/search",function (req,res) {
    console.log("hello");
    let getRequire = req.query.stnumber;
    console.log(getRequire);
    if (getRequire === '') {
        req.models.StudentInfo.find(null,function (err,foods) {
            res.json(foods);
        });
    }
    else {
        req.models.StudentInfo.find({stnumber:getRequire},function (err, position) {
            console.log(position);
            res.json(position);
            console.log("查询成功！");
        });

    }
});

let server = app.listen(8081,function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log("访问地址为 http://%s:%s", host, port);
});
