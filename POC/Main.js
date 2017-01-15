var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        var scene = new BABYLON.Scene(engine);
        //scene.debugLayer.show();
        //Adding a light
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);


        //Adding an Arc Rotate Camera
        var camera = new BABYLON.ArcRotateCamera("Camera",-1.58, 1.13, 50, new BABYLON.Vector3.Zero(), scene);
       //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0,20,-30), scene);
        camera.attachControl(canvas, false);
        
        camera.inertia = 0.5;
        // Show loading screen
        engine.displayLoadingUI();

        var currentObject;
        var currentObjectSize;
        var groundSize = 60;
        var wallWidth = groundSize;
        var wallHeight = 20;

        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("model", "Assets/Models/", "FR11.babylon", scene, function (newMeshes) {
            // Set the target of the camera to the first imported mesh
            // camera.target = newMeshes[0];
            engine.hideLoadingUI();
            currentObject = newMeshes[0];
            var extendSize  = currentObject.getBoundingInfo().boundingBox.extendSize;
            currentObjectSize = extendSize.scale(2/100);
            currentObject.rotation.y = 0;
            var materialBox = new BABYLON.StandardMaterial("frameMat", scene);
            materialBox.diffuseTexture = new BABYLON.Texture("Assets/Textures/FR11_A50247377.jpg", scene);
            currentObject.material = materialBox;
            currentObject.position.y = 2;

            camera.target = addGround(groundSize);
            addWalls(wallWidth,wallHeight);
            });
        

        // Move the light with the camera
        scene.registerBeforeRender(function () {
                       
        });

        // Render
        engine.runRenderLoop(function () {
            scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });


    function addGround(groundSize)
    {
        var ground = BABYLON.Mesh.CreateGround("ground", groundSize, groundSize, 2, scene);
        var materialGround = new BABYLON.StandardMaterial("groundMat", scene);
        materialGround.diffuseTexture = new BABYLON.Texture("Assets/Textures/floorTexture2.jpg", scene);
        ground.material = materialGround;
        materialGround.specularColor = BABYLON.Color3.Black();
        materialGround.diffuseTexture.uScale = 5.0;
        materialGround.diffuseTexture.vScale = 5.0;
        return ground;
    }

    function addWalls(width,height)
    {
        var wallLeft = BABYLON.MeshBuilder.CreatePlane("wallLeft",{width:width,height:height} , scene);
        var wallCenter = BABYLON.MeshBuilder.CreatePlane("wallCenter", {width:width,height:height}, scene);
        var wallRight = BABYLON.MeshBuilder.CreatePlane("wallRight",{width:width,height:height} , scene);

        var materialWall = new BABYLON.StandardMaterial("WallMat", scene);
        materialWall.diffuseTexture = new BABYLON.Texture("Assets/Textures/wall4.jpg", scene);
        materialWall.diffuseTexture.uScale = 10.0;
        materialWall.diffuseTexture.vScale = 10.0;


        wallLeft.material = materialWall;
        wallCenter.material = materialWall;
        wallRight.material = materialWall;

       
        // Positions
        wallLeft.position.x = -width/2;
        wallLeft.position.y = height/2;
       
        wallCenter.position.z = groundSize/2;
        wallCenter.position.y = height/2;

        wallRight.position.x = width/2;
        wallRight.position.y = height/2;

        // Rotations
         wallLeft.rotation.y = -Math.PI/2;
         wallRight.rotation.y = Math.PI/2;
    }

    var isDragging = false;
    window.addEventListener("mousedown", function () {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
           
            if(mesh.name == "model")
                return mesh;
         });

        if(pickResult.pickedPoint)
         {
            isDragging = true;
            camera.detachControl(canvas, false);
         }
    });

    window.addEventListener("mouseup", function () {
        isDragging = false;
        camera.attachControl(canvas, false);
    });
   
    window.addEventListener("mousemove", function () {
         
         if(!isDragging)   
            return;
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
         
    });


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