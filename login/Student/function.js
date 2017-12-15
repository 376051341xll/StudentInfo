//装饰模式

let student={};
let search_input={stnumber:""};

student.decorate=function () {
};

student.getDecorator=function (deco) {
    student[deco].prototype=this;
    return new student[deco];
};

student.Aver =function () {
    this.decorate=function () {
        this.Aver.prototype.decorate();
        search_input.stnumber=document.getElementById('stnumber').value;
        $.get("/Student/search",search_input,function (stinfo) {
            for(let i=0; i<stinfo.length; i++){
            console.log("chan");
                var aver=document.getElementById('aver');
                let txt=document.createTextNode('平均：'+stinfo[i].aver);
                aver.appendChild(txt);
            }
        });
    }
};

student.Sum=function () {
    this.decorate=function () {
        this.Sum.prototype.decorate();
        search_input.stnumber=document.getElementById('stnumber').value;
        $.get("/Student/search",search_input,function (stinfo) {
            for(let i=0; i<stinfo.length; i++){
                console.log("chan");
                console.log(stinfo);
                var sum=document.getElementById('sum');
               let txt=document.createTextNode('总分：'+stinfo[i].sum);
                sum.appendChild(txt);

            }
        });
    }
}

student=student.getDecorator('Aver');
student=student.getDecorator('S' +
    'um');



function loadAllGrades(thisTable) {
    $.get("/Student",function (allstinfo) {
        for(let i=0;i<allstinfo.length;i++) {
            let x = thisTable.insertRow(0);
            x.insertCell(0).innerHTML = allstinfo[i].stname;
            x.insertCell(1).innerHTML = allstinfo[i].stnumber;
            x.insertCell(2).innerHTML = allstinfo[i].classnum;
            x.insertCell(3).innerHTML = allstinfo[i].math;
            x.insertCell(4).innerHTML = allstinfo[i].chinese;
            x.insertCell(5).innerHTML = allstinfo[i].english;
            x.insertCell(6).innerHTML = allstinfo[i].code;
            x.insertCell(7).innerHTML = allstinfo[i].aver;
            x.insertCell(8).innerHTML = allstinfo[i].sum;

        }
    });
}

function InfoCheckAndInput() {

    let name=document.getElementById('name').value;
    let number=document.getElementById('number').value;
    let classnum=document.getElementById('classnum').value;
    let math=document.getElementById('math').value;
    let chinese=document.getElementById('chinese').value;
    let english=document.getElementById('english').value;
    let code=document.getElementById('code').value;

    studentinfo={
        "name":name,
        "number":number,
        "classnum":classnum,
        "math":math,
        "chinese":chinese,
        "english":english,
        "code":code

    };
    console.log(studentinfo);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: studentinfo,
            url: '/Student/put',
            crossDomain: true,
            success: function () {
                alert('录入成功！')
            },
            complete: function () {
                console.log('complete');
            },
            error: function () {
                alert('请检查格式！')
            }
        });


}


function addGrades(thisTable) {
   search_input.stnumber=document.getElementById('stnumber').value;
    $.get("/Student/search",search_input,function (stinfo) {
        console.log("xo");
        console.log(stinfo);
        for(let i=0;i<stinfo.length;i++) {
            console.log(stinfo);
            let x = thisTable.insertRow(0);
            x.insertCell(0).innerHTML = stinfo[i].stname;
            x.insertCell(1).innerHTML = stinfo[i].stnumber;
            x.insertCell(2).innerHTML = stinfo[i].classnum;
            x.insertCell(3).innerHTML = stinfo[i].math;
            x.insertCell(4).innerHTML = stinfo[i].chinese;
            x.insertCell(5).innerHTML = stinfo[i].english;
            x.insertCell(6).innerHTML = stinfo[i].code;
        }
    });
    student.decorate();

}

