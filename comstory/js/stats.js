
var g_monthArr = null;
var g_weekArr = null;

$(document).ready ( function ()
{
    var lh = new ShopLoginHandler ();
    var userData = lh.getLocalLoginInfo();
    
    var url = "http://teamsf.co.kr/~coms/shop_sales_base_info.php";
    var params = {sid:userData.id};	
    $.ajax( {
        type: 'post',
        dataType: 'json',
        url: url,
        data: params
    }).done(function(resultObj)
    {   
        g_weekArr = resultObj.weeks;
    	g_monthArr = resultObj.months;
    	
    	drawMonthSelector ( g_monthArr );
    	drawWeekSelector ( g_weekArr );
    	
    	queryMonthly ( userData.id );
    	queryWeekly ( userData.id );
    	
    	myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });
    
    $("#month-selector").change ( function ( e ) { queryMonthly ( userData.id ); });
    $("#week-selector").change ( function ( e ) { queryWeekly (userData.id); });
});

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

function drawWeekSelector ( dataArr )
{
	var i;
	var weekItemExpr = ""; var weekSelectedIdx = -1;
	for ( i = 0 ; i < dataArr.length ; i++ )
	{
		weekItemExpr += 
			"<option value=\"" + i + "\">" +
				dataArr[i].start_expr + " ~ " + dataArr[i].end_expr +
			"</option>";
		if ( dataArr[i].now == true ) { weekSelectedIdx = i; }
	}
	$("#week-selector").html(weekItemExpr);
	if ( weekSelectedIdx != -1 ) 
	{ 
		$("#week-selector").val(weekSelectedIdx); 
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
			var salesTotal = resultObj.sales_sum * 10000;
			var discountTotal = parseInt((resultObj.sales_sum-resultObj.discount_sum)*10000);
			var incomeTotal = parseInt(resultObj.discount_sum*10000);
			var commisionTotal = parseInt(resultObj.commision_sum*10000);
			
			$("#month-save").html ( salesTotal );
			$("#month-discount").html ( discountTotal );
			$("#month-income").html ( incomeTotal );
			$("#month-commision").html ( commisionTotal );
			
			$("#month-compon1").html ( resultObj.compon_1_count );
			$("#month-compon2").html ( resultObj.compon_2_count );
			$("#month-compon3").html ( resultObj.compon_3_count );
			$("#month-compon4").html ( resultObj.compon_4_count );
			
			$("#month-commision-rate").html ( resultObj.commision_sum_rate );
			$("#month-discount-rate").html ( resultObj.discount_sum_rate );
			$("#month-income-rate").html ( resultObj.income_sum_rate );
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
			var commisionTotal = parseInt(resultObj.commision_sum*10000);
			
			$("#week-save").html ( salesTotal );
			$("#week-discount").html ( discountTotal );
			$("#week-commision").html ( commisionTotal );
			$("#week-income").html ( incomeTotal );
			
			$("#week-compon1").html ( resultObj.compon_1_count );
			$("#week-compon2").html ( resultObj.compon_2_count );
			$("#week-compon3").html ( resultObj.compon_3_count );
			$("#week-compon4").html ( resultObj.compon_4_count );
			
			$("#week-commision-rate").html ( resultObj.commision_sum_rate );
			$("#week-discount-rate").html ( resultObj.discount_sum_rate );
			$("#week-income-rate").html ( resultObj.income_sum_rate );
		}
	});
}