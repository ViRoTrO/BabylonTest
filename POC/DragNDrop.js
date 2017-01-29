var DragNDrop = function (pos,model, path, modelFilename, texturePath, tag){

	var currentObject;
	var currentObjectSize;
	var isSnapped = false;
	var isDragging = false;

	var lastValidPos;
	var lastValidParent;
	
	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.ImportMesh(model, path, modelFilename, scene, function (newMeshes) 
	{
	    // Set the target of the camera to the first imported mesh
	    // camera.target = newMeshes[0];
	    
	    currentObject = newMeshes[0];
	    var extendSize  = currentObject.getBoundingInfo().boundingBox.extendSize;
	    currentObjectSize = extendSize.scale(2/100);
	    currentObject.rotation.y = 0;
	    var materialBox = new BABYLON.StandardMaterial("frameMat", scene);
	    materialBox.diffuseTexture = new BABYLON.Texture(texturePath, scene);
	    materialBox.specularColor = BABYLON.Color3.Black();
	    currentObject.material = materialBox;
	    //currentObject.position.y = 2;
	    currentObject.position = pos;
	    engine.hideLoadingUI();
	    
	    currentObject.onPointerDown = onPointerDown;
	    currentObject.onPointerUp = onPointerUp;
	    currentObject.onPointerMove = onPointerMove;
	    currentObject.uid = Global.meshCounter ++;
	    currentObject.tag = tag;
	    new CheckCollisions(currentObject);

	    currentObject.outlineWidth = 10;
    	currentObject.outlineColor = BABYLON.Color3.Blue();
	    
	    lastValidPos = currentObject.position;
	   	
	   	if(tag == "frame")
	   		currentObject.snapArray = new SnapPoints().frameSnaps;
	   	else if(tag == "door")
	   		currentObject.snapArray = [];

	   	//console.log(currentObject.snapArray);
	});

	
	function onPointerDown() {
	    // var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
	       
	    //     if(mesh == currentObject)
	    //         return mesh;
	    //  });

	    // if(pickResult.pickedPoint)
	    //  {
	    AddOutlineToMesh(currentObject);
	    lastValidPos = currentObject.position;
	    
	    if(isSnapped)
	    {
	    	var validParent = findValidParent(currentObject);
	    	validParent.onPointerDown();
	    	return;
	    }
	    	//console.log("Down " + currentObject.uid);
	    // var bbScale = currentObjectSize.scale(1/20);
	    // var bbPos = BABYLON.Vector3.Zero();
	    // console.log(bbPos);
	    // bbPos.x = currentObject.position.x - currentObject.position.x/60;
	    // bbPos.y = currentObject.position.y + currentObject.position.y/2;
	    // bbPos.z = currentObject.position.z;
	    //  BoundingBox.scaling = bbScale;
	    //  BoundingBox.position = bbPos;

	//     	currentObject.enableEdgesRendering();	
	// currentObject.edgesWidth = 4.0;
	// currentObject.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
			
	        isDragging = true;
	        //camera.detachControl(canvas, false);
	     // }
	};

	function onPointerUp() {
	    isDragging = false;
	    //console.log("Up " + currentObject.uid);
	    camera.attachControl(canvas, false);  
	    RemoveOutlineAll();
	    lastValidPos = currentObject.position;
	   
	};

	function onPointerMove() {
	     
	     if(isSnapped)
	    {
	    	var validParent = findValidParent(currentObject);
	    	validParent.onPointerMove();
	    	lastValidParent = validParent;
	    	return;
	    }
	     //console.log(currentObject.uid + " " + isDragging);
	    if(!isDragging)   
	        return;
    
	    if(CollisionDictionary[currentObject.uid].length > 0)
	    {
	    	
	    	var collMesh = CollisionDictionary[currentObject.uid][0];
	    	if(collMesh && tag == "door" && collMesh.tag == "frame") // door with frame
	    	{
	    		var closestSnap = findClosestSnap(currentObject.position,"door",collMesh.snapArray);

	    		//console.log(collMesh.uid + ":" +collMesh.snapArray);

	    		if(closestSnap)
	    		{
	    			closestSnap.isSnapped = true;
	    			currentObject.parent = collMesh;
		    		isSnapped = true;
		    		currentObject.scaling = new BABYLON.Vector3(1,1,1);
		    		currentObject.rotation = BABYLON.Vector3.Zero();
		    		currentObject.locallyTranslate(closestSnap.point);
		    		lastValidPos = currentObject.position;
	    		}
	    		else
	    		{
	    			showCollision(collMesh);
	    		}

	    		
	    		return;
	    	}
	    	else if(collMesh && tag == "frame" && collMesh.tag == "frame") // frame with frame
	    	{
	    		var closestSnap = findClosestSnap(currentObject.position,"frame",collMesh.snapArray);
	    		if(closestSnap)
	    		{
	    			closestSnap.isSnapped = true;
	    			currentObject.parent = collMesh;
		    		isSnapped = true;
		    		currentObject.scaling = new BABYLON.Vector3(1,1,1);
		    		currentObject.locallyTranslate(closestSnap.point);
		    		currentObject.rotation = BABYLON.Vector3.Zero();
		    		lastValidPos = currentObject.position;
	    		}
	    		else
	    		{
	    			showCollision(collMesh);
	    		}
	    		
	    		return;
	    	}
	    	else if(collMesh && tag == "frame" && collMesh.tag == "door")
	    	{
	    		showCollision(collMesh);
	    	    return;		
	    	}
	    	else if(collMesh && tag == "door" && collMesh.tag == "door")
	    	{
	    		showCollision(collMesh);
	    	    return;		
	    	}
	    }

	      var tempMesh;
	     // We try to pick an object
	     var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
	       
	       if(currentObject != mesh && currentObject != mesh.parent && mesh != currentObject.parent)
	       {
	            tempMesh = mesh;
	            return mesh;
	       }    
	     });
	     	     
	     if(pickResult.pickedPoint)
	     {
	        
	        if(tempMesh)
	        {
	            currentObject.position = pickResult.pickedPoint;
	            checkWallFloor(pickResult.pickedMesh.name);

	        }      
	     }


	     tempMesh = null;
		
		
	};

	function showCollision(collMesh)
	{
		currentObject.position = lastValidPos;
	    collMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
	    isDragging = false;
	}

	function checkWallFloor(wallName)
	{
	    if(wallName == "wallLeft")
	    {
	       currentObject.rotation.y = -Math.PI/2;
	       
	    }
	    else if(wallName == "wallCenter")
	    {
	        currentObject.rotation.y = 0;
	        
	    }
	    else if(wallName == "wallRight")
	    {
	        currentObject.rotation.y = Math.PI/2;
	        currentObject.position.x = groundSize/2 - currentObjectSize.z/2;
	    }
	    

	    // Limit the object by checking the rotation
	    if( currentObject.rotation.y == -Math.PI/2) // facing right
	    {
	        if(currentObject.position.x < -groundSize/2 + currentObjectSize.z/2) // left
	         currentObject.position.x = -groundSize/2 + currentObjectSize.z/2;
	        
	        if(currentObject.position.x > groundSize/2 - currentObjectSize.z/2) // right
	            currentObject.position.x = groundSize/2 - currentObjectSize.z/2;

	        if(currentObject.position.z > groundSize/2 - currentObjectSize.x/2) // center
	            currentObject.position.z = groundSize/2 - currentObjectSize.x/2;

	    }
	    else if(currentObject.rotation.y == Math.PI/2) // facing left
	    {
	        if(currentObject.position.x < -groundSize/2 + currentObjectSize.z/2) // left
	         currentObject.position.x = -groundSize/2 + currentObjectSize.z/2;
	        
	        if(currentObject.position.x > groundSize/2 - currentObjectSize.z/2) // right
	            currentObject.position.x = groundSize/2 - currentObjectSize.z/2;

	        if(currentObject.position.z > groundSize/2 - currentObjectSize.x/2) // center
	            currentObject.position.z = groundSize/2 - currentObjectSize.x/2;
	    }
	    else if(currentObject.rotation.y == 0) // facing camera
	    {
	        if(currentObject.position.x < -groundSize/2 + currentObjectSize.x/2) // left
	         currentObject.position.x = -groundSize/2 + currentObjectSize.x/2;
	        
	        if(currentObject.position.x > groundSize/2 - currentObjectSize.x/2) // right
	            currentObject.position.x = groundSize/2 - currentObjectSize.x/2;

	        if(currentObject.position.z > groundSize/2 - currentObjectSize.z/2) // center
	            currentObject.position.z = groundSize/2 - currentObjectSize.z/2;
	    }

	    // Floor
	    if(currentObject.position.y < currentObjectSize.y/2)
	    {
	        currentObject.position.y = currentObjectSize.y/2;
	    }


	}

	
}


function findValidParent(childObj)
{
	if(childObj.parent != undefined)
	{
		par = childObj.parent;
		par = findValidParent(par);
		if(par != undefined)
			return par;
	}
	else
	{
		return childObj;
	}
	

	
}
