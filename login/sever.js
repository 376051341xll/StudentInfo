'use strict';
let express =require('express');
let orm=require('orm');
let bodyparser=require("body-parser");
let mailer=require("./mailer");
let multer = require('multer');
let upload = multer();
let app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(orm.express("sqlite:public/CodingGirlsClub.db",{
    define:function (db,models,next) {
        models.Message=db.define("MESSAGE",{
            id:{type:'number'},
            user_id:{type:'text'},
            content:{type:'text'},
            area:{type:'text'},
            type:{type:'text'}

        });
        models.User=db.define("USERS",{
            id:{type:'number'},
            name:{type:'text'},
            password:{type:'text'},
            email:{type:'text'}

        });
        next();
    }
}));

//API

//显示主页面
app.get('/',function (req,res) {
    res.sendFile(__dirname+"/public/html/home.html")
});

//1.GET 获得所有美食信息（返回一个美食JOSN对象数组）（注意，数组转化为JOSN对象，而不是数组里的职位对象转化为JOSON对象放入数组，下同）

app.get("/foods",function(req,res){

        req.models.Message.find(null,function (err,allfoods) {

            res.json(allfoods);

        });


});
//2.GET 获得搜索框中输入内容符合的美食信息（返回一个美食JOSN对象数组）（模糊搜索）前端要传值homeSearch（根据搜索框输入的信息查询）
app.get("/foods/search",function(req,res){
    let getRequire = req.query.homeSearch;
    if(getRequire!=null){

        req.models.Message.find({or:[{id: orm.like("%"+getRequire+"%")},{user_id: orm.like("%"+getRequire+"%")},
            {content: orm.like("%"+getRequire+"%")},{area: orm.like("%"+getRequire+"%")},{type: orm.like("%"+getRequire+"%")}
         ,]},function (err,foods) {
            res.json(foods);
            //console.log(positions[0].id);
        });
    }
    else{
        req.models.Message.find(null,function (err,foods) {
            res.json(foods);
            //console.log(positions[0].id);
        });
    }
});
//3.GET 根据标签查询一类美食信息(返回一个美食JOSN对象数组)
app.get("/foods/:tags",function (req,res) {
    var getInfo = req.params.tags;
    if(getInfo===''){
        req.models.Message.find(null,function (err,foods) {
            res.json(foods);
        })
    }
    else {
        req.models.Message.find({type:getInfo},function (err,position) {
            res.json(position);
        })
    }
});
//4.GET 根据邮箱id获得一个用户（返回一个用户JOSN对象）
app.get("/user/:email",function (req,res) {
    var getInfo = req.params.email;
    req.models.User.find({email:getInfo},function (err,usr) {
        if(usr.length==0){
            res.json([]);
        }else {
            res.json(usr[0]);
        }

    })

});
//5.POST  注册一个新用户(接收一个用户JSON对像)
app.post("/users",function (req,res) {
    var newRecord={};
    var countx=0;
    newRecord.password = req.body.signPassword;
    newRecord.usrEmail = req.body.signEmail;
    //console.log(newRecord.usrEmail);
    //console.log(newRecord.usrPassword);
    req.models.User.count(null, function (err, edcount) {
        countx = edcount;
        //console.log(edcount);
        newRecord.id = countx + 1;

        req.models.User.exists({usrEmail: newRecord.usrEmail}, function (err, user) {
            console.log(user);
            if (user.length == 0) {
                mailer({
                    to: newRecord.usrEmail,
                    subject: '激活帐号',
                    text: `点击激活：http://47.94.147.137:3000/checkCode?mail=${newRecord.usrEmail}&psw=${newRecord.usrPassword}&id=${newRecord.id}`//接收激活请求的链接
                })
                res.send("ok")
                console.log("ok")
            }
            else {
                console.log("该邮箱已存在");
                res.send("该邮箱已存在");
            }
        });
    });
});
//6.POST 一个用户完善自己的信息。修改一个用户的用户信息(接受一个用户JSON对象)
app.post('/users/:emailId',function(req,res){
    let email = req.params.email;
    req.models.User.find({usrEmail: email }, function (err, user) {
        // console.log("People found: %d", user.length);
        if(req.body.password!=''){
            user[0].password= req.body.password;
        }
        user[0].name= req.body.name;
        user[0].save(function (err) {
            // err.msg = "under-age";
        });
        res.json(user);
    });
})
//7.GET 获得一个用户创建的已发表美食信息（返回一个美食信息JOSN对象数组）
app.get('/users/:id/items',function(req,res){
    let usersid = req.params.id;

    //console.log(email);
    req.models.Message.find({user_id:usersid},function(err,foods){
        //console.log(JSON.stringify(position));
        res.json(foods);
    })
});

