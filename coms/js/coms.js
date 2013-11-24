var g_iu = null;
var g_isOpen = false;
var myScroll = null;

function initAll ()
{
	var lh = new ShopLoginHandler ();
	var shop = lh.getLocalLoginInfo();

	var sid = shop.id;
	
	g_iu = new ImageUploader ();
	g_iu.setNavigatorObj ( navigator );
	
	bindBackButton ();

	var param = 
	{
		sid:sid
	};

	$.ajax ({
		type:"post",
		data:param,
		dataType:"json",
		url:"http://teamsf.co.kr/~coms/shop_manage_info_show.php",
		success:function ( resultObj )
		{
			if ( resultObj.success == true ) 
			{ 
				console.log(resultObj); 
				$("#info-profile-img").attr("src",resultObj.profile_img_path);
				
				$('#shop-name').html(resultObj.name);
				$("#name").html(resultObj.category_name);
				$("#location").html(resultObj.location);
				$("#time").html(resultObj.start_time+"~"+resultObj.end_time);
				$("#closed").html(resultObj.closed);
				$("#phone").html(resultObj.phone);
				
				$("#limit-date").html(resultObj.shop_start_date+" ~ "+resultObj.shop_end_date);
				

				$("#giving1").html(resultObj.giving_1.giving_count);
				$("#giving2").html(resultObj.giving_2.giving_count );
				$("#giving3").html(resultObj.giving_3.giving_count );
				$("#giving4").html(resultObj.giving_4.giving_count );	
			}
		}
	});
	
	
	$("#btn-combo-discount").on ( "click" , function ()
	{
		var param = 
		{
			sid:sid,
			cb1:$("#combo1").val(),
			cb2:$("#combo2").val(),
			cb3:$("#combo3").val(),
			cb4:$("#combo4").val(),
			cb5:$("#combo5").val()
		};
		
		$.ajax ({
			type:"post",
			data:param,
			dataType:"json",
			url:"http://teamsf.co.kr/~coms/shop_setting_combo_modify.php",
			success:function ( resultObj )
			{
				if ( resultObj.success == true ) 
				{ 
					doAlert ( "콤보 할인율 변경 성공!" , "콤보 할인율 설정" , function () {} );
					$.mobile.changePage ( "#page-menu-select" );
				}
				else 
				{ 
					doAlert ( resultObj.cause , "콤보 할인율 변경 실패" , function () {} ); 
				}
			}
		});
	});

	$("#btn-compon-price").on("click", function()
	{
		var param = 
		{
			sid:sid,
			cp1:$("#compon1").val(),
			cp2:$("#compon2").val(),
			cp3:$("#compon3").val(),
			cp4:$("#compon4").val() 
		};
		
		$.ajax({
			type:"post",
			data:param,
			dataType:"json",
			url:"http://teamsf.co.kr/~coms/shop_setting_compon_modify.php",
			success:function ( resultObj )
			{
				if ( resultObj.success == true ) 
				{ 
					doAlert ( "콤폰 가격 변경 변경 성공!" , "콤폰 가격 설정" , function () {} );
					$.mobile.changePage ( "#page-menu-select" );
				}
				else 
				{ 
					doAlert ( resultObj.cause , "변경 실패" , function () {} );
				}
			}
		});
	});
	
	$( "#btn-modify-profile-image").on ( "click" , function ()
	{
		if ( g_isOpen == false )
		{
			g_isOpen = true;
			g_iu.selectImage ( function ( resultObj )
			{	
				if ( resultObj.success == false ) 
				{
					g_isOpen = false;
					return;
				}
				
				var imageUri = resultObj.imageUri;
				g_iu.uploadImage ( imageUri , function ( result )
				{
					g_isOpen = false;
					if ( result.success == false ) 
					{ 
						doAlert ( result.cause  , "이미지 변경 실패" , function () {} );
						return;
					}
					
					$("#profile-img").attr("src",result.img_full_path)
					.attr("imgid",result.image_id);
				});
			});
		}
	});

	
	// 메뉴 이미지 변경 페이지
	$( "#page-menu-img-modify" ).on ( "pagecreate" , function (event)
	{
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_manage_info_show.php",
			type:"post",
			dataType:"json",
			data:{"sid":sid}
		}).done ( function ( resultObj )
		{
			$("#menu-img").attr("src",resultObj.menu_img_path)
			.attr("imgid",resultObj.menu_img_id);
		});
	});
	
	$("#btn-menu-img-modify").on ( "click" , function ()
	{
		if ( g_isOpen == false )
		{
			g_isOpen = true;
			g_iu.selectImage ( function ( resultObj )
			{
				if ( resultObj.success == false ) { g_isOpen=false; return; }
				
				var imageUri = resultObj.imageUri;
				g_iu.uploadImage ( imageUri , function ( result )
				{
					g_isOpen = false;
					if ( result.success == false ) 
					{ 
						doAlert ( result.cause , "변경 실패" , function () {} );
						return;
					}
					
					$("#menu-img").attr("src",result.img_full_path)
					.attr("imgid",result.image_id);
				});
			});
		}
	});
	
	$("#btn-menu-img-done").on ( "click" , function ()
	{
		var imgId = $("#menu-img").attr("imgid");
		
		var param = 
		{
			"sid":sid,
			"imgid":imgId
		};
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_manage_menu_img_modify.php",
			type:"post",
			dataType:"json",
			data:param	
		}).done ( function ( resultObj )
		{
			if ( resultObj.success == true ) 
			{
				doAlert ( "메뉴 이미지 변경 성공!" , "메뉴 이미지 설정" , function () {} );
				window.location.replace("./index.html");
			}
			else 
			{
				doAlert ( resultObj.cause , "이미지 설정 실패" , function () {} ); 
			}
		});
	});
	
	$( "#btn-duration-modify" ).on ( "click" , function ()	
	{
		var startDate = $("#duration-start-selector").val();
		var endDate = $("#duration-end-selector").val();
		
		var param = 
		{
			"sid":sid,
			"sdate":startDate,
			"edate":endDate
		};
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_sales_duration_modify.php",
			data:param,
			dataType:"json",
			type:"post"
		}).done ( function ( resultObj )
		{
			if ( resultObj.success == true )
			{
				doAlert ( "입점기한 연장에 성공하였습니다." , "입점기한 연장" , function () {} );
				$.mobile.changePage ( "#page-menu-select" );
			}
		});
	});
	
	$( "#page-service-duration" ).on ( "pagecreate" , function ( event )
	{
		var param = { "sid":sid	};
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_sales_duration_show.php",
			type:"post",
			data:param,
			dataType:"json"
		}).done ( function ( resultObj )
		{
			$("#service-sales-limit").html(resultObj.sales_limit);
			$("#service-customer-limit").html(resultObj.customer_limit);
			
			var ds = resultObj.duration_start;
			var startExpr = ds.year + "년 " + ds.month + "월";
			var startVal = ds.year + "-" + ds.month + "-01";
			
			var startContent = 
				"<option value='"+ startVal + "'>" +
					startExpr + 
				"</option>";
			$("#duration-start-selector").html(startContent).val(startVal).selectmenu("refresh");
			
			var i;
			var endContent = "";
			var durationEnd = resultObj.duration_end;
			var endVal = ""; var selectVal = "";
				
			for ( i = 0 ; i < durationEnd.length ; i++ )
			{
				var de = durationEnd[i];
				var expr = de.year + "년 " + de.month + "월";
				endVal = de.year + "-" + de.month + "-01";
				
				if ( i == 0 ) { selectVal = endVal; }
				
				endContent += 
				"<option value='" + endVal + "'>" +
					expr + "</option>";
			}
			$("#duration-end-selector").html(endContent).val(selectVal).selectmenu("refresh");
		});
	});
	
	
	$( "#page-profile-modify" ).on ( "pagebeforeshow" , function (event)
	{
		var url = "http://teamsf.co.kr/~coms/shop_manage_info_show.php";
		
		$.ajax ({
			url:url,
			type:"post",
			dataType:"json",
			data:{sid:sid}
		}).done ( function ( resultObj )
		{
			$("#profile-img").attr("src",resultObj.profile_img_path)
			.attr("imgid",resultObj.profile_img_id);
			
			$("#shop-close").val(resultObj.closed);
			$("#shop-phone").val(resultObj.phone);
			$("#shop-location").val(resultObj.location);
			
			var arrCategory = resultObj.all_category;
			var i; var itemsExpr = ""; var selectedId = -1;
			for ( i = 0 ; i < arrCategory.length ; i++ )
			{
				itemsExpr += 
					"<option value=\"" + arrCategory[i].id + "\">" + 
						arrCategory[i].name + 
					"</option>";
				if ( arrCategory[i].now == true ) { selectedId = arrCategory[i].id; }
			}
			
			$("#shop-category-selector").html(itemsExpr)
			.val ( selectedId ).selectmenu("refresh");
			
			var startTimeArr = resultObj.start_time.split(":");
			var endTimeArr = resultObj.end_time.split(":");
			
			var timeStartId = -1; var timeEndId = -1;
			var timeStartExpr = ""; var timeEndExpr = "";
			for ( i = 1 ; i <= 24 ; i++ )
			{
				if ( i == parseInt(startTimeArr[0]) ) { timeStartId = i; }
				if ( i == parseInt(endTimeArr[0]) ) { timeEndId = i; }
				
				timeStartExpr += 
					"<option value=\"" + i + "\">" +
						i + "시" +
					"</option>";
				timeEndExpr += 
					"<option value=\"" + i + "\">" +
						i + "시" +
					"</option>";
			}
			
			$("#shop-close-time-start").html(timeStartExpr).val(timeStartId).selectmenu("refresh");
			$("#shop-close-time-end").html(timeEndExpr).val(timeEndId).selectmenu("refresh");
			
		});
	});
	
	$("#btn-modify").click ( function ()
	{	
		var startTime = $("#shop-close-time-start").val() + ":00:00";
		var endTime = $("#shop-close-time-end").val() + ":00:00";
		
		var param = 
		{
			sid:sid,
			imgid:$("#profile-img").attr("imgid"),
			catid:$("#shop-category-selector").val() ,
			location:$("#shop-location").val(),
			starttime:startTime,
			endtime:endTime,
			closed:$("#shop-close").val(),
			phone:$("#shop-phone").val()
		};
		
		$.ajax ({
			"url":"http://teamsf.co.kr/~coms/shop_manage_info_modify.php",
			"dataType":"json",
			"data":param,	
			"type":"post"
		}).done ( function ( resultObj )
		{
			console.log ( resultObj.query );
			if ( resultObj.success == true ) 
			{
				doAlert ( "정보 변경 성공!" , "상점 프로필 관리" , function () {} );
				window.location.replace("./index.html");
			}
			else 
			{ 
				doAlert ( resultObj.cause , "상점 프로필 관리" , function () {} );
			}
		});
	});

	$( "#page-compon-price" ).on( "pagecreate", function( event ) {
		var url = "http://teamsf.co.kr/~coms/shop_setting_compon_show.php";
		var params = {sid:sid};
		
		var i; var optionExpr = "";
		for ( i = 0 ; i < 100 ; i++ )
		{
			optionExpr += "<option value=\"" + (i+1) + "\">" + 
								(i+1) + " 만원</option>";
		}
		
		$("#compon1").html(optionExpr);
		$("#compon2").html(optionExpr);
		$("#compon3").html(optionExpr);
		$("#compon4").html(optionExpr);

		$.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: url,
	        data: params        
	    }).done(function(compons)
	    {    
	        $("#compon1-name").html(compons.compon_1_name);
	        $("#compon2-name").html(compons.compon_2_name);
	        $("#compon3-name").html(compons.compon_3_name);
	        $("#compon4-name").html(compons.compon_4_name);

	        $("#compon1").val(compons.compon_1).selectmenu("refresh");
	        $("#compon2").val(compons.compon_2).selectmenu("refresh");
	        $("#compon3").val(compons.compon_3).selectmenu("refresh");
	        $("#compon4").val(compons.compon_4).selectmenu("refresh");
	    });
	});

	$( "#page-compon-discount" ).on( "pagecreate", function( event ) {
		var url = "http://teamsf.co.kr/~coms/shop_setting_combo_show.php";
		
		var i; var optionExpr = "";
		for ( i = 0 ; i < 100 ; i++ )
		{
			optionExpr += "<option value=\"" + (i+1) + "\">" + 
								(i+1) + " %</option>";
		}
		
		$("#combo1").html(optionExpr);
		$("#combo2").html(optionExpr);
		$("#combo3").html(optionExpr);
		$("#combo4").html(optionExpr);
		$("#combo5").html(optionExpr);
		
		var params = {sid:sid};
		$.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: url,
	        data: params        
	    }).done(function(compons){
	        console.log(compons);

	        $("#combo1").val(compons.combo_1).selectmenu("refresh");
	        $("#combo2").val(compons.combo_2).selectmenu("refresh");
	        $("#combo3").val(compons.combo_3).selectmenu("refresh");
	        $("#combo4").val(compons.combo_4).selectmenu("refresh");
	        $("#combo5").val(compons.combo_5).selectmenu("refresh");
	    });
	});
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

function initPhonegap ()
{
	document.addEventListener("deviceready", initAll , false);
}