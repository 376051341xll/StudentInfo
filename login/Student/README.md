练习：学生成绩单（Web版）

练习目标

基于新需求，重构既有代码
HTML的基本使用
CSS（基于Bootstrap）的基本使用
练习要求

重构自己实现的学生成绩单（命令行版），使用HTML，Bootstrap，Javascript实现一个学生成绩管理系统（Web版），具有以下功能：

添加一条学生成绩信息
查询多个学生成绩信息
修改一条学生成绩信息
删除一条学生成绩信息
第一阶段

实现一个静态页面展示学生成绩信息。

要求：

使用Bootstrap table样式
允许将学生信息直接写在静态页面里
第二阶段

实现“添加一条学生成绩信息”功能。

要求：

以form表单的形式接收用户提交的学生成绩
使用Javascript监听表单onSubmit事件
提交时进行输入校验，输入必须满足格式：姓名, 学号, 民族, 班级, 学科: 成绩, …，否则提示请按正确的格式输入（格式：姓名, 学号, 学科: 成绩, ...）
提交格式正确则将学生成绩存入浏览器的localStorage
第三阶段

在第一阶段实现的静态页面基础上，实现“查询多个学生成绩信息”功能。

要求：

允许用户一次查询多个学生的成绩

提交时进行输入校验，输入必须满足格式：学号, 学号,...，否则提示请按正确的格式输入要打印的学生的学号（格式： 学号, 学号,…）

输入格式正确则将所查询学生的成绩显示出来，并显示他们的总分平均分和总分中位数

第四阶段

在第三阶段实现的查询成绩单页面基础上，实现“修改一条学生成绩信息”功能。

要求：

允许用户在查询出学生成绩后进行修改
修改提交时进行输入校验，输入必须满足格式：姓名, 学号, 民族, 班级, 学科: 成绩, …，否则提示请按正确的格式输入（格式：姓名, 学号, 学科: 成绩, ...）
修改提交格式正确则修改该学生成绩
第五阶段

在第三阶段实现的查询成绩单页面基础上，实现“删除一条学生成绩信息”功能。

要求：

允许用户在查询出学生成绩后进行删除
删除时弹窗确认确定删除”姓名+学号“的成绩？
输出结果

将代码库地址提交到教练指定的位置。

代码库需包含：

说明如何运行和测试代码的README.md文件
运行结果的截图文件（一个功能一张截图）
如何开始：

git clone https://github.com/tws-practice/student-score-sheet-web-version
打开项目文件，完成练习。
学习资源

HTML W3school教程：http://www.w3school.com.cn/html/index.asp

CSS W3school教程：http://www.w3school.com.cn/css/index.asp

Bootstrap中文文档：http://www.bootcss.com/

JavaScript 闯关记：https://github.com/stone0090/javascript-lessons/

常见问题

JS中如何取DOM元素的值：https://github.com/stone0090/javascript-lessons/blob/master/2.2-DOM/README2.md
如何给元素添加事件监听函数：https://www.w3schools.com/jsref/met_element_addeventlistener.asp
如何阻止表单默认提交行为：https://stackoverflow.com/questions/5915893/stop-form-submission-with-submit-eventlistener
如何等到页面完全载入再运行函数：https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
localStorage如何存储对象和数组：https://my.oschina.net/crazymus/blog/371757
