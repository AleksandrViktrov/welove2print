
var canvas_width = 700;
var canvas_height = 300;


var canvas_left = 100;
var canvas_top = 50;

var total_width = canvas_width + canvas_left * 2;
var total_height = canvas_height + canvas_top * 2;



var zeeEditor_objects = {};
var zeeToDraw = "";
var canvas = new fabric.Canvas('welove2pc');
canvas.selection = true;
window._canvas = canvas;
canvas.setWidth(total_width);
canvas.setHeight(total_height);


// canvas.clipTo = function(ctx)
// {
// 	ctx.rect(canvas_left, canvas_top, canvas_width, canvas_height);
// }
canvas.controlsAboveOverlay = true;

var line_border_out = new Array();
var line_border_in = new Array();
var rect_border = new Array();
var border_shadow1 = null;
var border_shadow2 = null;

initBorder();
function initBorder()
{
	for(var i = 0; i < 4; i++)
	{
		if(rect_border[i])
			canvas.remove(rect_border[i]);
		if(line_border_out[i])
			canvas.remove(line_border_out[i]);
		if(line_border_in[i])
			canvas.remove(line_border_in[i]);

		rect_border[i] = new fabric.Rect({
			fill : 'white',
			selectable : false,
		});
		line_border_out[i] = new fabric.Line([0, 0, 0, 0],
		{
	    	strokeDashArray: [5, 5],
	    	stroke: 'red',
			selectable : false,
		});

		line_border_in[i] = new fabric.Line([0, 0, 0, 0],
		{
	    	strokeDashArray: [5, 5],
	    	stroke: 'green',
			selectable : false,
		});
		canvas.add(line_border_out[i]);
		canvas.add(line_border_in[i]);
		canvas.add(rect_border[i]);
	}

	if(border_shadow1)
		canvas.remove(border_shadow1);
	border_shadow1 = new fabric.Rect({
		fill : '',
		stroke : 'gray',
		strokeWidth : 2,
		selectable : false,
		opacity : 0.8,
	});
	canvas.add(border_shadow1);

	if(border_shadow2)
		canvas.remove(border_shadow2);
	border_shadow2 = new fabric.Rect({
		fill : '',
		stroke : 'gray',
		strokeWidth : 2,
		selectable : false,
		opacity : 0.4,
	});
	canvas.add(border_shadow2);
	setZoomBorder(1);
}

function setZoomBorder(rate)
{
	var space1 = 10;
	var space2 = 20;
	var posx1 = canvas_left;
	var posy1 = canvas_top;
	var posx2 = canvas_left + canvas_width;
	var posy2 = canvas_top + canvas_height;
	rect_border[0].set('left', 0).set('top', 0).set('width', total_width).set('height', posy1);
	rect_border[1].set('left', posx1 + canvas_width).set('top', 0).set('width', total_width - posx1 - canvas_width).set('height', total_height);
	rect_border[2].set('left', 0).set('top', posy1 + canvas_height).set('width', total_width).set('height', total_height - posy1 - canvas_height);
	rect_border[3].set('left', 0).set('top', 0).set('width', posx1).set('height', total_height);
	line_border_out[0].set('x1', posx1 + space1).set('y1', posy1 + space1).set('x2', posx2 - space1).set('y2', posy1 + space1);
	line_border_out[1].set('x1', posx2 - space1).set('y1', posy1 + space1).set('x2', posx2 - space1).set('y2', posy2 - space1);
	line_border_out[2].set('x1', posx2 - space1).set('y1', posy2 - space1).set('x2', posx1 + space1).set('y2', posy2 - space1);
	line_border_out[3].set('x1', posx1 + space1).set('y1', posy2 - space1).set('x2', posx1 + space1).set('y2', posy1 + space1);
	line_border_in[0].set('x1', posx1 + space2).set('y1', posy1 + space2).set('x2', posx2 - space2).set('y2', posy1 + space2);
	line_border_in[1].set('x1', posx2 - space2).set('y1', posy1 + space2).set('x2', posx2 - space2).set('y2', posy2 - space2);
	line_border_in[2].set('x1', posx2 - space2).set('y1', posy2 - space2).set('x2', posx1 + space2).set('y2', posy2 - space2);
	line_border_in[3].set('x1', posx1 + space2).set('y1', posy2 - space2).set('x2', posx1 + space2).set('y2', posy1 + space2);
	border_shadow1.set('left', posx1 + 1).set('top', posy1 + 1).set('width', canvas_width - 2).set('height', canvas_height - 2);
	border_shadow2.set('left', posx1).set('top', posy1).set('width', canvas_width).set('height', canvas_height);
	canvas.renderAll();

	$('#preview_border').width(canvas_width);
	$('#preview_border').height(canvas_height);
}

