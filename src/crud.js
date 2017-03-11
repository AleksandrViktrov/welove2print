
var clipboard = null;

var crud = { 
	copiedObject:null,
	copiedObjects: new Array(),

	canvas:window._canvas, init:function(){
	},
	delete:function()
	{
		// if(canvas.getActiveGroup())
		// {
		// 	canvas.getActiveGroup().forEachObject(function(o)
		// 	{
		// 		canvas.remove(o);
		// 	});
		// 	canvas.discardActiveGroup().renderAll();
		// }
		// else
		// {
		// 	canvas.remove(canvas.getActiveObject());
		// }
		console.log("ssss");
		deleteSelected();
	},
	cut:function(){
		this.copy();
		this.delete();
	},
	copy:function()
	{
	    // Single Object
	    if(canvas.getActiveObject())
	    {
	   		var active_obj = canvas.getActiveObject();
	        // Does this object require an async clone?
	        if(active_obj.type != 'qrcode' && !fabric.util.getKlass(active_obj.type).async)
	        {
	            clipboard = active_obj.clone();
	        }
	        else
	        {
	            active_obj.clone(function(clone)
	            {
	            	clipboard = clone;
	            	clipboard.set("blur", active_obj.blur);
	            	// clipboard.set('filter', active_obj.filter);
	            });
	        }
	    }

	    // Group of Objects (all groups require async clone)
	    if(canvas.getActiveGroup())
	    {
	    	var group = canvas.getActiveGroup();
	        group.clone(function(clone)
	        {
	            clipboard = clone;
	            var i = 0;
		        clipboard.forEachObject(function(obj)
		        {
		        	console.log(clone);
		        	if(group._objects[i].blur)
	          			obj.set("blur", group._objects[i].blur);
	          		i++;
		        });
	        });
	    }
	},
	paste:function()
	{
	    // Do we have an object in our clipboard?
	    if(clipboard)
	    {
	        // Lets see if we need to clone async 
	        if(clipboard.type != 'qrcode' && !fabric.util.getKlass(clipboard.type).async)
	        {
	            var obj = clipboard.clone();
	            obj.setTop(obj.top += 5);
	            obj.setLeft(obj.left += 5);          
	            canvas.add(obj);
	            // We do not need to clone async, all groups require async clone
	            canvas.setActiveObject(obj);
	            clipboard = obj;
	        }
	        else
	        {
	            clipboard.clone(function(clone)
	            {
	                clone.setTop(clone.top += 5);
	                clone.setLeft(clone.left += 5);
	                if(clipboard.isType("group")) {
	                	var i = 0;
		                clone.forEachObject(function(obj)
		                {
							canvas.add(obj);
		            		setObjectBlur(obj, clipboard._objects[i].blur);
			            	if(obj.get('type') == 'image')
								obj.applyFilters(canvas.renderAll.bind(canvas));
		                	obj.setCoords();
		                	i++;
						});
		            }
		            else
		            {
		            	setObjectBlur(clone, clipboard.blur);
		            	// setObjectFilter(clone, clipboard.filter);
		            	if(clone.get('type') == 'image')
							clone.applyFilters(canvas.renderAll.bind(canvas));
		            	canvas.add(clone);
		            }
	                
	   				canvas.deactivateAll();

	                // We need to clone async, but this doesnt mean its a group
	                if(clipboard.isType("group")) {
	                    canvas.setActiveGroup(clone);
	                } else {
	                    canvas.setActiveObject(clone);
	                }
	                clipboard = clone;
	                clone.setCoords();
	   				canvas.calcOffset();
	  				canvas.renderAll();
	            });
	        }
	    }
	},
	group:function()
	{
		var selectedGroup = canvas.getActiveGroup();
		if(selectedGroup)
		{
			//if(selectedGroup.length > 1)
			{
				// canvas.deactivateAll();
				var newGroup = fabric.util.object.clone(selectedGroup);
				canvas.add(newGroup);
				selectedGroup.forEachObject(function(o)
				{
					canvas.remove(o);
				});
				canvas.remove(selectedGroup);
				canvas.setActiveObject(newGroup);
				canvas.deactivateAll().renderAll();
				canvas.renderAll();
			}
		}
	},
	ungroup:function()
	{
	   var activeObject = canvas.getActiveObject();
	    if(activeObject.type=="group"){
	        var items = activeObject;
	        // if(items.length > 1)
	        {
		        //alert(items);
		        activeObject._restoreObjectsState();
		        canvas.remove(activeObject);
		        for(var i = 0; i < items.length; i++) {
		        	canvas.add(items[i]);
		        	canvas.item(canvas.size()-1).hasControls = true;
		        }
				canvas.renderAll();
			}
		// var selectedGroup = canvas.getActiveGroup();
		// if(selectedGroup)
		// {
	 //       	var items = selectedGroup;
		// 	if(items.length > 1)
		// 	{
	 //        	selectedGroup._restoreObjectsState();
  //      			canvas.discardActiveGroup();
		// 		canvas.discardActiveGroup().renderAll();
	 //        	canvas.remove(selectedGroup);
		//         for(var i = 0; i < items.length; i++) {
		//           canvas.add(items[i]);
		//           canvas.item(canvas.size()-1).hasControls = true;
		//         }
		// 		canvas.renderAll();
		// 	}
		}
	}
};

crud.init();


jQuery(document).on('click','.w2p-cut',function(e){
	crud.cut();
	return false;
});
jQuery(document).on('click','.w2p-copy',function(e){
	crud.copy();
	return false;
});
jQuery(document).on('click','.w2p-paste',function(e){
	crud.paste();
	return false;
});