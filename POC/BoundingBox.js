var BoundingBox

var CreateBoundingBox = function(){

   BoundingBox =     
        BABYLON.Mesh.CreateLines("BoundingBox", [
                // base
        new BABYLON.Vector3(-10, 0, 10),
        new BABYLON.Vector3(10, 0, 10),
        new BABYLON.Vector3(10, 0, -10),
        new BABYLON.Vector3(-10, 0, -10),
        new BABYLON.Vector3(-10, 0, 10),
                // moving up in the world...
        new BABYLON.Vector3(-10, 20, 10),
                // top
        new BABYLON.Vector3(10, 20, 10),
        new BABYLON.Vector3(10, 20, -10),
        new BABYLON.Vector3(-10, 20, -10),
        new BABYLON.Vector3(-10, 20, 10),
                // the last three uprights
        new BABYLON.Vector3(10, 20, 10),
        new BABYLON.Vector3(10, 0, 10),
        new BABYLON.Vector3(10, 0, -10),
        new BABYLON.Vector3(10, 20, -10),
        new BABYLON.Vector3(-10, 20, -10),
        new BABYLON.Vector3(-10, 0, -10)
        ], scene);

        BoundingBox.color = new BABYLON.Color3(0,0,255);
}




