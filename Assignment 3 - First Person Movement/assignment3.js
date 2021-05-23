"use strict";

var scene;
var camera;
var renderer;
var controls;

var geometry;
var material;
var cube;
var addval;

var cameraBool = false;
var movement = 0;

var minX, minZ, maxX, maxZ;

var cubeArray = [];
var customCubeArray = [];
var numCubes = 20;

var room;

var clock = new THREE.Clock();

var cameraButton;
var cubeButton;


window.onload = function init()
{
   // Setting up the Scene, Camera, and Renderer
   camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );

   scene = new THREE.Scene();

   controls = new FirstPersonControls( camera );
   controls.movementSpeed = 100;
   controls.lookSpeed = 0.1;

   controls.lookAt( 500, 500, 500 );

   cameraButton = document.getElementById("cameraButton");
   cubeButton = document.getElementById("cube");

   cameraButton.addEventListener("click", changeCamera);
   cubeButton.addEventListener("click", customCube);


   renderer = new THREE.WebGLRenderer();
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );

 
    // Create Pillars
   geometry = new THREE.CubeGeometry(40, 250, 40);

    for (var i = 0; i < numCubes; i++) {
        for (var k = 0; k < numCubes; k++) {
            cube = new THREE.Mesh(geometry, material);
            cube.position.x = 500/2 - (i*100);
            cube.position.y = -10;
            cube.position.z = (4*77)/2 - (k*100);
            scene.add(cube);

            if ((i+k)%5 == 0) {
                cubeArray.push(cube);
            }
       }
   }

   // Create the walls/floor
    if ((numCubes / 10) > 1) {
        addval = numCubes/10;
    } else {
        addval = 1;
    }

    
    minX = -((numCubes+addval)*100) + 500/2+100;
    maxX = 500/2+100;
    minZ = -((numCubes+addval)*100) + (4*77);
    maxZ = (4*77);


    // Floor
    geometry = new THREE.CubeGeometry((numCubes+addval) * 100, 1, (numCubes+addval)*100);
    room = new THREE.Mesh(geometry, material);
    room.position.x = -((numCubes+addval)*100)/2 + 500/2+100;
    room.position.y = -80;
    room.position.z = -((numCubes+addval)*100)/2 + (4*77);
    scene.add(room);

    // Left: max X(/2), min Z
    geometry = new THREE.CubeGeometry((numCubes+addval) * 100, 300, 1);
    room = new THREE.Mesh(geometry, material);
    room.position.x = -((numCubes+addval)*100)/2 + 500/2+100;
    room.position.y = -20;
    room.position.z = (4*77);
    scene.add(room);

    // Right: max X(/2), max Z
    geometry = new THREE.CubeGeometry((numCubes+addval) * 100, 300, 1);
    room = new THREE.Mesh(geometry, material);
    room.position.x = -((numCubes+addval)*100)/2 + 500/2+100;
    room.position.y = -20;
    room.position.z = -((numCubes+addval)*100) + (4*77);
    scene.add(room);

    // Front: max X, max Z(/2)
    geometry = new THREE.CubeGeometry(1, 300, (numCubes+addval) * 100);
    room = new THREE.Mesh(geometry, material);
    room.position.x = -((numCubes+addval)*100) + 500/2+100;
    room.position.y = -20;
    room.position.z = -((numCubes+addval)*100)/2 + (4*77);
    scene.add(room);


    // Back: min X, max Z(/2)
    geometry = new THREE.CubeGeometry(1, 300, (numCubes+addval) * 100);
    room = new THREE.Mesh(geometry, material);
    room.position.x = 500/2+100;
    room.position.y = -20;
    room.position.z = -((numCubes+addval)*100)/2 + (4*77);
    scene.add(room);


   animate();
}

function checkCameraBounds() {
    if (camera.position.x > maxX -10) {
        camera.position.x = maxX -10;
    }
    if (camera.position.x < minX +10) {
        camera.position.x = minX +10;
    }

    if (camera.position.z > maxZ -10) {
        camera.position.z = maxZ -10;
    }
    if (camera.position.z < minZ +10) {
        camera.position.z = minZ +10;
    }

    camera.position.y = -65;
}

