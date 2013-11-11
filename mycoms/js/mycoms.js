var g_isOpen = false;

function initAll () 
{
	var lh = new ShopLoginHandler ();
	var shop = lh.getLocalLoginInfo();
	console.log(shop);
	var sid = shop.id;

	var url = "http://teamsf.co.kr/~coms/shop_accept_compon_list_show.php";
	var params = {sid:sid, accepted:"false"};
	var nav = $.getUrlVar("nav");
	
	bindBackButton ();
	
	$.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        var compons_html = "<div class='area-padding'>";
        for(var i in data) {

            compons_html += "<div class='list-mycompon unused-compon' value='"+data[i].id+"'><div class='list-inner'>";
            compons_html += "<p class='name'>"+data[i].price*10000+" 원 이상 이용시 "+(data[i].price*10000 - data[i].discount_price*10000)+" 원 할인권";            
            compons_html += "</p>";
            compons_html += "<p><span class='compon-nums'>"+data[i].combo_count+"</span> 콤보 / <span class='compon-nums'>"+data[i].discount_rate+"%</span> 할인";
            compons_html += "</p>";
            compons_html += "<p class='limit-date'>콤폰번호 : "+data[i].coupon_code;
            compons_html += "</p>";            
            compons_html += "<p class='limit-date'>요청시간 : "+data[i].act_date;            
            compons_html += "</p>";
            compons_html += "<p class='foo'><span class='combo-left unused-compon'>고객정보</span><span class='compon-code'>"+data[i].member_name+"("+data[i].member_nickname+") / H.P : "+data[i].member_phone+"</span>";
            compons_html += "</p>";            
            compons_html += "</div></div>";
        }
        compons_html += "</div>";

        $('#container').html(compons_html);
        
        $('.list-mycompon').on('click', function(){
            var cId = $(this).attr('value');
            console.log(cId);
            window.location = "./detail_compon.html?cId="+cId;
        });
    });
	

	$( "#page-used-compon" ).on( "pagebeforecreate", function( event ) {
		var url = "http://teamsf.co.kr/~coms/shop_accept_compon_list_show.php";
		var params = {sid:sid, accepted:"true"};
		$.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: url,
	        data: params        
	    }).done(function(data){
	        
	        var compons_html = "<div class='area-padding'>";

	        for(var i in data) {

            compons_html += "<div class='list-mycompon used-compon' value='"+data[i].id+"'><div class='list-inner'>";
            compons_html += "<p class='name'>"+data[i].price*10000+" 원 이상 이용시 "+(data[i].price*10000 - data[i].discount_price*10000)+" 원 할인권";            
            compons_html += "</p>";
            compons_html += "<p><span class='compon-nums'>"+data[i].combo_count+"</span> 콤보 / <span class='compon-nums'>"+data[i].discount_rate+"%</span> 할인";
            compons_html += "</p>";
            compons_html += "<p class='limit-date'>콤폰번호 : "+data[i].coupon_code;
            compons_html += "</p>";            
            compons_html += "<p class='limit-date'>요청시간 : "+data[i].act_date;            
            compons_html += "</p>";
            compons_html += "<p class='foo'><span class='combo-left used-compon'>고객정보</span><span class='compon-code'>"+data[i].member_name+"("+data[i].member_nickname+") / H.P : "+data[i].member_phone+"</span>";
            compons_html += "</p>";            
            compons_html += "</div></div>";
	        }
	        compons_html += "</div>";

	        $('#container2').html(compons_html);
	    });
	});
	
	if ( nav != null )
	{
		$.mobile.changePage ( "#" + nav );
		return;
	}
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

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initPhoneGap ()
{
	document.addEventListener ( "deviceready", initAll , false );
}