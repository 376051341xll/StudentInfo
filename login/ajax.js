//工厂模式 属于创建对象的创建型模式，当我们有两个相似对象而又不知道应该使用哪种时，使用工厂模式。在该模式下，代码将会根据具体的输入或者其他的既定规则（此处为tag），自行决定创建哪种类型的对象。

let userinfo=Object;
let User={};
User.dom={};

User.dom.teacher=function(){
    this.init=function () {
        let username=document.getElementById('user_name').value;
        let password=document.getElementById('register_password').value;
        let email=document.getElementById('email').value;
        userinfo={
            "username":username,
            "password":password,
            "email":email,
            "tag":1
        };
        return userinfo;
    };

};

User.dom.student=function () {
    this.init=function () {
        let username=document.getElementById('user_name').value;
        let password=document.getElementById('register_password').value;
        let email=document.getElementById('email').value;
        userinfo={
            "username":username,
            "password":password,
            "email":email,
            "tag":0
        };
        return userinfo;
    };
};

User.dom.factory=function(type){
    return new User.dom[type];
};



function check_register() {
    let tag=document.getElementById('identity').value;
    var o=User.dom.fact
    ory(tag);
    var info=o.init();
    console.log(info);

    $.ajax({
        type: 'POST',
        dataType:'json',
        data: info,
        url:  '/user',
        crossDomain: true,
        success: function (data) {
            window.location.href = "../Student/main.html";
        },
        complete: function() {
            console.log('complete')
        },
        error: function() {
            console.log('error');
            alert('邮箱已存在！');
        }
    });

    console.log(userinfo);
}

function check_login() {
    let email=document.getElementById('login_email').value;
    let password=document.getElementById('password').value;


    $.ajax({
        type: 'GET',
        dataType:'json',
        data:{
            "email":email,
            "password":password
        },
        url:  '/user/login',
        success: function () {
            window.location.href = "../Student/main.html";
           // console.log("get success!");
        },
        complete: function() {
            console.log('complete')
        },
        error: function() {
            console.log('error');
            alert("输入的邮箱或密码有误！");
        }
    })
}

