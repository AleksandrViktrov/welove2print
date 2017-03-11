var undoHist = [];
var redoHist = [];
var replayFlag = false; // set to true while undoing or redoing..
var selectedObject = []; // store selected object properties

setupCanvas();

// ----------
// not really deleting, but hiding, since that
// allows us to use the same itemNums for objects.
function deleteSelected() {
	var itemNums = []; // item numbers on the canvas

	for (var i in canvas.getObjects()) {
		if (canvas.item(i).active === true ) {
			canvas.item(i).set({ selectable: false, visible: false });
			itemNums.push(i);
		}
	}

	redoHist = [];
	undoHist.push({
		"action" : "remove",
		"itemNums": itemNums
	});
	canvas.deactivateAll();
	canvas.renderAll();
}


// ----------
// save selected properties of the currently selected 
// object to selectedObject array so we can access previous
// properties should the object be modified by the user.
// I finally learned about stateful and hasObjectChanged,
// so will maybe use that one day. 
function onObjectSelected() {
	selectedObject = [];

	for (var i in canvas.getObjects()) {
		if (canvas.item(i).active === true) {

			// shft-ctrl-j to see item properties on click (chrome)

			// objects can be flipped, but not groups 
			var groupLeft = 0;
			var groupTop = 0;
			var groupScaleX = 1;
			var groupScaleY = 1;
			var groupAngle = 0;

			// if it's a group, add group coords also
			if (typeof canvas.item(i).group != "undefined") {
				var groupLeft = canvas.item(i).group.left + canvas.item(i).group.width / 2;
				var groupTop = canvas.item(i).group.top + canvas.item(i).group.height / 2;
				var groupScaleX = canvas.item(i).group.scaleX;
				var groupScaleY = canvas.item(i).group.scaleY;
				var groupAngle = canvas.item(i).group.angle;
			}

			selectedObject.push({
				"itemNum": i,
				"left": canvas.item(i).left + groupLeft,
				"top": canvas.item(i).top + groupTop,
				"scaleX": canvas.item(i).scaleX * groupScaleX,
				"scaleY": canvas.item(i).scaleY * groupScaleY,
				"angle": canvas.item(i).angle + groupAngle,
				"flipX": canvas.item(i).flipX,
				"flipY": canvas.item(i).flipY,
				"fill": canvas.item(i).fill,
				"stroke": canvas.item(i).stroke,
			});
		}

	}

}
// ----------
// add new object itemNums to the undo stack
// clear redo stack when new item added.
function onObjectAdded(event) {
	redrawBorder();
	var obj_index;
	for (var i in canvas.getObjects()) {
		if (canvas.item(i) == event.target ) {
			obj_index = i;
		}
	}

	var o = canvas.getObjects();
	if (replayFlag === false) {
		undoHist.push({
			"action": "add",
			// "itemNums": [o.length - 1]
			"itemNums": [obj_index]
		});
		redoHist = [];
	}
}
// ----------
// when object is modified, save previous top, left,  
// scaleX/Y and angle settings to undohist.
function onObjectModified() {
  
  // deselecting groups after modify prevents
  // some problems related to relative positioning.
  // i'll get to the bottom of this one day, but this works 
  // around it for now.
  if(canvas.getActiveGroup()){
	canvas.deactivateAll();
  }
  
  if (replayFlag === false) { // i.e. user modified something..
	var itemProps = [];
	for (var i in selectedObject) {
	  itemProps.push({
		"itemNum": selectedObject[i].itemNum,
		"left": selectedObject[i].left,
		"top": selectedObject[i].top,
		"scaleX": selectedObject[i].scaleX,
		"scaleY": selectedObject[i].scaleY,
		"angle": selectedObject[i].angle,
		"flipX": selectedObject[i].flipX,
		"flipY": selectedObject[i].flipY,
		"fill": selectedObject[i].fill,
		"stroke": selectedObject[i].stroke,
	  });
	}

	// get current object properties 
	onObjectSelected();

	undoHist.push({
	  "action": "modify",
	  "itemProps": itemProps
	});
	redoHist = [];
  }
}

function actionReplay(replayType) {
	// global flag to prevent onObjectSelected method defaults
	// from applying to programmatic actions.
	replayFlag = true; 
	if (replayType === "undo") {
		if (undoHist.length > 0) {
			var backStack = undoHist;
			var forwardStack = redoHist;
			replay(backStack, forwardStack);
		} else {
			console.log('No undo history.');
		}
// ----------
	} else if (replayType === "redo") {
		if (redoHist.length > 0) {
			var backStack = redoHist;
			var forwardStack = undoHist;
			replay(backStack, forwardStack);
		} else {
			console.log("No redo history.");   
		}
	}
	replayFlag = false;
	canvas.renderAll();
}
	
// ----------
function replay(backStack, forwardStack) {
	var o = backStack[backStack.length - 1];
	var actionType = backStack[backStack.length - 1].action;
	var itemProps = [];
	var itemNums = [];
	var boolShow = true;

	if (actionType === "remove") {
		actionType = "add"; // invert actionType for add/remove
		boolShow = true;
	} else if (actionType === "add") {
		actionType = "remove";
		boolShow = false;
	} else {
		boolShow = true;
	}

	if (actionType === "add" || actionType === "remove") {
		for (var i in o.itemNums) {
			canvas.item(o.itemNums[i]).set({
				selectable: boolShow,
				visible: boolShow
			});
			itemNums.push(o.itemNums[i]);
			canvas.item(o.itemNums[i]).setCoords();
		}
	} else { // actionType === "modify"

		for (var i in o.itemProps) {
			// current itemProps, not those from the history
			itemProps.push({
				"itemNum": o.itemProps[i].itemNum,
				"left": canvas.item(o.itemProps[i].itemNum).left,
				"top": canvas.item(o.itemProps[i].itemNum).top,
				"scaleX": canvas.item(o.itemProps[i].itemNum).scaleX,
				"scaleY": canvas.item(o.itemProps[i].itemNum).scaleY,
				"angle": canvas.item(o.itemProps[i].itemNum).angle,
				"flipX": canvas.item(o.itemProps[i].itemNum).flipX,
				"flipY": canvas.item(o.itemProps[i].itemNum).flipY,
				"fill": canvas.item(o.itemProps[i].itemNum).fill,
				"stroke": canvas.item(o.itemProps[i].itemNum).stroke,
			});

			canvas.item(o.itemProps[i].itemNum).set({
				left: o.itemProps[i].left,
				top: o.itemProps[i].top,
				scaleX: o.itemProps[i].scaleX,
				scaleY: o.itemProps[i].scaleY,
				angle: o.itemProps[i].angle,
				flipX: o.itemProps[i].flipX,
				flipY: o.itemProps[i].flipY,
				fill: o.itemProps[i].fill,
			});

			itemNums.push(o.itemProps[i].itemNum);

			canvas.item(o.itemProps[i].itemNum).setCoords();
		}
	}

	forwardStack.push({
		"action": actionType,
		"itemNums": itemNums,
		"itemProps": itemProps
	});

	backStack.splice(backStack.length - 1, 1);

	selectedObject = [];
	onObjectSelected();
}

// ----------
function setupCanvas () {
	canvas.on('object:selected', onObjectSelected);
	canvas.on('object:added', onObjectAdded);
	canvas.on('object:modified', onObjectModified);
}

//////////////////////////////////////////
jQuery('.w2p-undo').click(function () {
	actionReplay("undo");
	return false;
});

jQuery('.w2p-redo').click(function () {
	actionReplay("redo");
	return false;
});