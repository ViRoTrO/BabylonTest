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

var SnapPoints = (function(){
	return {

		frameSnaps:[
			addSnaps("frame", new BABYLON.Vector3(5, 12, -270), false, "door"),

			addSnaps("frame", new BABYLON.Vector3(-5, 380, 0), false, "door"),
			addSnaps("frame", new BABYLON.Vector3(-5, 380, 0), false, "door"),
			addSnaps("frame", new BABYLON.Vector3(-5, 380, 0), false, "door")
		]
	}

})();


console.log(SnapPoints.frameSnaps);