function changeCamera() {

    if (cameraBool == false) {
        camera = new THREE.OrthographicCamera(-minX/2, minX/2, -minZ/1.5, minZ/4, -599, 10000);
        camera.position.x = minX+200;
        camera.position.y = 600;
        camera.position.z = minZ-500;


        var eye = (minX/2, 601, minZ/2);
        var target = (minX/2, -40, minZ/2);
        var up = (1, 0, 0);
        camera.lookAt(eye, target, up);     

        controls = null;

        cameraBool = true;
    } else {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );

        controls = new FirstPersonControls( camera );
        controls.movementSpeed = 100;
        controls.lookSpeed = 0.1;
     
        controls.lookAt( 500, 500, 500 );


        cameraBool = false;
    }
}

function customCube() {
    geometry = new THREE.Geometry();

    geometry.vertices.push(
        new THREE.Vector3(-1, -1,  1),  // 0
        new THREE.Vector3( 1, -1,  1),  // 1
        new THREE.Vector3(-1,  1,  1),  // 2
        new THREE.Vector3( 1,  1,  1),  // 3
        new THREE.Vector3(-1, -1, -1),  // 4
        new THREE.Vector3( 1, -1, -1),  // 5
        new THREE.Vector3(-1,  1, -1),  // 6
        new THREE.Vector3( 1,  1, -1),  // 7
        new THREE.Vector3( -2,  1, -2),  // 8
        new THREE.Vector3( 2,  1, 2),  // 9
    );


    geometry.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
        //additional
        new THREE.Face3(9, 6, 3),
        new THREE.Face3(7, 5, 6),
        //ok
        new THREE.Face3(2, 5, 0),
        new THREE.Face3(8, 9, 2),
      );


    for (var i = 0; i < 10; i++) {
        cube = new THREE.Mesh(geometry, material);
        if (cameraBool == false) {
        cube.position.x = camera.position.x;
        cube.position.y = camera.position.y;
        cube.position.z = camera.position.z;
        } else {
            cube.position.x = minX-100;
            cube.position.y = 100;
            cube.position.z = minZ-100;
        }
        scene.add(cube);
        customCubeArray.push(cube);
    }
}

function animate() {

    requestAnimationFrame( animate );

    if (cameraBool == false) {
        controls.update( clock.getDelta() );
    }

    checkCameraBounds();

    //Pillar movement
    for (var i = 0; i < cubeArray.length; i++) {
        if (movement <= 199999) {
        cubeArray[i].position.x += (Math.random()) -0.25;
        cubeArray[i].position.z += (Math.random()) -0.25;
        movement++;
        } else if (movement == 200000) {
            movement += 250000;
        } else if (movement == 200001) {
            movement -= 200000;
        } else {
            cubeArray[i].position.x += (Math.random()) -0.75;
            cubeArray[i].position.z += (Math.random()) -0.75;
            movement--;
        }      
    }

    //Bee movement
    for (var i = 0; i < customCubeArray.length; i++) {
        customCubeArray[i].position.x += (Math.random()*5) -2.5;
        customCubeArray[i].position.y += (Math.random()*5) -2.5;
        customCubeArray[i].position.z += (Math.random()*5) -2.5;

        //make it follow the camera
        if (cameraBool == false) {
            if (customCubeArray[i].position.x < camera.position.x) {
                customCubeArray[i].position.x += 0.25;
            } else {
                customCubeArray[i].position.x += -0.25;
            }
            if (customCubeArray[i].position.y < camera.position.y) {
                customCubeArray[i].position.y += 0.25;
            } else {
                customCubeArray[i].position.y += -0.25;
            }        
            if (customCubeArray[i].position.z < camera.position.z) {
                customCubeArray[i].position.z += 0.25;
            } else {
                customCubeArray[i].position.z += -0.25;
            }
        }
    }

    renderer.render( scene, camera );
}