
/*
 * Camera Buttons
 */

var CameraButtons = function(blueprint3d) {

  var orbitControls = blueprint3d.three.controls;
  var three = blueprint3d.three;

  var panSpeed = 30;
  var directions = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  function init() {
    // Camera controls
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);  
    $("#zoom-in").dblclick(preventDefault);
    $("#zoom-out").dblclick(preventDefault);

    $("#reset-view").click(three.centerCamera)

    $("#move-left").click(function(){
      pan(directions.LEFT)
    })
    $("#move-right").click(function(){
      pan(directions.RIGHT)
    })
    $("#move-up").click(function(){
      pan(directions.UP)
    })
    $("#move-down").click(function(){
      pan(directions.DOWN)
    })
	
	$("#threed").click(function(){
       window.open("/2D_design/");
    })

    $("#move-left").dblclick(preventDefault);
    $("#move-right").dblclick(preventDefault);
    $("#move-up").dblclick(preventDefault);
    $("#move-down").dblclick(preventDefault);
	
	 $("#undo-view").click(undoview);
	
	loadproductDataXml();
	loadDefinitionDataXml();
  }
  function undoview(e) {
    blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":50.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":50.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/side_wall_left1.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/side_wall_left1.png","stretch":true,"scale":100}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wall_n1.png","stretch":true,"scale":100}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/centerwall_1.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/sidewall_right_1.png","stretch":true,"scale":100}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/sidewall_right_1.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/centerwall_1.png","stretch":true,"scale":100}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  
  }
