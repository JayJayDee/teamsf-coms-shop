$(document).ready(function()
{
	var lh = new ShopLoginHandler ();
	//lh.flushLogin();
	
	if ( lh.isLogged() == true )
	{
		lh.doLogin ( function ( result )
		{
			if ( resultObj.success == true ) { 
				window.location = "./coms/index.html";
			}
			else { alert ( "실패! 실패사유 : " + resultObj.cause ); }
		});
	}

	$("#btn-login").on("click", function(){

		var id = $("#input-id").val();
		var pw = $("#input-pw").val();

		lh.setId ( id ); lh.setPw ( pw );

		lh.doLogin ( function ( resultObj )
		{
			if ( resultObj.success == true ) { 
				window.location = "./coms/index.html";
			}
			else { alert ( "실패! 실패사유 : " + resultObj.cause ); }
		});
	});

});