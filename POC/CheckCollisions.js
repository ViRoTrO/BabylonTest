var CheckCollisions = function(mesh)
{
	scene.registerBeforeRender(function () {
		var tempCollMesh = [];

		for (var i = 1; i < scene.meshes.length; i++) 
		{
			var tempMesh = scene.meshes[i];
			
		    if(tempMesh != mesh && tempMesh.name != "ground" && tempMesh.name.search("wall") == -1)
		    {
		    	if(mesh.intersectsMesh(tempMesh, false))
		    	{
		    		tempCollMesh.push(tempMesh);
		    	}
		        
			}
		}

		CollisionDictionary[mesh.uid] = tempCollMesh;
	});
}