function loadproductDataXml(){
	  if (window.XMLHttpRequest)
	  {
		xmlhttp=new XMLHttpRequest();
	  }
	  else
	  {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","xmls/product_data.xml",false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
  }
  function loadDefinitionDataXml(){
	  if (window.XMLHttpRequest)
	  {
		xmlhttp=new XMLHttpRequest();
	  }
	  else
	  {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","xmls/definition_data.xml",false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	
  }

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function pan(direction) {
    switch (direction) {
      case directions.UP:
        orbitControls.panXY(0, panSpeed);
        break;
      case directions.DOWN:
        orbitControls.panXY(0, -panSpeed);
        break;
      case directions.LEFT:
        orbitControls.panXY(panSpeed, 0);
        break;
      case directions.RIGHT:
        orbitControls.panXY(-panSpeed, 0);
        break;
    }
  }

  function zoomIn(e) {
    e.preventDefault();
    orbitControls.dollyIn(1.1);
    orbitControls.update();
  }

  function zoomOut(e) {
    e.preventDefault;
    orbitControls.dollyOut(1.1);
    orbitControls.update();
  }

  init();
}

/*
 * Context menu for selected item
 */ 

var ContextMenu = function(blueprint3d) {

  var scope = this;
  var selectedItem;
  var three = blueprint3d.three;

  function init() {
    $("#trash").click(function(event) {
        selectedItem.remove();
		$("#object-controls").css("visibility", 'hidden');
    });
	
	$("#clone-texture").click(function(event) {       
		//var mesh = new THREE.Mesh( selectedItem.geometry, selectedItem.material );
		//mesh.position.set( 0 * 100, 0, 0 );
		//scene.add( mesh );		
    });
	$("#change-texture").click(function(event) { 
		$("#popoverContent2").toggle();
		$('#tabContent').hide();
		$('#textureContent').show();
		//$("#popoverContent3").style.visibility='show'
		//$("#tabContent").style.visibility='hidden'
		
	});

    three.itemSelectedCallbacks.add(itemSelected);
    three.itemUnselectedCallbacks.add(itemUnselected);

    initResize();

    $("#fixed").click(function() {
        var checked = $(this).prop('checked');
        selectedItem.setFixed(checked);
    });
  }

  function cmToIn(cm) {
    return cm / 2.54;
  }

  function inToCm(inches) {
    return inches * 2.54;
  }
  var cubeMesh = [];
  function itemSelected(item) {
	   if(selectedItem != undefined){
            
		for (var i = 0 ; i < selectedItem.children.length; i++) {
			var child = selectedItem.children[i];
			if(child != selectedItem){
				child.visible = false;
			}
		}
	}
	
	
	selectedItem = null;
    selectedItem = item;

    $("#context-menu-name").text(item.metadata.itemName);

    $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
    $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
    $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));

    $("#context-menu").show();
	$(".tabbable").hide();

    $("#fixed").prop('checked', item.fixed);
	//$("#object-controls").css("visibility", 'visible');
	//$("#object-controls").css("y", selectedItem.position.y);
	//--- child menus added
	
	    //...create materials for the child cubes....	
	material0 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/style.png' ) } );
	material1 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/duplicate.png' ) } );
	material2 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/delete.png' ) } );
    material3 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/plus.png' ) } );
	material4 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/door.png' ) } );
	material5 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/shelves_interior.png' ) } );
	material6 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/legs.png' ) } );
	material7 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/knobs.png' ) } );
	//material8 = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( 'images/accessories.png' ) } );

    //create child cube mesh
	
    cubeMesh[0] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material0);
    cubeMesh[1] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material1);
    cubeMesh[2] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material2);
    cubeMesh[3] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material3);
	cubeMesh[4] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material4);
	cubeMesh[5] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material5);
	cubeMesh[6] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material6);
	cubeMesh[7] = new THREE.Mesh(new THREE.CircleGeometry(9, 25), material7);
	//cubeMesh[8] = new THREE.Mesh(new THREE.CircleGeometry(10, 25), material8);

        //--> Set child cube world positions before the attachment to parentCube mesh
	if(selectedItem.metadata.itemName == "60x20x38 cm"){		
		cubeMesh[0].position.set(-20,75,0);
		cubeMesh[1].position.set(10,75,0);
		cubeMesh[2].position.set(40,75,0);
		cubeMesh[3].position.set(65,75,0);
		cubeMesh[4].position.set(65,55,0);
		cubeMesh[5].position.set(65,35,0);
		cubeMesh[6].position.set(65,15,0);
		cubeMesh[7].position.set(65,-5,0);
	//cubeMesh[8].position.set(55,0,0);
	}
	else
	{
		cubeMesh[0].position.set(-30,100,0);
		cubeMesh[1].position.set(0,100,0);
		cubeMesh[2].position.set(30,100,0);
		cubeMesh[3].position.set(60,100,0);
		cubeMesh[4].position.set(60,75,0);
		cubeMesh[5].position.set(60,50,0);
		cubeMesh[6].position.set(60,25,0);
		cubeMesh[7].position.set(60,0,0);
	}
	cubeMesh[0].id = "changetexture";
	cubeMesh[1].id = "clone";
	cubeMesh[2].id = "trash";
	//cubeMesh[3].id = "changetexture";
        //Add child cubes to the scene
    for (var i = 0; i < cubeMesh.length; i++)
	{
        selectedItem.add(cubeMesh[i]);		
	}

  }

  function resize() {
    selectedItem.resize(
      inToCm($("#item-height").val()),
      inToCm($("#item-width").val()),
      inToCm($("#item-depth").val())
    );
  }
  

  function initResize() {
    $("#item-height").change(resize);
    $("#item-width").change(resize);
    $("#item-depth").change(resize);
  }

  function itemUnselected() {
    if(selectedItem != undefined){
            
		for (var i = 0 ; i < selectedItem.children.length; i++) {
			var child = selectedItem.children[i];
			if(child != selectedItem){
				child.visible = false;
			}
		}
	
	// selectedItem.children ={};
	//detachChild();
	}
	//$("#object-controls").css("visibility", 'hidden');
	
	selectedItem = null;
	
   // $("#context-menu").hide();
  }
  
 

  init();
}

/*
 * Loading modal for items
 */

var ModalEffects = function(blueprint3d) {

  var scope = this;
  var blueprint3d = blueprint3d;
  var itemsLoading = 0;

  this.setActiveItem = function(active) {
    itemSelected = active;
    update();
  }

  function update() {
    if (itemsLoading > 0) {
      $("#loading-modal").show();
    } else {
      $("#loading-modal").hide();
    }
  }

  function init() {
    blueprint3d.model.scene.itemLoadingCallbacks.add(function() {
      itemsLoading += 1;
      update();
    });

     blueprint3d.model.scene.itemLoadedCallbacks.add(function() {
      itemsLoading -= 1;
      update();
    });   

    update();
  }

  init();
}

/*
 * Side menu
 */

