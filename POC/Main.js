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
var test = new DragNDrop(-10);

//var test = new DragNDrop(10);

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

