$(document).ready(function(){
    var lh = new ShopLoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var pid = $.getUrlVar('cId');

    var url = "http://teamsf.co.kr/~coms/shop_compon_ok_info.php";

    var params = {pid:pid};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        
        $('.name').html(commaNum(parseInt(data.price*10000))+"원 이상 이용시 "+commaNum(parseInt(data.price*10000 - data.discount_price*10000))+"원 할인권");
        $('.name2').html("요청시간 : "+data.act_date);            
        
        $('.limit-date').html("쿠폰번호 : "+data.coupon_code);        
        $('.compon-code').html(data.member_name+"("+data.member_nickname+") / H.P : "+data.member_phone);
        

        //myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-use').on('click', function(){

        var url = "http://teamsf.co.kr/~coms/shop_compon_ok_proc.php";
        var params = {pid:pid}
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            alert("승인 완료");
        });
    });

    
    

})