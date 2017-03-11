zeeEditor_objects.currentObject;
///////////////////////////////////////////CIRCLE ////////////////////////////////////////////
zeeEditor_objects.zeeEditor_circle_loaded = false;
zeeEditor_objects.zeeEditor_circle_draw_start = false;
zeeEditor_objects.zeeEditor_circle_draw_x = 0;
zeeEditor_objects.zeeEditor_circle_draw_y = 0;
zeeEditor_objects.zeeEditor_circle_draw_init = function(){
	canvas.defaultCursor = 'crosshair';
};

zeeEditor_objects.zeeEditor_circle_draw_mouse_down = function(pointer) {
	canvas.deactivateAll();
	canvas.selection = false;

    zeeEditor_objects.zeeEditor_circle_draw_start = true;
    zeeEditor_objects.zeeEditor_circle_draw_x = pointer.x;
    zeeEditor_objects.zeeEditor_circle_draw_y = pointer.y;

    var circle = new fabric.Circle({
        radius: 0, 
        left: zeeEditor_objects.zeeEditor_circle_draw_x, 
        top: zeeEditor_objects.zeeEditor_circle_draw_y, 
        fill: '#f55000',
		perPixelTargetFind: true
    });

    canvas.add(circle);
    canvas.renderAll();
	zeeEditor_objects.currentObject = circle;
};

zeeEditor_objects.zeeEditor_circle_draw_mouse_up = function(pointer) {
	if(zeeEditor_objects.zeeEditor_circle_draw_start)
	    zeeEditor_objects.zeeEditor_circle_draw_start = false;

	var circle = zeeEditor_objects.currentObject.clone();
	canvas.remove(zeeEditor_objects.currentObject);
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
	// canvas.selection = true;
	canvas.defaultCursor = 'default';
	zeeEditor_objects.currentObject = null;
};

zeeEditor_objects.zeeEditor_circle_draw_mouse_move = function(pointer) {
	if(!zeeEditor_objects.zeeEditor_circle_draw_start)
        return false;

    var w = Math.abs(pointer.x - zeeEditor_objects.zeeEditor_circle_draw_x),
    h = Math.abs(pointer.y - zeeEditor_objects.zeeEditor_circle_draw_y);

    if (!w || !h)
        return false;

	var circle = zeeEditor_objects.currentObject;
	if(circle != null)
		circle.set('radius', parseInt(w / 2));

    canvas.renderAll(); 
};

