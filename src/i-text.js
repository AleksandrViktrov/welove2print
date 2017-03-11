zeeEditor_objects.zeeEditor_itext_draw_init = function(){
	// canvas.defaultCursor = 'text';
};
zeeEditor_objects.zeeEditor_itext_draw_mouse_down = function(pointer){
	canvas.selection = false;
	// var text = new fabric.IText('ggg', { left: pointer.x, top: pointer.y-15 });
	// canvas.add(text);
};

zeeEditor_objects.zeeEditor_itext_draw_mouse_up = function(pointer){
	canvas.selection = true;
	var text = new fabric.IText('', { left: pointer.x, top: pointer.y });
	canvas.add(text);
	// canvas.defaultCursor = 'default';
	//canvas.setActiveObject(text);
	canvas.setActiveObject(text);
	text.enterEditing();
	// canvas.selection = true;
	text.hiddenTextarea.focus();
};
zeeEditor_objects.zeeEditor_itext_init = function(){
	/*jQuery('.wl2p-properties .zPanels.itext').show();
	jQuery('.wl2p-properties').collapse('show');*/
	var obj = canvas.getActiveObject();
	
	jQuery("#fontSize").roundSlider({
	    radius: 50,
	    circleShape: "pie",
	    sliderType: "min-range",
	    showTooltip: true,
	    value: obj.get('fontSize'),
	    startAngle: 315,
		change: function(e){
			var size = this.getValue();
			//var obj = canvas.getActiveObject();
			obj.set({ fontSize : size });
			//(e.getValue());
			canvas.renderAll();
		},
	});
	
	jQuery("#fontStroke").roundSlider({
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

jQuery("#fontOpacity").roundSlider({
    radius: 50,
    circleShape: "pie",
    sliderType: "min-range",
    showTooltip: true,
    value: obj.get('opacity')*100,
    startAngle: 315,
	change: function(e){
		var size = this.getValue();
		//var obj = canvas.getActiveObject();
		size = size/100;
		obj.set({ opacity : size });
		//(e.getValue());
		canvas.renderAll();
	},
});

	if(obj.get('fontWeight') == 'bold'){
		jQuery('.zTextBoldBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextBoldBtn').removeClass('btn-primary');
	}
	
	if(obj.get('fontStyle') == 'italic'){
		jQuery('.zTextItalicBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextItalicBtn').removeClass('btn-primary');
	}
	
	if(obj.get('textDecoration') == 'underline'){
		jQuery('.zTextUnderlineBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextUnderlineBtn').removeClass('btn-primary');
	}
	
	if(obj.get('textDecoration') == 'line-through'){
		jQuery('.zTextStrikethroughBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextStrikethroughBtn').removeClass('btn-primary');
	}
	
	if(obj.get('textAlign') == 'left'){
		jQuery('.zTextAlignLeftBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextAlignLeftBtn').removeClass('btn-primary');
	}
	
	if(obj.get('textAlign') == 'right'){
		jQuery('.zTextAlignRightBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextAlignRightBtn').removeClass('btn-primary');
	}
	
	if(obj.get('textAlign') == 'center'){
		jQuery('.zTextAlignCenterBtn').addClass('btn-primary');
	}else{
		jQuery('.zTextAlignCenterBtn').removeClass('btn-primary');
	}
	 
	jQuery('.zTextColor').val(obj.get('fill'));
	jQuery('.zTextStrokeColor').val(obj.get('stroke'));

};

jQuery(document).ready(function(e) {
    jQuery(document).on('click','.zTextBoldBtn',function(e) {
       var obj = canvas.getActiveObject(); //fontWeight
	   if(jQuery(this).hasClass('btn-primary')){
			obj.set({ fontWeight : 'normal' }); 
			//jQuery(this).removeClass('btn-primary');
	   }else{
	   		obj.set({ fontWeight : 'bold' });
			//jQuery(this).addClass('btn-primary');
	   }
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextItalicBtn',function(e) {
       var obj = canvas.getActiveObject();
	   if(jQuery(this).hasClass('btn-primary')){
			obj.set({ fontStyle : 'normal' }); 
	   }else{
	   		obj.set({ fontStyle : 'italic' });
	   }
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextUnderlineBtn',function(e) {
       var obj = canvas.getActiveObject();
	   if(jQuery(this).hasClass('btn-primary')){
			obj.set({ textDecoration : '' }); 
	   }else{
	   		obj.set({ textDecoration : 'underline' });
	   }
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextStrikethroughBtn',function(e) {
       var obj = canvas.getActiveObject();
	   if(jQuery(this).hasClass('btn-primary')){
			obj.set({ textDecoration : '' }); 
	   }else{
	   		obj.set({ textDecoration : 'line-through' });
	   }
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextAlignLeftBtn',function(e) {
       var obj = canvas.getActiveObject();
	 
	   		obj.set({ textAlign  : 'left' });
	   
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextAlignCenterBtn',function(e) {
       var obj = canvas.getActiveObject();
	   		obj.set({ textAlign  : 'center' });
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('click','.zTextAlignRightBtn',function(e) {
       var obj = canvas.getActiveObject();
	   		obj.set({ textAlign  : 'right' });
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
	
	jQuery(document).on('change','#text_color',function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
	   		obj.set({ fill  : '#' + val });
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    }); 
	
	jQuery(document).on('change','#text_stroke_color',function(e) {
		var val = jQuery(this).val();
        var obj = canvas.getActiveObject();
	   		obj.set({ stroke : '#' + val });
	   canvas.renderAll();
	   zeeEditor_objects.zeeEditor_itext_init(); 
    });
});