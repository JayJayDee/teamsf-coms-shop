var g_isOpen = false;

function initAll () 
{
    var lh = new ShopLoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var pid = $.getUrlVar('cId');

    var url = "http://teamsf.co.kr/~coms/shop_compon_ok_info.php";
    var params = {pid:pid};
    
    bindBackButton ();

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
        
        navigator.notification.confirm ( "사용 승인을 하시겠습니까?", function ( btnIndex )
        {   
            g_isOpen = false;
            
            if ( btnIndex == 1 ) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: url,
                    data: params        
                    }).done(function(data){
                        if ( g_isOpen == true ) { return; }
                        g_isOpen = true;
                        window.location.replace("./index.html?nav=page-used-compon");
                });
            }
        }, "콤폰 사용 승인" ,"확인,취소" );

        
    });
    
    $("#btn-cancel").on ( "click" , function ()
    {
    	window.location.replace("./index.html");
    });
}

function bindBackButton ()
{
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if ( deviceType != "Android" ) { return; }

	navigator.app.overrideBackbutton(true);
	document.addEventListener("backbutton", function ()
	{
		if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
		navigator.notification.confirm ( "콤스를 종료하시겠습니까?", function ( btnIndex )
    	{	
    		g_isOpen = false;
    		if ( btnIndex == 1 ) { navigator.app.exitApp(); }
    	}, "콤스 종료" ,"확인,취소" );
	}, true );
}

function initPhoneGap ()
{
	document.addEventListener ( "deviceready", initAll , false );
}

