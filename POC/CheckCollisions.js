var CheckCollisions = function(mesh)
{
	scene.registerBeforeRender(function () {
		var tempCollMesh = [];

		for (var i = 0; i < scene.meshes.length; i++) 
		{
			var tempMesh = scene.meshes[i];
			
		    if(tempMesh != mesh && tempMesh.name != "ground" && 
		    	tempMesh.name.search("wall") == -1 &&
		    	tempMesh != mesh.parent && mesh != tempMesh.parent)
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

var AddOutlineToMesh = function(mesh)
{	
	mesh.renderOutline = true;
	var childArray = mesh.getChildren();
	for (var i = 0; i < childArray.length; i++) 
	{
		var tempMesh = childArray[i];
		tempMesh.renderOutline = true;
	}
}

var RemoveOutlineAll = function()
{
	for (var i = 0; i < scene.meshes.length; i++) 
	{
		var tempMesh = scene.meshes[i];
		
		if(tempMesh.name != "ground" && tempMesh.name.search("wall") == -1)
		{
			tempMesh.renderOutline = false;

			var childArray = tempMesh.getChildren();
			for (var j = 1; j < childArray.length; j++) 
			{
				childArray[i];
				tempMesh.renderOutline = false;
			}
		}

		
	}
}