var SideMenu = function(blueprint3d, floorplanControls, modalEffects) {
  var blueprint3d = blueprint3d;
  var floorplanControls = floorplanControls;
  var modalEffects = modalEffects;

  var ACTIVE_CLASS = "active";

  var tabs = {
    "FLOORPLAN" : $("#floorplan_tab"),
    "SHOP" : $("#design_tab"),
    "DESIGN" : $("#design_tab")
  }

  var scope = this;
  this.stateChangeCallbacks = $.Callbacks();

  this.states = {
    "DEFAULT" : {
      "div" : $("#viewer"),
      "tab" : tabs.DESIGN
    },
    "FLOORPLAN" : {
      "div" : $("#floorplanner"),
      "tab" : tabs.FLOORPLAN
    },
    "SHOP" : {
      "div" : $("#add-items"),
      "tab" : tabs.SHOP
    }
  }

  // sidebar state
  var currentState = scope.states.FLOORPLAN;

  function init() {
    for (var tab in tabs) {
      var elem = tabs[tab];
      elem.click(tabClicked(elem));
    }

    $("#update-floorplan").click(floorplanUpdate);

    initLeftMenu();

    blueprint3d.three.updateWindowSize();
    handleWindowResize();

    initItems();

    setCurrentState(scope.states.DEFAULT);
  }

  function floorplanUpdate() {
    setCurrentState(scope.states.DEFAULT);
  }

  function tabClicked(tab) {
    return function() {
      // Stop three from spinning
      blueprint3d.three.stopSpin();

      // Selected a new tab
      for (var key in scope.states) {
        var state = scope.states[key];
        if (state.tab == tab) {
          setCurrentState(state);
          break;
        }
      }
    }
  }
  
  function setCurrentState(newState) {

    if (currentState == newState) {
      return;
    }

    // show the right tab as active
    if (currentState.tab !== newState.tab) {
      if (currentState.tab != null) {
        currentState.tab.removeClass(ACTIVE_CLASS);          
      }
      if (newState.tab != null) {
        newState.tab.addClass(ACTIVE_CLASS);
      }
    }

    // set item unselected
    blueprint3d.three.getController().setSelectedObject(null);

    // show and hide the right divs
    currentState.div.hide()
    newState.div.show()
	
	

    // custom actions
	
	if(newState == scope.states.DEFAULT){
		currentState = scope.states.SHOP;
		currentState.div.show()
		blueprint3d.three.updateWindowSize();
	}
    if (newState == scope.states.FLOORPLAN) {
		currentState = scope.states.SHOP;
		currentState.div.hide();
		blueprint3d.three.updateWindowSize();
      floorplanControls.updateFloorplanView();
      floorplanControls.handleWindowResize();
	    
    } 

    if (currentState == scope.states.FLOORPLAN) {
      blueprint3d.model.floorplan.update();
    }

    if (newState == scope.states.DEFAULT) {
      blueprint3d.three.updateWindowSize();
    }
 
    // set new state
    handleWindowResize();    
    currentState = newState;

    scope.stateChangeCallbacks.fire(newState);
  }

  function initLeftMenu() {
    $( window ).resize( handleWindowResize );
    handleWindowResize();
  }

  function handleWindowResize() {
    $(".sidebar").height(window.innerHeight);
    $("#add-items").height(window.innerHeight);

  };

  // TODO: this doesn't really belong here
  function initItems() {	  
     $("#swiper .add-item").on("click", function(e) {
      var modelUrl = $(this).attr("model-url");
      var itemType = parseInt($(this).attr("model-type"));
      var metadata = {
        itemName: $(this).attr("model-name"),
        resizable: true,
        modelUrl: modelUrl,
        itemType: itemType
      }
	  
	  
	  
	  

      blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
      setCurrentState(scope.states.DEFAULT);
    });
  }

  init();

}

/*
 * Change floor and wall textures
 */

