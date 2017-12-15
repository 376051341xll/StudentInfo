$(function(){
    $("#create").click(function(){
        check_register();
        console.log("create function!");
        return false;
    })
    $("#login").click(function(){
        check_login();
        return false;
    })
    $('.message a').click(function () {
        $('#form1').animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 'slow');
        $('#form2').animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 'slow');
    });
})