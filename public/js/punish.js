/**
 * Created by Administrator on 2017/7/3.
 */

$("#punish").click(function () {
    if($("#content").val() == ""){

        $("#content").focus()
    }else {
        $.post("/doPunish",{
            "content": $("#content").val()

        },function(result){
            console.log(result)
            if(result.success){
                location = "/";
            }else{
                $("#punishError").text(result.message).fadeIn();
            }

        })
    }

})

$(".punishComment").click(function () {
    var discussId = $(this).attr("data-commentid")
    var content = $(this).parent().prev().val();
    console.log(discussId)
    console.log($("#"+discussId))
    if(content == ""){
        $(this).parent().prev().focus();
    }else{
        $.post("/doPunishComment",{
            "discussId":discussId,
            "content": content
        },function(result){
            console.log(result)
            if(result.success){
                location = "/";
            }else{
                $("#"+commentId).text(result.message).fadeIn();
            }

        })
    }


})
// //
// $("#updatePic").click(function () {
//     var files = $('#filename').val()
//     // var formData = new FormData();
//
//     // formData.append("name", document.getElementById("filename").files[0]);
//     // console.log(formData)
//     if(files == ""){
//         $('#updPicError').text("文件不能为空").fadeIn()
//     }else{
//         $.post("/doUpdatePic",{
//             "touxiang":files
//         },function(result){
//             console.log(result)
//             if(result.success){
//                 window.location.reload()
//             }else{
//                 $("#updPicError").text(result.message).fadeIn();
//             }
//
//         })
//     }
// })