zeeEditor_objects.zeeEditor_circle_init = function(objType) {
	var obj = canvas.getActiveObject();
	jQuery('#object_circle_color').val(obj.get('fill'));
	jQuery('#object_circle_strokecolor').val(obj.get('stroke'));
	
	jQuery("#circleOpacity").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('opacity')*100,
	    startAngle: 315,
		change: function(e) {
			var size = this.getValue();
			size = size/100;
			obj.set({ opacity : size });
			canvas.renderAll();
		},
	});
	jQuery("#circleStroke").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('strokeWidth'),
		max: 10,
	    startAngle: 315,
		change: function(e) {
			var size = this.getValue();
			//var obj = canvas.getActiveObject();
			//obj.set({ stroke: '#c3bfbf' });
			obj.set({ strokeWidth  : size });
			//(e.getValue());
			canvas.renderAll();
		},
	});

	jQuery("#circleBlur").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('blur'),
		max: 10,
	    startAngle: 315,
		change: function(e) {
			var size = this.getValue();
			obj.set({ blur : size });
			setObjectBlur(obj, size);
			canvas.renderAll();
		},
	});

	var shadow = obj.getShadow();
	var shadow_color = '#000000';
	var shadow_blur = 1;
	var shadow_x = 1;
	var shadow_y = 1;
	if (shadow !== null){
		shadow_color = shadow.color;
		shadow_blur = shadow.blur;
		shadow_x = shadow.offsetX;
		shadow_y = shadow.offsetY;
	}

	if(!zeeEditor_objects.zeeEditor_circle_loaded) { //for once
		jQuery('#zCircleShadowBlur').slider({
		tooltip: 'hide',
		value: parseInt(shadow_blur),
		formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
		
		jQuery('#zCircleShadowOffsetX').slider({
			tooltip: 'hide',
			value: parseInt(shadow_x),
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
		
		jQuery('#zCircleShadowOffsetY').slider({
			tooltip: 'hide',
			value: parseInt(shadow_y),
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
	}
	else
	{
		
	}// #zeeEditor_objects.zeeEditor_circle_loaded = false;

	zeeEditor_objects.zeeEditor_circle_loaded = true;
};

jQuery(document).ready(function(e) {
	jQuery(document).on('change','#object_circle_color', function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
        if(obj) {
	   		obj.setFill('#' + val);
			canvas.renderAll();
		}
		zeeEditor_objects.zeeEditor_circle_init();
    });

	jQuery(document).on('change','#object_circle_strokecolor', function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
        if(obj) {
			obj.set('stroke', '#' + val);
			canvas.renderAll();
		}
		zeeEditor_objects.zeeEditor_circle_init();
    }); 
	
	jQuery(document).on('click','.zCircleBringForward', function(e) {	
        var obj = canvas.getActiveObject();
		canvas.bringForward(obj);
		canvas.renderAll();
		zeeEditor_objects.zeeEditor_circle_init(); 
    }); 
	
	jQuery(document).on('click','.zCircleSendBackward', function(e) {
		var obj = canvas.getActiveObject();
		obj.sendToBack();

		canvas.renderAll();
		zeeEditor_objects.zeeEditor_circle_init(); 
    });
	
	jQuery(document).on('click','.zCircleAlignLeftBtn', function(e) {
        var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setLeft(canvas_left + (obj.left - bound.left));
		obj.setCoords();
		canvas.renderAll();
    });

	jQuery(document).on('click','.zCircleAlignTopBtn', function(e) {
        var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setTop(canvas_top + (obj.top - bound.top));
		// obj.setTop(canvas_top);
		obj.setCoords();
		canvas.renderAll();
    });

	jQuery(document).on('click','.zCircleAlignCenterBtn', function(e) {
		var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setLeft(obj.left + ((canvas_left + canvas_width * 0.5) - (bound.left + bound.width * 0.5)));
		// obj.centerH();
		obj.setCoords();
		canvas.renderAll();
    });

	jQuery(document).on('click','.zCircleAlignVCenterBtn', function(e) {
		var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setTop(obj.top + ((canvas_top + canvas_height * 0.5) - (bound.top + bound.height * 0.5)));
		// obj.centerV();
		obj.setCoords();
		canvas.renderAll();
    });

	jQuery(document).on('click','.zCircleAlignRightBtn', function(e) {
		var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setLeft(obj.left + (canvas_left + canvas_width - (bound.left + bound.width)));
		// obj.setLeft(canvas_left + canvas_width - obj.getWidth());
		obj.setCoords();
		canvas.renderAll();
    });

	jQuery(document).on('click','.zCircleAlignBottomBtn', function(e) {
		var obj = canvas.getActiveObject();
		var bound = obj.getBoundingRect();
		obj.setTop(obj.top + ((canvas_top + canvas_height) - (bound.top + bound.height)));
		obj.setCoords();
		canvas.renderAll();
    });
});

///////////////////////////////////////////Path///////////////////////////////////////////////

zeeEditor_objects.pathgroup_colors = [];
zeeEditor_objects.zeeEditor_pathgroup_init = function()
{ 
	//canvas.selection = false;
	var obj = canvas.getActiveObject();
	if(obj) {
		for(var i = 0; i < obj.paths.length; i ++) {
			var is_white_color = false;
			if(obj.paths[i].fill == "rgb(0,0,0)")
				is_white_color = false;
			if(obj.paths[i].fill == '#FFFFFF' || obj.paths[i].fill == 'rgb(255,255,255)')
				is_white_color = true;
			zeeEditor_objects.pathgroup_colors.push(is_white_color);
		}
	}
	//alert(obj.get('fill'));
	// jQuery('.zRectColor').val(obj.get('fill'));
	// jQuery('.zRectStrokeColor').val(obj.get('stroke'));
	//alert(obj.getShadow('blur'));
	
	jQuery("#pathOpacity").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('opacity')*100,
	    startAngle: 315,
		change: function(e)
		{
			var size = this.getValue();
			//var obj = canvas.getActiveObject();
			size = size/100;
			obj.set({ opacity : size });
			//(e.getValue());
			canvas.renderAll();
		},
	});
	jQuery("#pathStroke").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('strokeWidth'),
		max: 10,
	    startAngle: 315,
		change: function(e)
		{
			var size = this.getValue();
	        for(var i = 0; i < obj.paths.length; i ++) {
				obj.paths[i].set({ strokeWidth  : size });
			}
			//(e.getValue());
			canvas.renderAll();
		},
	});
	jQuery("#pathBlur").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('blur'),
		max: 10,
	    startAngle: 315,
		change: function(e)
		{
			var size = this.getValue();
			obj.set({ 'blur'  : size });
			setObjectBlur(obj, size);
			canvas.renderAll();
		},
	});
};

