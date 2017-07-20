/**
 * Created by Administrator on 2017/7/3.
 */
$('.showDisText').click(function () {

    if( $(this).parent().next().is(":hidden")){
        $(this).parent().next().slideDown();
    }else{
        $(this).parent().next().slideUp();
    }

})