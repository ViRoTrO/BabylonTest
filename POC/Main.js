var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var scene = new BABYLON.Scene(engine);
scene.collisionsEnabled = true;
//scene.debugLayer.show();

//Adding a light
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);


//Adding an Arc Rotate Camera
var camera = new BABYLON.ArcRotateCamera("Camera",-1.58, 1.13, 50, new BABYLON.Vector3.Zero(), scene);
//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0,20,-30), scene);
camera.attachControl(canvas, false);
camera.inertia = 0.5;
camera.checkCollisions = true;


// Show loading screen
engine.displayLoadingUI();
var test = new DragNDrop(-10,"model", "Assets/Models/", "FR11.babylon","Assets/Textures/FR11_A50247377.jpg", "frame");
var test = new DragNDrop(-5,"model", "Assets/Models/", "FR11.babylon","Assets/Textures/FR11_A70245848.jpg", "frame");

var test2 = new DragNDrop(5,"DR08", "Assets/Models/", "DR08.babylon","Assets/Textures/DR08_00291674.jpg", "door");
var test2 = new DragNDrop(10,"DR08", "Assets/Models/", "DR08.babylon","Assets/Textures/DR08_00291674.jpg", "door");

var groundSize = 60;
var wallWidth = groundSize;
var wallHeight = 20;

camera.target = addGround(groundSize);
addWalls(wallWidth,wallHeight);
        

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

canvas.addEventListener("pointerdown", onPointerDown, false);
canvas.addEventListener("pointerup", onPointerUp, false);
canvas.addEventListener("pointermove", onPointerMove, false);

scene.onDispose = function () {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
}

var draggingMesh = null;
function onPointerDown(evt) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh){
           
            if(mesh.name != "ground" && mesh.name.search("wall") == -1)
                return mesh;
         });

        if(pickResult.pickedMesh)
         {
            draggingMesh = pickResult.pickedMesh;
            draggingMesh.onPointerDown();
            camera.detachControl(canvas, false);
         }
    };

    function onPointerUp(evt) {
        if(draggingMesh)
        {
            draggingMesh.onPointerUp();
            draggingMesh = null;
        }
        
        camera.attachControl(canvas, false);
    };

    function onPointerMove(evt) {
         if(draggingMesh)
         {
            draggingMesh.onPointerMove();
         }
         
 
    };