//8.PUT 一个用户新建一个美食信息。（接收一个美食信息JOSN对象）
app.put("/users/:id/id_food",upload.single(),function(req,res){
    let user_ids = req.params.id;
    req.models.Message.count(null,function(err,count){
        //console.log(count);
        req.models.Message.create({
            id: count+1,
            user_id: user_ids,
            content: req.body.content,
            area: req.body.area,
            type: req.body.type
        },function(err,reply){
            if(err){
                console.log(err)
            }else{
                console.log('添加成功');
                res.send("创建成功");
            }

        });
    });
});
//9.PUT 一个用户修改‪一个美食的信息（接收一个美食信JOSN对象）

app.put('/usrs/:emailId/foods/:id',function (req,res) {
    //检测数据是否取到
    let email=req.params.emailId;
    let messageId=req.params.id;
    //console.log(email);
    //console.log(positionId);
    req.models.Message.find({owner:email,id:messageId},function (err,food_message){
        food_message[0].remove(function (err) {
            if(err){
                console.log("错误");
            }
        });
        var newRecord={};
        newRecord.id=messageId;
        newRecord.user_id=eamil;
        newRecord.area=req.body.area;
        newRecord.type=req.body.type;
        newRecord.content=req.body.content;
        req.models.Message.create(newRecord,function(err,result){
            console.log(JSON.stringify(newRecord));
            console.log("修改成功");
        });
        //测试用例
        // req.models.Position.find({id:1001},function (err,ans) {
        //     console.log(JSON.stringify(ans));
        // })
    });
});

//11.GET 一个用户获得‪一个职位的信息（返回一个职位JOSN对象）
app.get('/usrs/:emailId/foods/:id',function (req,res) {
    let email=req.params.emailId;
    let messageId=req.params.id;
    //console.log(email);
    //console.log(positionId);
    req.models.Message.find({owner:email,id:messageId},function (err,message_food) {
        //console.log(JSON.stringify(position));
        res.json(message_food);
    })
});
//12.增加了一个验证激活码的api
app.get('/checkCode', function (req, res) {
    var usermail = req.query.mail;
    var psw = req.query.psw;
    var id = req.query.id;
    var newRecord = {};
    newRecord.id = id;
    newRecord.usrEmail = usermail;
    newRecord.usrPassword = psw;
    req.models.User.create(newRecord, function (err, user) {
        //console.log(user);
        //res.send(`恭喜你，注册成功！您还可以回到<a href=http://127.0.0.1:8081>主页</a>`);
        res.sendFile(__dirname+`/public/html/anivate.html`)
    });
});
//12.GET 一个用户获得‪一个美食的信息（返回一个美食JOSN对象） ksj
app.get('/usrs/workDetail',function (req,res) {
    let email=req.query.emailId;
    let messageId=req.query.Id;
    //console.log(email);
    //console.log(positionId);
    req.models.Message.find({owner:email,id:messageId},function (err,food_message) {
        //console.log(JSON.stringify(position));
        res.json(food_message);
    })
});






//13.修改密码发送邮件
app.post("/change_pass",function(req,res){
    //console.log(req.body.signEmail);
    //console.log(req.body.signPassword);
    req.models.User.find({usrEmail:req.body.signEmail},function(err,user){

        if(user.length==0) {
            res.send("该用户不存在！");
        }
        else{
            mailer({
                to:  req.body.signEmail,
                subject:'重置密码',
                text: `点击重置：http://47.94.147.137:3000/resetpass?mail=${req.body.signEmail}&password=${req.body.signPassword}`//接收激活请求的链接
            });
            res.send("ok")
        }
    })
});
//14.修改密码
app.get('/resetpass', function (req, res){
    var usermail = req.query.mail;
    var secpass = req.query.password;
    //console.log(usermail);
    //console.log(secpass);
    req.models.User.find({usrEmail:usermail}, function (err, user){
        //console.log(JSON.stringify(user));
        user[0].usrPassword=secpass;
        user[0].save(function (err) {
            if(err){
                return res.status(500).json({error:err.message});
            }
            else{
                res.sendFile(__dirname+`/public/html/resetPassword.html`);
            }

        })

    });

});
//服务器
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
