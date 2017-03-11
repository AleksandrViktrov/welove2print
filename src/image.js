
/************************************************************
	
	Created by 		: Giryong.Jong 
	Purpose 		: To manage all the image files
	Created Date 	: 2016-06-13

**************************************************************/

var ClassImageProc 		= function()
{
	var main 			= this;

	main.imageObj 		= null;
	main.canvas 		= null;
	main.qrcode 		= null;
	main.zoomRate  		= 1.0;

	main.init 			= function()
	{
		main.canvas 	= window._canvas;
		main.initEvents();
		main.initEnv();
		main.setZoomRate(1.0);
	}

	main.initEvents 	= function()
	{
		$(".canvas-container").droppable(
		{
			drop : function(evt, ui)
			{
				var left 	= evt.clientX - ($(window).width() * 0.166 + 60);
				var top 	= evt.clientY - 80;
				var srcurl 	= $(ui.helper).children("img").attr("src");
				main.createImage(srcurl, left, top);
			}
		})

		$(".sidebar li").click(function()
		{
			$(".active").removeClass("active");
			$(this).addClass("active");

			if($(this).find("#btn_add_image").length)
			{
				$("#image_property_area").fadeIn();
			}
			else
			{
				$("#image_property_area").fadeOut();
				$("#background_area").css("display", "none");
			}

			if($(this).find("#btn_add_clipart").length)
			{
				$(".active_overlay").removeClass("active_overlay");
				$("#overlay").css("display", "block");
				$("#overlay_clipArt").addClass("active_overlay");
				$("#over_overlay").fadeIn();
			}

			if($(this).find("#btn_add_social").length)
			{
				$(".active_overlay").removeClass("active_overlay");
				$("#overlay").css("display", "block");
				$("#overlay_social").addClass("active_overlay");
				$("#over_overlay").fadeIn();
			}

			if($(this).find("#btn_create_qr").length)
			{
				$(".active_overlay").removeClass("active_overlay");
				$("#overlay").css("display", "block");
				$("#overlay_qrcode").addClass("active_overlay");
				$("#over_overlay").fadeIn();
			}

			if($(this).find("#btn_background").length)
			{
				$("#background_area").fadeIn();
			}
			else
			{
				$("#background_area").fadeOut();
			}
			
			// if($(this).find("#btn_loadSVG").length)
			// {
			// 	$("#background_area").fadeIn();
			// }
			// else
			// {
			// 	$("#background_area").fadeOut();
			// }
		});

		$(".bgfillcolor").colorpicker(
		{ 
			parts:          'full',
	        alpha:          true,
	        showOn:         'both',
	        buttonColorize: true,
	        showNoneButton: true,
	    });

		$("#qr_bgcolor").change(function(evt, ui)
	    {

	    });

	    $("#source_list li").click(function()
	    {
	    	$("#source_list .sel").removeClass("sel");
	    	$(this).addClass("sel");
	    });
	    $('.bgfillcolor').change(function(evt) {
	    	onObjectModified();
	    });
		$("#btn_fillcolor").change(function(evt, ui)
		{
			var color 	 	= $(".bgfillcolor").val();
			// $("#preview_border").css({"background" : "#" + color});
			main.canvas.backgroundColor = '#' + color;
			main.canvas.renderAll();
	    	evt.stopPropagation();
		});

		$("#btn_delbackground").click(function()
		{
			// $("#preview_border").css({"background" : ""});
			main.canvas.backgroundImage = null;
			main.canvas.backgroundColor = '';
			main.canvas.renderAll();
		});

		$("#btn_add_more").click(function(evt)
		{
			$("#btn_add_more").css("display", "none");
			// $("#uploaded_image_list").css("display", "none");
			$("#uploaded_image_list").empty();
			$("#upload_form").fadeIn();
			evt.stopPropagation();
		});

		$(document).on("click", "#btn_normal" ,function(evt)
		{
			var sel_obj = main.canvas.getActiveObject();
			setObjectFilter(sel_obj, 0);
			sel_obj.applyFilters();
			main.canvas.renderAll();
			evt.stopPropagation();
		});

		$(document).on("click", "#btn_gray" ,function(evt)
		{
			var sel_obj = main.canvas.getActiveObject();
			setObjectFilter(sel_obj, 1);
			sel_obj.applyFilters(canvas.renderAll.bind(main.canvas));
			evt.stopPropagation();
		});

		$(document).on("click", "#btn_sepia", function(evt)
		{
			var sel_obj = main.canvas.getActiveObject();
			setObjectFilter(sel_obj, 2);
			sel_obj.applyFilters(canvas.renderAll.bind(main.canvas));
			evt.stopPropagation();
		});

		$(document).on("click", "#btn_invert", function(evt)
		{
			var sel_obj = main.canvas.getActiveObject();
			setObjectFilter(sel_obj, 3);
			sel_obj.applyFilters(canvas.renderAll.bind(main.canvas));
			evt.stopPropagation();
		});

		$(document).on("keyup", "#text_qrcode", function()
		{
			main.qrcode.makeCode($("#text_qrcode").val());
		});

		$("#qrcolor").colorpicker();
	    $("#qrbgcolor").colorpicker();

		$(document).on("change", "#qrcolor" ,function(evt, ui)
	    {
	    	main.qrcode._htOption.colorDark = "#" + $(this).val();
	    	main.qrcode.makeCode($("#text_qrcode").val());
	    });

	    $(document).on("change", "#qrbgcolor" ,function(evt, ui)
	    {
	    	main.qrcode._htOption.colorLight = "#" + $(this).val();
	    	main.qrcode.makeCode($("#text_qrcode").val());
	    });

		$("#btn_qrcode_addimg").click(function()
		{
			var url 	= $("#qrcode_area img").attr("src");
			var width 	= $("#input_qr_width").val();
			var height 	= $("#input_qr_height").val();

			fabric.Image.fromURL(url, function(img)
			{
				img.set(
				{
					left 	: canvas_left + 50, 
					top 	: canvas_top + 50,
					scaleX  : width / img.width,
					scaleY 	: height / img.height,
					type 	: "qrcode"
				});
				console.log(width, height, img.width, img.height);

				main.canvas.add(img);
			});

			$("#overlay").fadeOut();
			$("#over_overlay").css("display","none");
		});

		$(".tab li").click(function()
		{
			$(".tab").children(" .sel").removeClass("sel");
			$(this).addClass("sel");

			if($(this).attr("id") == "btn_url")
			{
				main.qrcode.makeCode("http://www.sample.com");
				// $("#text_qrcode").html("http://www.sample.com");
				// $("#text_qrcode").val("http://www.sample.com");
				$("#text_qrcode").attr("placeholder", "http://www.sample.com");
			}

			if($(this).attr("id") == "btn_txt")
			{
				main.qrcode.makeCode("[Text Here]");
				// $("#text_qrcode").html("[Text Here]");
				// $("#text_qrcode").val("[Text Here]");
				$("#text_qrcode").attr("placeholder", "Text Here");
			}

			if($(this).attr("id") == "btn_num")
			{
				main.qrcode.makeCode("123456789");
				// $("#text_qrcode").html("123456789");
				// $("#text_qrcode").val("123456789");
				$("#text_qrcode").attr("placeholder", "123456789");
			}
		});

		$(document).on("click", ".delete_button", function(evt)
		{
			crud.delete();
			// main.canvas.remove(main.canvas.getActiveObject());
			// main.canvas.renderAll();
			jQuery('.zPanels').hide();
			evt.stopPropagation();
		});
		$(document).on("click", "#check_keep_rate", function(evt)
		{
			var obj = main.canvas.getActiveObject();
			if(obj.get('type') == "image" || obj.get('type') == "qrcode")
			{
				if($("#check_keep_rate").parent().find(":checked").length)
				{
					if(obj.scaleX > obj.scaleY)
					{
						obj.left += obj.width * (obj.scaleX - obj.scaleY) / 2;
						obj.scaleX = obj.scaleY;
					}
					else
					{
						obj.top += obj.height * (obj.scaleY - obj.scaleX) / 2;
					 	obj.scaleY = obj.scaleX;
					}
					obj.set('lockUniScaling', true);
				}
				else
				{
					obj.set('lockUniScaling', false);
				}
			}
			main.canvas.renderAll();
			evt.stopPropagation();
		});
		$(document).on("click", ".check_lock_object", function(evt)
		{
			var obj = main.canvas.getActiveObject();
			// var check_obj = $(".check_lock_object").parent().find(":checked");
			if(!obj.lockRotation)
			{
				obj.lockMovementX = true;
				obj.lockMovementY = true;
				obj.lockRotation = true;
				obj.lockScalingX = true;
				obj.lockScalingY = true;
			}
			else
			{
				obj.lockMovementX = false;
				obj.lockMovementY = false;
				obj.lockRotation = false;
				obj.lockScalingX = false;
				obj.lockScalingY = false;
			}
			main.canvas.renderAll();
			evt.stopPropagation();
		});
		$(document).on("click", "#preview_button", function(evt)
		{
			main.canvas.deactivateAll().renderAll();
			$("#preview_panel").css("display", "block");
			showBorder(false);

			var svg = main.canvas.toSVG();

			$("#preview_image").empty();
			$("#preview_image").append(svg);

			// var svg = main.canvas.toDataURL();
			// $("#preview_image").src = svg;
			showBorder(true);
			evt.stopPropagation();
		});
		$(document).on("click", "#close_preview_button", function(evt)
		{
			$("#preview_panel").css("display", "none");
			evt.stopPropagation();
		});
		$(document).on("click", "#zoom_out_btton", function(evt)
		{
			var zoomRate = main.zoomRate;
			main.setZoomRate(zoomRate/1.1);
			evt.stopPropagation();
		});
		$(document).on("click", "#zoom_in_btton", function(evt)
		{
			var zoomRate = main.zoomRate;
			main.setZoomRate(zoomRate*1.1);

			evt.stopPropagation();
		});
		$(document).on("click", "#zoom_reset", function(evt)
		{
			main.setZoomRate(1);
			evt.stopPropagation();
		});
		$(document).on("click", "", function(event)
		{
			var tagName = $(event.target).get(0).tagName;
			if(tagName != "CANVAS" && tagName != "INPUT" && tagName != "BUTTON" && tagName != "A" && tagName != "SPAN")
			{
				var parentEls = $(event.target).parents();
				var founded = false;
				parentEls.each(function(i) {
					var className = $(parentEls[i]).attr('class') + "";
					if(className.indexOf('zPanels') > -1 || className.indexOf('ui-colorpicker') > -1)
						founded = true;
				});
				if(!founded)
				{
			 		main.canvas.deactivateAll().renderAll();
					jQuery('.zPanels').hide();
				}
			}
		});
		jQuery(document).on('click','.w2p-save',function(e){
			main.canvas.deactivateAll().renderAll();
			removeBorder();
			var svg = main.canvas.toSVG({
				suppressPreamble:true,
				viewBox: {
					x: canvas_left,
					y: canvas_top,
					width: canvas_width,
					height: canvas_height
				}
			});
			var data = {"svg":svg};
		    $.ajax (
		    {
		        type: "POST",
		        url: "server/php/filesave.php", 
		        data: data,
		        cache: false,
		        success: function(result) {
		        	console.log('file is saved', result);
					initBorder();
		        }
      		});

			e.stopPropagation();
		});
	}

	main.initEnv 		= function()
	{
		// QRCode
		main.qrcode = new QRCode(document.getElementById("qrcode_area"), 
		{
			width : 200,
			height : 200
		});

		main.qrcode.makeCode("");
		$("#text_qrcode").html("");
	}

	main.setZoomRate = function(rate)
	{
		if(rate > 2 || rate < 0.4)
			return;
		main.zoomRate = rate;
		var width = total_width * rate;
		var height = total_height * rate;
		var left = (total_width - width) / 2;
		if(left < 0)
			left = 0;

		canvas_left = (total_width - canvas_width) / 2;

		$("#canvas_box").css('margin-left', left);
		$("#canvas_box").css('width', total_width);
		$("#canvas_box").css('height', total_height);
		
		$('#border_view').css('left', (left + canvas_left * rate + 3));
		$('#border_view').css('top', (canvas_top + 3) * rate);
		$('#border_view').css('width', (canvas_width - 6) * rate);
		$('#border_view').css('height', (canvas_height - 6) * rate);

		$("#welove2pc").css("width", width);
		$("#welove2pc").css("height", height);
		$(".upper-canvas").css("width", width);
		$(".upper-canvas").css("height", height);
		$(".canvas-container.ui-droppable").css('width', width);
		$(".canvas-container.ui-droppable").css('height', height);

		setZoomBorder(rate);
	}

	main.createImage 		= function(srcurl, x, y)
	{
		var urls = srcurl.split('/thumbnail');
		var url = urls[0] + urls[1];
		fabric.Image.fromURL(url, function(img)
		{
			var cw = canvas_width - 30;
			var ch = canvas_height - 30;
			var width = img.width;
			var height = img.height;
			var scale = 1;
			if(height > ch)
			{
				scale = ch / height;
			}
			if(scale * width > cw)
			{
				scale = scale * cw / (scale* width);
			}
			img.set(
			{
				left 	: x, 
				top 	: y,
				width : width * scale,
				height : height * scale,
				lockUniScaling : true
			});

			main.canvas.add(img);
			main.canvas.setActiveObject(img);
			main.canvas.renderAll();
   			// updateModifications(true);
		});
	}

	main.drawBackground	= function(url, x, y)
	{
		$("#drawing_view").css({"background" : "url(" + url + ")"});

		// fabric.Image.fromURL(url, function(img)
		// {
		// 	for(var i = 0; i < main.canvas._objects.length; i ++)
		// 	{
		// 		if(main.canvas._objects[i].name == "bg_layer" || (main.canvas._objects[i].name == "background"))
		// 		{
		// 			main.canvas._objects[i].remove();
		// 		}
		// 	}

		// 	img.set(
		// 	{
		// 		left 		: x, 
		// 		top 		: y,
		// 		name 		: "background",
		// 		selectable  : false
		// 	});

		// 	main.canvas.add(img);
		// 	main.canvas.sendToBack(img);
		// });
	}

	main.init();
}

