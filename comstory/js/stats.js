
var g_monthArr = null;
var g_weekArr = null;

var g_isOpen = false;

function initAll ()
{
    var lh = new ShopLoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var url = "http://teamsf.co.kr/~coms/shop_sales_base_info.php";
    var params = {sid:userData.id};	
    
    bindBackButton ();
    
    $.ajax( {
        type: 'post',
        dataType: 'json',
        url: url,
        data: params
    }).done(function(resultObj)
    {   
    	console.log(resultObj);
    	g_monthArr = resultObj.months;
    	
    	drawMonthSelector ( g_monthArr );
    	
    	queryMonthly ( userData.id );
    });
    
    $("#month-selector").change ( function ( e ) { queryMonthly ( userData.id ); });
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
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

function drawMonthSelector ( dataArr )
{
	var i; 
	var monthItemExpr = ""; var monthSelectedIdx = -1;
	for ( i = 0 ; i < dataArr.length ; i++ )
	{
		monthItemExpr += 
			"<option value=\"" + i + "\">" + 
				dataArr[i].month_expr + 
			"</option>";
		if ( dataArr[i].now == true ) { monthSelectedIdx = i; }
	}
	$("#month-selector").html(monthItemExpr);
	if ( monthSelectedIdx != -1 ) 
	{ 
		$("#month-selector").val(monthSelectedIdx).selectmenu("refresh"); 
	}
}


function queryMonthly ( shopId )
{
	var monthIdx = $("#month-selector").val ();
	var monthQueryObj = g_monthArr[parseInt(monthIdx)];
	
	var param = 
	{
		"sid":shopId,
		"sdate":monthQueryObj.start,
		"edate":monthQueryObj.end
	};
	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/shop_sales_statistic.php",
		dataType:"json",
		type:"post",
		data:param,
		success:function ( resultObj )
		{	
			var salesTotal = commaNum(Math.round(resultObj.sales_sum * 10000));
			var discountTotal = commaNum(Math.round((resultObj.sales_sum - resultObj.commission_sum)*10000));
			var commissionTotal = commaNum(Math.round(resultObj.commission_sum * 10000));
			
			$("#compon1-name").html(resultObj.compon_1_name);
			$("#compon2-name").html(resultObj.compon_2_name);
			$("#compon3-name").html(resultObj.compon_3_name);
			$("#compon4-name").html(resultObj.compon_4_name);
			$("#month-compon1").html ( resultObj.compon_1_count );
			$("#month-compon2").html ( resultObj.compon_2_count );
			$("#month-compon3").html ( resultObj.compon_3_count );
			$("#month-compon4").html ( resultObj.compon_4_count );
			
			$("#month-income").html ( salesTotal );
			$("#month-ok-count").html( resultObj.compon_ok_count );
			$("#month-commission").html ( commissionTotal );
			$("#month-combo-5").html ( resultObj.combo_5_count );
		}
	});
}

function queryWeekly ( shopId )
{
	var weekIdx = $("#week-selector").val ();
	var weekQueryObj = g_weekArr[parseInt(weekIdx)];
	
	var param = 
	{
		"sid":shopId,
		"sdate":weekQueryObj.start,
		"edate":weekQueryObj.end
	};
	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/shop_sales_statistic.php",
		dataType:"json",
		type:"post",
		data:param,
		success:function ( resultObj )
		{
			var salesTotal = resultObj.sales_sum * 10000;
			var discountTotal = parseInt((resultObj.sales_sum-resultObj.discount_sum)*10000);
			var incomeTotal = parseInt(resultObj.discount_sum*10000);
			
			$("#week-save").html ( salesTotal );
			$("#week-discount").html ( discountTotal );
			$("#week-income").html ( incomeTotal );
			$("#week-compon1").html ( resultObj.compon_1_count );
			$("#week-compon2").html ( resultObj.compon_2_count );
			$("#week-compon3").html ( resultObj.compon_3_count );
			$("#week-compon4").html ( resultObj.compon_4_count );
		}
	});
}

function initPhoneGap ()
{
	document.addEventListener ( "deviceready", initAll , false );
}