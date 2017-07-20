/**
 * Created by Administrator on 2017/7/3.
 */
$("input").focus(function(){
    $("#alert").fadeOut();
})
$("#btn").click(function(){
    $.post("/doRegister",{
        "username": $("#username").val(),
        "password":$("#password").val()
    },function(result){
        console.log(result)
        if(result.success){
            location = "/";
        }else{
            $("#alert").text(result.message).fadeIn();
        }

    })
})