function setObjectBlur(object, blur)
{
	if(blur != null)
	{
		var type = object.get('type');
		type = type.replace('-','');
		if(type == 'image' || type == 'qrcode')
		{
			object.set('blur', blur);
			object.filters.pop();
			object.filters.push(new fabric.Image.filters.GaussianBlur(blur * 2));
			object.applyFilters(canvas.renderAll.bind(canvas));
		}
		else if(type == 'circle' || type == 'rect' || type == 'triangle' || type == 'line')
		{
			var color = object.get('fill');
			var shadow = object.getShadow();
			if(shadow)
			{
				if(!color)
					color = '#000000';
				shadow.color = color;
				shadow.blur = blur * 2;
				shadow.offsetX = 0;
				shadow.offsetY = 0;
			}
			else
			{
				shadow = {color:color, blur:blur * 2, offsetX:0, offsetX:0};
			}
			object.setShadow(shadow);
		}
		else if(type == 'pathgroup')
		{
			for(var i = 0; i < object.paths.length; i++) {
				var color = object.paths[i].get('fill');
				if(!color)
					color = '#000000';
				var shadow = object.getShadow();
				if(shadow)
				{
					shadow.color = color;
					shadow.blur = blur * 2;
					shadow.offsetX = 0;
					shadow.offsetY = 0;
				}
				else
				{
					shadow = {color:color, blur:blur * 2, offsetX:0, offsetX:0};
				}
				object.paths[i].setShadow(shadow);
			}
		}
	}
}

function setObjectFilter(object, filter)
{
	var type = object.get('type');
	if(filter != null && (type == 'image' || type == 'qrcode'))
	{
		object.filters.pop();
		if(filter == 0)
		{
			object.applyFilters();
		}
		else if(filter == 1)
		{
			object.filters.push(new fabric.Image.filters.Grayscale());
		}
		else if(filter == 2)
		{
			object.filters.push(new fabric.Image.filters.Sepia());
		}
		else if(filter == 3)
		{
			object.filters.push(new fabric.Image.filters.Invert());
		}
		object.set('filter', filter);
	}
}