zeeEditor_objects.zeeEditor_image_init = function()
{ 
	// canvas.selection = false;
	var obj = canvas.getActiveObject();

	jQuery("#imageStroke").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
		max: 10,
	    startAngle: 315,
		change: function(e){
			var size = this.getValue();
			var obj = canvas.getActiveObject();
			obj.set({ strokeWidth  : size });
			canvas.renderAll();
		},
	});
	jQuery("#imageBlur").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
		max: 10,
		value : obj.get('blur'),
	    startAngle: 315,
		change: function(e){
			var size = this.getValue();
			setObjectBlur(obj, size);
			canvas.renderAll.bind(obj);
		},
	});

	jQuery("#imageOpacity").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
		max: 100,
		value : obj.get('opacity')*100,
	    startAngle: 315,
		change: function(e)
		{
			var size = this.getValue();
			size = size / 100;
			obj.set({ opacity : size });
			canvas.renderAll();
		},
	});
}


jQuery(document).ready(function(e) 
{
	jQuery(document).on('change','#zImageShadowBlur, #zImageShadowOffsetX, #zImageShadowOffsetY',function(e) {
		
		var shadow_blur = jQuery('#zImageShadowBlur').val();
		var shadow_x 	= jQuery('#zImageShadowOffsetX').val();
		var shadow_y 	= jQuery('#zImageShadowOffsetY').val();
		
		//var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
	   	//obj.set({ fill  : val }); 
		var shadow = obj.getShadow();
		if(shadow) {
			if(!shadow.color)
				shadow.color = '#000000';
			shadow.blur = parseInt(shadow_blur);
			shadow.offsetX = parseInt(shadow_x);
			shadow.offsetY = parseInt(shadow_y);
		}
		else {
			shadow = {color:'#000000', blur:shadow_blur, offsetX:shadow_x, offsetX:shadow_y};
		}
		
		obj.setShadow(shadow);
		/*obj.setShadow({
		  blur: parseInt(shadow_blur),
		  offsetX: parseInt(shadow_x),
		  offsetY: parseInt(shadow_y)
		});*/
		canvas.renderAll();
    }); 
    	
	jQuery(document).on('change','.zImageShadowColor',function(e) {
		var val = jQuery(this).val(); 
        var obj = canvas.getActiveObject();
		var shadow = obj.getShadow();
		if(shadow) {
			shadow.color = val;
		}
		else {
			shadow = {color: val};
		}
		obj.setShadow(shadow);
		canvas.renderAll();
    }); 
	jQuery(document).on('change','.path_color',function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
        var color 		= "#000000";
        var org_color 	= jQuery(this).attr("org");

        for(var i = 0; i < obj.paths.length; i ++) {
			if(!obj.paths[i].fill || obj.paths[i].fill == "rgb(0,0,0)")
				color = "#000000";
			else
				color = obj.paths[i].fill;
			if(org_color == color) {
				obj.paths[i].set({fill : val});
				jQuery(this).attr("org", val);
			}
		};
		canvas.renderAll();
    });
	jQuery(document).on('change','.zImageBlur',function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
	   		obj.set({ stroke  : val });
	   canvas.renderAll();
    }); 
});

jQuery(document).ready(function(e) {
	jQuery(document).on('change','#pathgroup_color1',function(e) {
        var obj = canvas.getActiveObject();
        if(obj) {
			var val = jQuery(this).val();
       		for(var i = 0; i < obj.paths.length; i ++) {
       			if(zeeEditor_objects.pathgroup_colors[i])
					obj.paths[i].setFill('#' + val);
			}
			canvas.renderAll();
		}
    });
	jQuery(document).on('change','#pathgroup_color2',function(e) {
        var obj = canvas.getActiveObject();
        if(obj) {
			var val = jQuery(this).val();
       		for(var i = 0; i < obj.paths.length; i ++) {
       			if(!zeeEditor_objects.pathgroup_colors[i])
					obj.paths[i].setFill('#' + val);
			}
			canvas.renderAll();
		}
    });
	jQuery(document).on('change','#pathgroup_border_color',function(e) {
        var obj = canvas.getActiveObject();
        if(obj) {
			var val = jQuery(this).val();
       		for(var i = 0; i < obj.paths.length; i ++)
				obj.paths[i].set('stroke', '#' + val);
			canvas.renderAll();
		}
    });
});