function redrawBorder()
{
	for(var i = 0; i < 4; i++)
	{
		canvas.bringToFront(rect_border[i]);
		canvas.bringToFront(line_border_out[i]);
		canvas.bringToFront(line_border_in[i]);
	}
	canvas.sendToBack(border_shadow1);
	canvas.sendToBack(border_shadow2);
}

function showBorder(bShow)
{
	// if(bShow)
	// {
	// 	canvas.add(border_shadow1);
	// 	canvas.add(border_shadow2);
	// 	for(i = 0; i < 4; i++)
	// 	{
	// 		canvas.add(line_border_out[i]);
	// 		canvas.add(line_border_in[i]);
	// 		canvas.add(rect_border[i]);
	// 	}
	// }
	// else
	// {
	// 	for(i = 0; i < 4; i++)
	// 	{
	// 		// rect_border[i].set('visible', bShow);
	// 		rect_border[i].remove();
	// 		line_border_out[i].remove();
	// 		line_border_in[i].remove();
	// 	}
	// 	border_shadow1.remove();
	// 	border_shadow2.remove();
	// }
	for(var i = 0; i < 4; i++)
	{
		rect_border[i].set('visible', bShow);
		line_border_out[i].set('visible', bShow);
		line_border_in[i].set('visible', bShow);
	}
	border_shadow1.set('visible', bShow);
	border_shadow2.set('visible', bShow);
}

function removeBorder()
{
	for(var i = 0; i < 4; i++)
	{
		// rect_border[i].set('visible', bShow);
		rect_border[i].remove();
		line_border_out[i].remove();
		line_border_in[i].remove();
	}
	border_shadow1.remove();
	border_shadow2.remove();
}


	
function copy(){ 
    if(canvas.getActiveGroup()){ alert(canvas.getActiveGroup());
	copiedObjects = new Array();
	var i = 0;
	canvas.getActiveGroup().forEachObject(function(obj) {
        //for(var i in canvas.getActiveGroup().objects){
            var object = fabric.util.object.clone(obj);
			object.set("top", parseInt(object.top));
       		object.set("left", parseInt(object.left));
            copiedObjects[i] = object;
			//alert(object);
			i++;
        }  );                  
    }
    else if(canvas.getActiveObject()){ 
        var object = fabric.util.object.clone(canvas.getActiveObject());
        object.set("top", object.top+5);
        object.set("left", object.left+5);
        copiedObject = object;
        copiedObjects = new Array();
    }
}

function paste(){
    if(copiedObjects.length > 0){
        for(var i in copiedObjects){ 
			var newObj = fabric.util.object.clone(copiedObjects[i]);
			newObj.set("top", parseInt(newObj.top)+5);
        	newObj.set("left", parseInt(newObj.left)+5);
            canvas.add(newObj);
        }    
		copiedObjects = new Array();                
    }
    else if(copiedObject){
		 // Clear the selection
			canvas.deactivateAll();
			canvas.discardActiveGroup();
			
		var newObj = fabric.util.object.clone(copiedObject);
			newObj.set("top", newObj.top+5);
        	newObj.set("left", newObj.left+5);
            canvas.add(newObj);
			copy();
    }
    canvas.renderAll();    
}


