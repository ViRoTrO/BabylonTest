var DragNDrop = function (pos,model, path, modelFilename, texturePath, tag){

	var currentObject;
	var currentObjectSize;
	var isSnapped;
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
	    currentObject.material = materialBox;
	    currentObject.position.y = 2;
	    currentObject.position.x = pos;
	    engine.hideLoadingUI();
	    
	    currentObject.onPointerDown = onPointerDown;
	    currentObject.onPointerUp = onPointerUp;
	    currentObject.onPointerMove = onPointerMove;
	    currentObject.uid = Global.meshCounter ++;
	    currentObject.tag = tag;
	    new CheckCollisions(currentObject);
	});

	var isDragging = false;
	function onPointerDown() {
	    // var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
	       
	    //     if(mesh == currentObject)
	    //         return mesh;
	    //  });

	    // if(pickResult.pickedPoint)
	    //  {
	        isDragging = true;
	        //camera.detachControl(canvas, false);
	     // }
	};

	function onPointerUp() {
	    isDragging = false;
	    camera.attachControl(canvas, false);
	};

	function onPointerMove() {
	     
	     if(!isDragging || isSnapped)   
	        return;

	    if(CollisionDictionary[currentObject.uid].length > 0)
	    {
	    	
	    	var collMesh = CollisionDictionary[currentObject.uid][0];
	    	if(collMesh && tag == "door" && collMesh.tag == "frame")
	    	{
	    		console.log(currentObject.scaling);
	    		currentObject.parent = collMesh
	    		isSnapped = true;
	    		currentObject.scaling = new BABYLON.Vector3(1,1,1);
	    		currentObject.locallyTranslate(new BABYLON.Vector3(5, 12, -270));
	    		return;
	    	}

	    	
	    }

	      var tempMesh;
	     // We try to pick an object
	     var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
	       
	       if(mesh.name == "ground" || mesh.name.search("wall") != -1)
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