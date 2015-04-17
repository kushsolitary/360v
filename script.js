var manualControl = false;
var longitude = -96;
var latitude = -3;
var savedX;
var savedY;
var savedLongitude;
var savedLatitude;

// panoramas background
var panoramasArray = ['2.jpg', '1.jpg'];
var panoramaNumber = 0;

// setting up the renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 360);
document.body.appendChild(renderer.domElement);

// creating a new scene
var scene = new THREE.Scene();

// adding a camera
var camera = new THREE.PerspectiveCamera(75, 640 / 360, 1, 1000);
camera.target = new THREE.Vector3(0, 0, 0);

// creation of a big sphere geometry
var sphere = new THREE.SphereGeometry(100, 100, 40);
sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

// creation of the sphere material
var sphereMaterial = new THREE.MeshBasicMaterial();
sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramasArray[panoramaNumber])

// geometry + material = mesh (actual object)
var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
scene.add(sphereMesh);

// listeners
document.addEventListener("mousedown", onDocumentMouseDown, false);
document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("mouseup", onDocumentMouseUp, false);

render();

function render(){
	requestAnimationFrame(render);

	// limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
  latitude = Math.max(-85, Math.min(85, latitude));

	// moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
	camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
	camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
	camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
	camera.fov = 65;
	camera.updateProjectionMatrix();

	camera.lookAt(camera.target);

	// calling again render function
	renderer.render(scene, camera);
}

// when the mouse is pressed, we switch to manual control and save current coordinates
function onDocumentMouseDown(event){
	event.preventDefault();

	manualControl = true;

	savedX = event.clientX;
	savedY = event.clientY;

	savedLongitude = longitude;
	savedLatitude = latitude;
}

// when the mouse moves, if in manual contro we adjust coordinates
function onDocumentMouseMove(event){
	if(manualControl){
		longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
		latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
	}
	console.log(longitude, latitude);
}

// when the mouse is released, we turn manual control off
function onDocumentMouseUp(event){
	manualControl = false;
}

var video = document.querySelector('video');
document.addEventListener('keyup', function(e) {
	// Hide the pano and play the video
	if (panoramaNumber === 0) {
		longitude = -197.5;
		latitude = -0.3;

		panoramaNumber = 1
		document.querySelector('canvas').style.display = 'none';

		// Change the pano image
		sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramasArray[panoramaNumber])

		video.style.display = 'block';
		video.play()
	}
	else {
		longitude = -283.5;
		latitude = -3.5;

		panoramaNumber = 0
		document.querySelector('canvas').style.display = 'none';

		// Change the pano image
		sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramasArray[panoramaNumber])

		video.style.display = 'block';
		video.play()
	}
});

video.onended = function () {
	// Hide the video and show pano
	video.style.display = 'none';
	document.querySelector('canvas').style.display = 'block';

	// Change to next video
	if (panoramaNumber === 1) {
		document.querySelector('source').src = '1.mov'
	}
	else {
		document.querySelector('source').src = '2.mov'
	}

	video.load();
}