var TextureSelector = function (blueprint3d, sideMenu) {

  var scope = this;
  var three = blueprint3d.three;
  var isAdmin = isAdmin;
  var blueprint3d = blueprint3d;
  var currentTarget = null;
  

  function initTextureSelectors() {
    $(".texture-select-thumbnail").click(function(e) {
      var textureUrl = $(this).attr("texture-url");
      var textureStretch = ($(this).attr("texture-stretch") == "true");
      var textureScale = parseInt($(this).attr("texture-scale"));
	  var itemType = "1";
	  //var modelUrl = "models/js/white.js";//currentTarget.model();
	  
	  var modelUrl =  $(this).attr("model-name");
	  var itemsArray = blueprint3d.model.scene.items;
	  var position;
	  var chk;
	 //if(ContextMenu.selectedItem ==halfEdge || ContextMenu.selectedItem ==room ){
	  //currentTarget.setTexture(textureUrl, textureStretch, textureScale);
    //}else{
	  for (var i=0; i < itemsArray.length; i++) {
			if (itemsArray[i].selected) {
				currentTarget = itemsArray[i];
				position = itemsArray[i].position;
				//console.log("position", position);
				chk = true;
			}
		}
	  if(chk == true){
				var metadata = {
				itemName: "60x20x38 cm",
				resizable: true,
				modelUrl: modelUrl,
				itemType: "itemType"
	         }
		currentTarget.remove();
	    blueprint3d.model.scene.addItem(itemType, modelUrl, metadata,position);
	    //currentTarget.selected = true;
	 }else{
			currentTarget.setTexture(textureUrl, textureStretch, textureScale);
		}				
      e.preventDefault();
    });
  }

  function init() {
    three.wallClicked.add(wallClicked);
    three.floorClicked.add(floorClicked);
    three.itemSelectedCallbacks.add(reset);
    three.nothingClicked.add(reset);
    sideMenu.stateChangeCallbacks.add(reset);
    initTextureSelectors();
  }

  function wallClicked(halfEdge) {
    currentTarget = halfEdge;
	//alert(currentTarget);
    $("#floorTexturesDiv").hide();  
    $("#wallTextures").show();  
  }

  function floorClicked(room) {
    currentTarget = room;
    $("#wallTextures").hide();  
    $("#floorTexturesDiv").show();  
  }

  function reset(item) {
	  currentTarget = item;
    $("#wallTextures").hide();  
    $("#floorTexturesDiv").hide();  
  }

  init();
}

/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function(blueprint3d) {

  var canvasWrapper = '#floorplanner';

  // buttons
  var move = '#move';
  var remove = '#delete';
  var draw = '#draw';

  var activeStlye = 'btn-primary disabled';

  this.floorplanner = blueprint3d.floorplanner;

  var scope = this;

  function init() {

    $( window ).resize( scope.handleWindowResize );
    scope.handleWindowResize();

    // mode buttons
    scope.floorplanner.modeResetCallbacks.add(function(mode) {
      $(draw).removeClass(activeStlye);
      $(remove).removeClass(activeStlye);
      $(move).removeClass(activeStlye);
      if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
          $(move).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
          $(draw).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
          $(remove).addClass(activeStlye);
      }

      if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
        $("#draw-walls-hint").show();
        scope.handleWindowResize();
      } else {
        $("#draw-walls-hint").hide();
      }
    });

    $(move).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
    });

    $(draw).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
    });

    $(remove).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
    });
  }

  this.updateFloorplanView = function() {
    scope.floorplanner.reset();
  }

  this.handleWindowResize = function() {
    $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
    scope.floorplanner.resizeView();
  };

  init();
}; 

var mainControls = function(blueprint3d) {
  var blueprint3d = blueprint3d;
  var defaultRoom = true;

  function newDesign() {
	
    blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":50.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":50.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wall_n1.png","stretch":true,"scale":100}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  }
  
 function changeRoom() {
	
    if(defaultRoom){
		defaultRoom = false;
		blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":50.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":50.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/side_wall_left.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/side_wall_left.png","stretch":true,"scale":100}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/center_wall.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wall_n1.png","stretch":true,"scale":100}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/center_wall.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/side_wall_right.png","stretch":true,"scale":100}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/side_wall_right.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/center_wall.png","stretch":true,"scale":100}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
	}else{
		defaultRoom = true;
		blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":50.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":50.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wall_n1.png","stretch":true,"scale":100}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
	}
	
  }

  function loadDesign() {
    files = $("#loadFile").get(0).files;
    var reader  = new FileReader();
    reader.onload = function(event) {
        var data = event.target.result;
        blueprint3d.model.loadSerialized(data);
    }
    reader.readAsText(files[0]);
  }

  function saveDesign() {
    var data = blueprint3d.model.exportSerialized();
    var a = window.document.createElement('a');
    var blob = new Blob([data], {type : 'text'});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'design.Besta';
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  }

  function init() {
    $("#new").click(newDesign);
    $("#loadFile").change(loadDesign);
    $("#saveFile").click(saveDesign);
	
	$("#btnWallover").click(changeRoom);
  }

  init();
}

/*
 * Initialize!
 */

