
var g_lh = null;

function initAll ()
{	
	g_lh = new ShopLoginHandler ();
	
	// 상단 공지 버튼들 이벤트 바인딩
	$(".notice-link").on ( "tap" , function ()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		
		$("#page-notice").attr("title",pageTitle)
						.attr("category",pageCategory);
		$.mobile.changePage ( "#page-notice" );
	});
	
	bindNoticePage ();
	bindAccountSettingPage ();
	bindLogoutPage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function bindLogoutPage ()
{
	$(document).on("pagebeforeshow","#page-logout",function ()
	{
		if ( g_lh.isLogged() == false )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "로그아웃 오류" , function(){} );
			location.href="./index.html";
			return;
		}
	});
	
	$("#btn-logout").on ( "tap" , function ()
	{
		g_lh.flushLogin ();
		doAlert ( "성공적으로 로그아웃 되었습니다!" , "로그아웃" , function(){} );
		location.href="../index.html";
	});
}

function bindAccountSettingPage ()
{
	$(document).on("pagebeforeshow","#page-account-setting",function ()
	{
		if ( g_lh.isLogged() == false )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "패스워드 설정 오류" , function(){} );
			location.href="./index.html";
			return;
		}
		
		$("#edit-pw").val(""); $("#edit-pw-confirm").val("");
	});
	
	$("#btn-account-modify").on ( "tap" , function()
	{
		var pw = $("#edit-pw").val();
		var pwConfirm = $("#edit-pw-confirm").val();
		
		if ( pw.length == 0 )
		{
			doAlert ( "패스워드를 입력하세요!" , "패스워드 설정" , function(){} );
			return;
		}
		if ( pw != pwConfirm ) 
		{
			doAlert ( "패스워드가 서로 다릅니다!" , "패스워드 설정" , function(){} );
			return;
		}
		
		var shopId = g_lh.getLocalLoginInfo().id;
		var ajaxParam = { sid:shopId, pw:pw };
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_info_modify.php",
			data:ajaxParam,
			dataType:"json",
			type:"post",
			success:function ( resultObj )
			{
				if ( resultObj.success == true )
				{
					g_lh.flushLogin ();
					g_lh.setId ( resultObj.login_code ); g_lh.setPw ( pw );
					
					g_lh.doLogin ( function ( loginResultObj )
					{
						if ( loginResultObj.success == true )
						{
							doAlert ( "새로운 패스워드를 설정하였습니다!" , "패스워드 설정" , function(){} );
							location.href="./index.html";
							return;
						}
						else
						{
							doAlert ( "패스워드 설정에 실패하였습니다" , "패스워드 설정" , function(){} );
							return;
						}
					});
				}
			}
		});
	});
}

function bindNoticePage ()
{
	$(document).on("pagebeforeshow","#page-notice",function()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		$("#notice-title").html(pageTitle);
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/notice_list_show.php",
			data:{cat:pageCategory},
			dataType:"json",
			type:"post",
			success:function ( resultObj )
			{
				var i; var wholeExpr = "";
				for ( i = 0 ; i < resultObj.length ; i++ )
				{
					var row = resultObj[i];
					var rowExpr = 
						"<div data-role=\"collapsible\">" +
						"	<h3>" + row.title + "</h3>" +
						"	<p>" + row.content + "</p>";
					if ( row.image_path != null )
					{
						rowExpr += "<img src=\"" + row.image_path + "\" style=\"width:100%;\">";
					}
					
					rowExpr += "</div>";
					wholeExpr += rowExpr;
				}
				$("#notice-list").html(wholeExpr)
				.trigger("create");
			}
		});
	});
}

function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , false);
}