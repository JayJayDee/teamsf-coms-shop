
var g_lh = null;

function initAll ()
{
	g_lh = new ShopLoginHandler ();
	//lh.flushLogin();
	
	if ( g_lh.isLogged() == true ) 
	{
		window.location = "./coms/index.html";
		return;
	}

	$("#btn-login").on("click", function()
	{
		var id = $("#input-id").val();
		var pw = $("#input-pw").val();

		g_lh.setId ( id ); g_lh.setPw ( pw );

		g_lh.doLogin ( function ( resultObj )
		{
			if ( resultObj.success == true ) 
			{ 
				window.location = "./coms/index.html";
			}
			else 
			{ 
				doAlert ( resultObj.cause , "로그인 실패" , function (){} );
			}
		});
	});
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , false);
}