///////////////////////////////////////////SQUARE ////////////////////////////////////////////
zeeEditor_objects.zeeEditor_rect_loaded = false;
zeeEditor_objects.zeeEditor_square_draw_start = false;
zeeEditor_objects.zeeEditor_square_draw_x = 0;
zeeEditor_objects.zeeEditor_square_draw_y = 0;
zeeEditor_objects.zeeEditor_square_draw_init = function(){
	canvas.defaultCursor = 'crosshair';
};
zeeEditor_objects.zeeEditor_square_draw_mouse_down = function(pointer){
	canvas.deactivateAll();
	canvas.selection = false;

    zeeEditor_objects.zeeEditor_square_draw_start = true;
    zeeEditor_objects.zeeEditor_square_draw_x = pointer.x;
    zeeEditor_objects.zeeEditor_square_draw_y = pointer.y;

    var square = new fabric.Rect({ 
        width: 0, 
        height: 0, 
        left: zeeEditor_objects.zeeEditor_square_draw_x, 
        top: zeeEditor_objects.zeeEditor_square_draw_y, 
        fill: '#000'
    });

    canvas.add(square); 
    canvas.renderAll();
	zeeEditor_objects.currentObject = square;
};

zeeEditor_objects.zeeEditor_square_draw_mouse_up = function(pointer){
	if(zeeEditor_objects.zeeEditor_square_draw_start)
        zeeEditor_objects.zeeEditor_square_draw_start = false;

	var square = zeeEditor_objects.currentObject.clone();
	canvas.remove(zeeEditor_objects.currentObject);

    canvas.add(square);
    canvas.setActiveObject(square);
    canvas.renderAll();
	canvas.selection = true;
	canvas.defaultCursor = 'default';
	canvas.setActiveObject(square);
	zeeEditor_objects.currentObject = null;
};

zeeEditor_objects.zeeEditor_square_draw_mouse_move = function(pointer){
	if(!zeeEditor_objects.zeeEditor_square_draw_start)
        return false;

    var w = Math.abs(pointer.x - zeeEditor_objects.zeeEditor_square_draw_x),
    h = Math.abs(pointer.y - zeeEditor_objects.zeeEditor_square_draw_y);

    if (!w || !h)
        return false;

 	var square = zeeEditor_objects.currentObject;
	if(square != null)
   		square.set('width', w).set('height', h);
    canvas.renderAll(); 
};