canvas.on('mouse:down', function(event) {
	if(zeeToDraw != "")
	{
		var pointer = canvas.getPointer(event.e);	
		if(typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_down'] === "function")
		{
			zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_down'](pointer);
			jQuery('.wl2p-properties').collapse('hide');
		}
	}
});

canvas.on('mouse:move', function(event) {
	if(zeeToDraw != "")
	{
		var pointer = canvas.getPointer(event.e);	
		
		if(typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_move'] === "function")
			zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_move'](pointer);
	}
});

canvas.on('mouse:up', function(event) {
	//if(!event.target){
		//alert(zeeToDraw);
		//alert(event.target.get('type'));
			var pointer = canvas.getPointer(event.e);	
		//  var text = new fabric.IText('hello world', { left: pointer.x, top: pointer.y });
		//canvas.add(text);
		
		if(typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_up'] === "function")
			zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_mouse_up'](pointer);
		
		if(zeeToDraw != '') {
			zeeToDraw = "";
			canvas.forEachObject(function(object){ 
				object.selectable = true; 
			});
		}
		
	//}
	$('#welove2pc').css('cursor', 'default');
});

canvas.on('before:selection:cleared', function() {
    var clearedObject = canvas.getActiveObject();
    if(clearedObject !== null) {
        if(clearedObject.get('type') == 'i-text')
        {
        	if(clearedObject.text == '')
        		canvas.remove(clearedObject);
        }
        jQuery('.zPanels').hide();
    }
    else {
        clearedObject = canvas.getActiveGroup();
    }
    //do stuff with the deselected element if it is the specific one you want.
});

canvas.on('object:selected', function(event) {
	var obj = canvas.getActiveObject();
	if(obj != null)
	{
		$("#image_property_area").fadeOut();
		var objType = obj.get('type');
		console.log('selected', objType);
		objType = objType.replace('-','');
		if(objType == "image")
		{
			if(obj.lockUniScaling)
			{
				if(!$("#check_keep_rate").parent().children(":checked").length)
					$("#check_keep_rate").trigger("click");
			}
			else
			{
				if($("#check_keep_rate").parent().children(":checked").length)
					$("#check_keep_rate").trigger("click");
			}
			objType = 'image';
		}

		if(objType == 'image' || objType == 'circle' || objType == 'triangle' || objType == 'line' || objType == 'pathgroup') {
			if(obj.lockRotation)
			{
				$(".check_lock_object").prop("checked", true);
				// if(!$(".check_lock_object").parent().children(":checked").length)
				// 	$(".check_lock_object").trigger("click");
			}
			else
			{
				$(".check_lock_object").prop("checked", false);
				// if($(".check_lock_object").parent().children(":checked").length)
				// 	$(".check_lock_object").trigger("click");
			}
		}

		var functionName = objType;
		if(objType == 'circle' || objType == 'rect' || objType == 'triangle' || objType == 'line')
			functionName = 'circle';
		// if(typeof zeeEditor_objects['zeeEditor_'+objType+'_init'] === "function")
		// {
		// 	zeeEditor_objects['zeeEditor_'+objType+'_init']();
		// }
		else if(objType == 'qrcode')
			functionName = 'image';
		
		if(typeof zeeEditor_objects['zeeEditor_' + functionName + '_init'] === "function")
			zeeEditor_objects['zeeEditor_' + functionName + '_init'](objType);
		jQuery('.zPanels').hide();
		jQuery('.zPanels.p_'+functionName).show();

		jQuery('.wl2p-properties').collapse('show');
		$("#background_area").fadeOut();
	}
});

$(window).keydown(function(e)
{
	switch(e.which)
	{
	case 46:
		crud.delete();
       	break;
	case 67:
		if(e.ctrlKey || e.metaKey)
			crud.copy();
		break;
	case 86:
		if(e.ctrlKey || e.metaKey)
			crud.paste();
		break;
	case 88:
		if(e.ctrlKey || e.metaKey)
			crud.cut();
		break;
	case 90:
		if(e.ctrlKey || e.metaKey)
		{
			if(e.shiftKey)
				actionReplay("redo");
			else
				actionReplay("undo")
		}
		break;
	case 89:
		if(e.ctrlKey || e.metaKey)
			actionReplay("redo");
		break;
	}
});

// jQuery(document).on('click','.zDolMainNav .zDraw',function(e){
// 	zeeToDraw = jQuery(this).attr('object');
// 	jQuery('.zDolMainNav li.active').removeClass('active');
// 	jQuery(this).parent('li').addClass('active');
	
// 	if(typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init'] === "function")
// 		zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init']();
// });
// jQuery(document).on('click','.zDolMainNav .zDraw-m',function(e){
// 	zeeToDraw = jQuery(this).attr('object');
	
// 	if(typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init'] === "function")
// 		zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init']();
// });
jQuery(document).on('click','.zDrawObject',function(e) {
	zeeToDraw = jQuery(this).attr('object');
	if(zeeToDraw == 'itext')
		$('#welove2pc').css('cursor', 'text');
	else
		$('#welove2pc').css('cursor', 'default');
	if(zeeToDraw && typeof zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init'] === "function")
		zeeEditor_objects['zeeEditor_'+zeeToDraw+'_draw_init']();
	console.log(zeeToDraw);
	if(zeeToDraw == 'circle' || zeeToDraw == 'square' || zeeToDraw == 'triangle' || zeeToDraw == 'line') {
		canvas.forEachObject(function(object){ 
			object.selectable = false; 
		});
	}
	else {
		canvas.forEachObject(function(object){ 
			object.selectable = true; 
		});
	}
});

jQuery(document).on('click','.checkout',function(e) {
	alert(canvas.getActiveObject());
	alert(canvas.toSVG());
});

jQuery('#carousel-example-generic').carousel();