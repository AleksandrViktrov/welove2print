var ClassPopupObj 	= function()
{
	var main 	= this;

	main.canvas = null;

	this.init 		= function()
	{
		main.canvas = window._canvas;
		this.initEvt();
	}

	this.initEvt 	= function()
	{
		$("#over_overlay .popup").draggable({"handle" : ".overlay_title"});

		$(".overlay_close").click(function()
		{
			main.closePopup();
		});

		$(".overlay_imglist li").click(function()
		{
			$(".overlay_imglist .sel").removeClass("sel");
			$(this).addClass("sel");
		});

		$("#btn_clipart_addimg").click(function()
		{
			if($("#clip_list .sel").length)
			{
				var url 	= $("#clip_list .sel img").attr("src").replace(".png", ".svg");

				fabric.loadSVGFromURL(url, function (objects, options)
				{
					var obj = fabric.util.groupSVGElements(objects, options);
						obj.set({left : canvas_left + 50, top : canvas_top + 50});
  					main.canvas.add(obj).renderAll();
				});
			}

			main.closePopup();
		});

		$("#btn_social_addimg").click(function()
		{
			if($("#social_list .sel").length)
			{
				var url 	= $("#social_list .sel img").attr("src").replace(".png", ".svg");

				fabric.loadSVGFromURL(url, function (objects, options)
				{
					var obj = fabric.util.groupSVGElements(objects, options);
						obj.set({left : 150, top : 50});

  					main.canvas.add(obj).renderAll();
				});
			}

			main.closePopup();
		});

		
	}

	this.closePopup 	= function()
	{
		$("#overlay").fadeOut();
		$("#over_overlay").css("display","none");
	}

	main.init();
}