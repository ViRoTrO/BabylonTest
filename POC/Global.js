var Global = {

}

Global.meshCounter = 0;


// Dictionary

var CollisionDictionary = {


}

var Snap = function(){
	this.name = "";
	this.point = "";
	this.isSnaped = "";
	this.type = "";
};

function addSnaps(name, point, isSnaped,type)
{
	var tempSnap = new Snap();
	tempSnap.name = name;
	tempSnap.point = point;
	tempSnap.isSnaped = isSnaped;
	tempSnap.type = type;

	return tempSnap;
}

var SnapPoints = function(){
	return {

		frameSnaps:[
			addSnaps("frame", new BABYLON.Vector3(5, 12, -270), false, "door"),
			addSnaps("frame", new BABYLON.Vector3(10, 380, 0), false, "frame"),
			
		]
	}

};


//console.log(new SnapPoints().frameSnaps);

// var snap = new BABYLON.Vector3(0,0,0);

// var snap1 = new BABYLON.Vector3(1,1,1);

// var snap2 = new BABYLON.Vector3(2,2,2);

// console.log(findClosestSnap(snap,"door",new SnapPoints().frameSnaps));


function findClosestSnap(currentPoint,type,snapArray)
{
	var tempSnap;
	var nearestSnap = null;
	var nearestDist = 0;
	for (var i = 0; i < snapArray.length; i++) {

		tempSnap = snapArray[i];

		if(tempSnap.isSnapped == true)
			continue;

		if(tempSnap.type == type)
		{
			nearestSnap = tempSnap;
			nearestDist = BABYLON.Vector3.Distance(currentPoint,tempSnap);
			continue;
		}

		if(BABYLON.Vector3.Distance(currentPoint,tempSnap) < nearestDist)
			nearestSnap = tempSnap;

	}

	return nearestSnap;
}