$(document).ready(function() {

  // main setup
  var opts = {
    floorplannerElement: 'floorplanner-canvas',
    threeElement: '#viewer',
    threeCanvasElement: 'three-canvas',
    textureDir: "models/textures/",
    widget: false
  }
  // var blueprint3d = new BP3D.Blueprint3d(opts);

  // var modalEffects = new ModalEffects(blueprint3d);
  // var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  // var contextMenu = new ContextMenu(blueprint3d);
  // var sideMenu = new SideMenu(blueprint3d, viewerFloorplanner, modalEffects);
  // var textureSelector = new TextureSelector(blueprint3d, sideMenu);        
  // var cameraButtons = new CameraButtons(blueprint3d);
  // mainControls(blueprint3d);

  // This serialization format needs work
  // Load a simple rectangle room
  //blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":50.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":50.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideleft.png","stretch":true,"scale":100}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wall_n1.png","stretch":true,"scale":100}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/gradient_sideright.png","stretch":true,"scale":100},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":100}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
 //{"floorplan":{"corners":{"56d9ebd1-91b2-875c-799d-54b3785fca1f":{"x":746.3790000000009,"y":-229.61600000000007},"8f4a050d-e102-3c3f-5af9-3d9133555d76":{"x":294.64,"y":-229.61600000000007},"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359":{"x":294.64,"y":232.664},"254656bf-8a53-3987-c810-66b349f49b19":{"x":932.688,"y":232.664},"e7db8654-efe1-bda2-099a-70585874d8c0":{"x":932.688,"y":-101.59999999999998}},"walls":[{"corner1":"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359","corner2":"254656bf-8a53-3987-c810-66b349f49b19","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"https://blueprint-dev.s3.amazonaws.com/uploads/floor_wall_texture/file/wallmap_yellow.png","stretch":true,"scale":null}},{"corner1":"254656bf-8a53-3987-c810-66b349f49b19","corner2":"e7db8654-efe1-bda2-099a-70585874d8c0","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"https://blueprint-dev.s3.amazonaws.com/uploads/floor_wall_texture/file/wallmap_yellow.png","stretch":true,"scale":null}},{"corner1":"56d9ebd1-91b2-875c-799d-54b3785fca1f","corner2":"8f4a050d-e102-3c3f-5af9-3d9133555d76","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"https://blueprint-dev.s3.amazonaws.com/uploads/floor_wall_texture/file/wallmap_yellow.png","stretch":true,"scale":null}},{"corner1":"8f4a050d-e102-3c3f-5af9-3d9133555d76","corner2":"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"https://blueprint-dev.s3.amazonaws.com/uploads/floor_wall_texture/file/wallmap_yellow.png","stretch":true,"scale":null}},{"corner1":"e7db8654-efe1-bda2-099a-70585874d8c0","corner2":"56d9ebd1-91b2-875c-799d-54b3785fca1f","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"https://blueprint-dev.s3.amazonaws.com/uploads/floor_wall_texture/file/wallmap_yellow.png","stretch":true,"scale":null}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[{"item_name":"Bookshelf","item_type":1,"model_url":"models/js/cb-kendallbookcasewalnut_baked.js","xpos":832.9497651962151,"ypos":92.17650034119151,"zpos":-137.19261915799046,"rotation":-0.6409005139437446,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Red Chair","item_type":1,"model_url":"models/js/ik-ekero-orange_baked.js","xpos":766.0196670123851,"ypos":37.50235073007,"zpos":166.95639974755164,"rotation":-2.7850655622178633,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Window","item_type":3,"model_url":"models/js/whitewindow.js","xpos":295.1400146484375,"ypos":139.36984164591271,"zpos":114.79432902135734,"rotation":1.5707963267948966,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Window","item_type":3,"model_url":"models/js/whitewindow.js","xpos":411.9758453411466,"ypos":136.74677863946,"zpos":-229.11599731445312,"rotation":0,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Window","item_type":3,"model_url":"models/js/whitewindow.js","xpos":295.1400146484375,"ypos":135.49832005026923,"zpos":-54.94038053006494,"rotation":1.5707963267948966,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Media Console - White","item_type":1,"model_url":"models/js/cb-clapboard_baked.js","xpos":623.3570947550139,"ypos":67.88999754395999,"zpos":-198.10894165511178,"rotation":0,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false},{"item_name":"Sofa - Grey","item_type":1,"model_url":"models/js/cb-rochelle-gray_baked.js","xpos":374.24580710183494,"ypos":42.54509923821,"zpos":50.36160462048548,"rotation":1.5707963267948966,"scale_x":1,"scale_y":1,"scale_z":1,"fixed":false}]}');
 });