zeeEditor_objects.zeeEditor_rect_init = function() { 
	var obj = canvas.getActiveObject();
	jQuery('#object_rect_color').val(obj.get('fill'));
	jQuery('#object_rect_strockcolor').val(obj.get('stroke'));

	jQuery("#rectOpacity").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('opacity') * 100,
	    startAngle: 315,
		change: function(e){
			var size = this.getValue();
			size = size/100;
			obj.set({ opacity : size });
			canvas.renderAll();
		},
	});

	jQuery("#rectStroke").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('strokeWidth'),
		max: 10,
	    startAngle: 315,
		change: function(e){
			var size = this.getValue();
			//var obj = canvas.getActiveObject();
			//obj.set({ stroke: '#c3bfbf' });
			obj.set({ strokeWidth  : size });
			//(e.getValue());
			canvas.renderAll();
		},
	});

	var shadow = obj.getShadow();
	var shadow_color = '#000000';
	var shadow_blur = 0;
	var shadow_x = 0;
	var shadow_y = 0;
	if (shadow !== null){
		shadow_color = shadow.color;
		shadow_blur = shadow.blur;
		shadow_x = shadow.offsetX;
		shadow_y = shadow.offsetY;
	}
	jQuery('#object_rect_shadowcolor').val(shadow_color);
	//alert(shadow.blur);
	if(jQuery('#zRectShadowBlur').hasClass('slider'))
	jQuery('#zRectShadowBlur').slider('setValue',parseInt(shadow_blur));
	if(jQuery('#zRectShadowOffsetX').hasClass('slider'))
	jQuery('#zRectShadowOffsetX').slider('setValue',parseInt(shadow_x));
	if(jQuery('#zRectShadowOffsetY').hasClass('slider'))
	jQuery('#zRectShadowOffsetY').slider('setValue',parseInt(shadow_y));

	if(!zeeEditor_objects.zeeEditor_rect_loaded) { //for once

		jQuery('#zRectShadowBlur').slider({
			tooltip: 'hide',
			value: parseInt(shadow_blur),
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
		
		jQuery('#zRectShadowOffsetX').slider({
			tooltip: 'hide',
			value: parseInt(shadow_x),
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
		
		jQuery('#zRectShadowOffsetY').slider({
			tooltip: 'hide',
			value: parseInt(shadow_y),
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});
	}
	else {
		
	}// #zeeEditor_objects.zeeEditor_rect_loaded = false;

	zeeEditor_objects.zeeEditor_rect_loaded = true;
};

///////////////////////////////////////////TRIANGLE ////////////////////////////////////////////
zeeEditor_objects.zeeEditor_triangle_draw_start = false;
zeeEditor_objects.zeeEditor_triangle_draw_x = 0;
zeeEditor_objects.zeeEditor_triangle_draw_y = 0;
zeeEditor_objects.zeeEditor_triangle_draw_init = function(){
	canvas.defaultCursor = 'crosshair';
};
zeeEditor_objects.zeeEditor_triangle_draw_mouse_down = function(pointer){
	canvas.deactivateAll();
	canvas.selection = false;

    zeeEditor_objects.zeeEditor_triangle_draw_start = true;
    zeeEditor_objects.zeeEditor_triangle_draw_x = pointer.x;
    zeeEditor_objects.zeeEditor_triangle_draw_y = pointer.y;

    var triangle = new fabric.Triangle({ 
        width: 1, 
        height: 1, 
        left: zeeEditor_objects.zeeEditor_triangle_draw_x, 
        top: zeeEditor_objects.zeeEditor_triangle_draw_y, 
        fill: '#000'
    });

    canvas.add(triangle);
    canvas.renderAll();
	zeeEditor_objects.currentObject = triangle;
};

zeeEditor_objects.zeeEditor_triangle_draw_mouse_up = function(pointer) {
	if(zeeEditor_objects.zeeEditor_triangle_draw_start)
        zeeEditor_objects.zeeEditor_triangle_draw_start = false;

	var triangle = zeeEditor_objects.currentObject.clone();
	canvas.remove(zeeEditor_objects.currentObject);

    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
	canvas.selection = true;
	canvas.defaultCursor = 'default';
	zeeEditor_objects.currentObject = null;
};

zeeEditor_objects.zeeEditor_triangle_draw_mouse_move = function(pointer){
	if(!zeeEditor_objects.zeeEditor_triangle_draw_start)
        return false;

    var w = Math.abs(pointer.x - zeeEditor_objects.zeeEditor_triangle_draw_x),
    h = Math.abs(pointer.y - zeeEditor_objects.zeeEditor_triangle_draw_y);

    if (!w || !h)
        return false;

    var triangle = zeeEditor_objects.currentObject; 
	if(triangle != null)
    	triangle.set('width', w).set('height', h);
    canvas.renderAll(); 
};

///////////////////////////////////////////LINE ////////////////////////////////////////////
zeeEditor_objects.zeeEditor_line_draw_start = false;
zeeEditor_objects.zeeEditor_line_draw_x = 0;
zeeEditor_objects.zeeEditor_line_draw_y = 0;
zeeEditor_objects.zeeEditor_line_draw_init = function() {
	canvas.defaultCursor = 'crosshair';
};

zeeEditor_objects.zeeEditor_line_draw_mouse_down = function(pointer) {
	canvas.deactivateAll();
	canvas.selection = false;

    zeeEditor_objects.zeeEditor_line_draw_start = true;
    zeeEditor_objects.zeeEditor_line_draw_x = pointer.x;
    zeeEditor_objects.zeeEditor_line_draw_y = pointer.y;

	var line = new fabric.Line([zeeEditor_objects.zeeEditor_line_draw_x, zeeEditor_objects.zeeEditor_line_draw_y, zeeEditor_objects.zeeEditor_line_draw_x, zeeEditor_objects.zeeEditor_line_draw_y ],{ 
		stroke: 'red',
		strokeWidth: 1});

    canvas.add(line); 
    canvas.renderAll();
	zeeEditor_objects.currentObject = line;
};

zeeEditor_objects.zeeEditor_line_draw_mouse_up = function(pointer){
	if(zeeEditor_objects.zeeEditor_line_draw_start)
        zeeEditor_objects.zeeEditor_line_draw_start = false;

    var line = zeeEditor_objects.currentObject.clone();
	canvas.remove(zeeEditor_objects.currentObject);

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
	canvas.selection = true;
	canvas.defaultCursor = 'default';
	zeeEditor_objects.currentObject = null;
};

zeeEditor_objects.zeeEditor_line_draw_mouse_move = function(pointer){
	if(!zeeEditor_objects.zeeEditor_line_draw_start)
        return false;

    var w = Math.abs(pointer.x - zeeEditor_objects.zeeEditor_line_draw_x),
    h = Math.abs(pointer.y - zeeEditor_objects.zeeEditor_line_draw_y);

    if (!w || !h)
        return false;

    var line = zeeEditor_objects.currentObject; 
	if(line != null)
    	line.set('x2', pointer.x).set('y2', pointer.y);
    canvas.renderAll(); 
};
