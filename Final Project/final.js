"use strict";

//Author: Cameron Rothwell, Fall 2019
// Window creation
var scene;
var camera;
var cubeCamera;
var cubeCamera2;
var renderer;
var controls;
var id;
var image1, image2;

// Room creation
var geometry;
var room;
var texture;
var texMaterial;
var addval;


//Shape creation
var minX, minZ, minY, maxY, maxX, maxZ;
var material;
var tempMaterial;
var shape;
var numSets;

var light;
var lightMod;
var lightInt = 5;

var cubeGeometry, sphereGeometry, octahedronGeometry, cylinderGeometry;
var numShapes = 4; // Base this on the type of shape seen above
var reflectRes = 256;

//Misc
var customCubeArray = [];
var cubeArray = [];
var cameraBool = false;
var movement = 0;
var clock = new THREE.Clock();
var cube;

var textureButton;
var textureBool = true;
var cubeButton;
var slider3, slider10, slider30, slider50, slider70, slider100;
var sliderValue;


window.onload = function init()
{
    numSets = 3

   // Setting up the Scene, Camera, and Renderer
   camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );

   controls = new FirstPersonControls( camera );
   controls.movementSpeed = 100;
   controls.lookSpeed = 0.1;

   controls.lookAt( 500, 500, 500 );

   textureButton = document.getElementById("textureButton");
   cubeButton = document.getElementById("cube");

   textureButton.addEventListener("click", textureCall);
   cubeButton.addEventListener("click", customCube);

   slider3 = document.getElementById("slider3");
   slider10 = document.getElementById("slider10");
   slider30 = document.getElementById("slider30");
   slider50 = document.getElementById("slider50");
   slider70 = document.getElementById("slider70");
   slider100 = document.getElementById("slider100");
   sliderValue = document.getElementById("sliderValue");

   slider3.addEventListener("click", slider3Set);
   slider10.addEventListener("click", slider10Set);
   slider30.addEventListener("click", slider30Set);
   slider50.addEventListener("click", slider50Set);
   slider70.addEventListener("click", slider70Set);
   slider100.addEventListener("click", slider100Set);

   image1 = document.getElementById("youwin1");
   image2 = document.getElementById("youwin2");

   renderer = new THREE.WebGLRenderer();
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );

 
    createRoom();

    animate();
}

function createRoom() {

    // Create a new scene 
    scene = new THREE.Scene();

    // Load texture
    changeTexture();
    texMaterial = new THREE.MeshStandardMaterial( { map: texture} );


    // Create the walls/floor
    if ((numSets / 10) > 1) {
        addval = numSets/10;
    } else {
        addval = 1;
    }

    maxX = -((numSets+addval)*100) + 500/2+100;
    minX = 500/2+100; 
    maxY = 195;
    minY = -75;
    maxZ = -((numSets+addval)*100) + (4*77); 
    minZ = (4*77); 

    // Floor
    geometry = new THREE.CubeGeometry((numSets+addval) * 100, 1, (numSets+addval)*100);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = -((numSets+addval)*100)/2 + 500/2+100;
    room.position.y = -80;
    room.position.z = -((numSets+addval)*100)/2 + (4*77);
    scene.add(room);

    // Ceiling
    geometry = new THREE.CubeGeometry((numSets+addval) * 100, 1, (numSets+addval)*100);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = -((numSets+addval)*100)/2 + 500/2+100;
    room.position.y = 130;
    room.position.z = -((numSets+addval)*100)/2 + (4*77);
    scene.add(room);

    // Left: max X(/2), min Z
    geometry = new THREE.CubeGeometry((numSets+addval) * 100, 300, 1);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = -((numSets+addval)*100)/2 + 500/2+100;
    room.position.y = -20;
    room.position.z = (4*77);
    scene.add(room);

    // Right: max X(/2), max Z
    geometry = new THREE.CubeGeometry((numSets+addval) * 100, 300, 1);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = -((numSets+addval)*100)/2 + 500/2+100;
    room.position.y = -20;
    room.position.z = -((numSets+addval)*100) + (4*77);
    scene.add(room);

    // Front: max X, max Z(/2)
    geometry = new THREE.CubeGeometry(1, 300, (numSets+addval) * 100);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = -((numSets+addval)*100) + 500/2+100;
    room.position.y = -20;
    room.position.z = -((numSets+addval)*100)/2 + (4*77);
    scene.add(room);

    // Back: min X, max Z(/2)
    geometry = new THREE.CubeGeometry(1, 300, (numSets+addval) * 100);
    room = new THREE.Mesh(geometry, texMaterial);
    room.position.x = 500/2+100;
    room.position.y = -20;
    room.position.z = -((numSets+addval)*100)/2 + (4*77);
    scene.add(room);


    // Create reflection maps for shapes
    cubeCamera = new Map();
    for (var i = 0; i < numSets; i++) {
        for (var k = 0; k < numShapes; k++) {
            cubeCamera.set([i][k], new THREE.CubeCamera( 1, 1000, reflectRes ));
            cubeCamera.get([i][k]).renderTarget.texture.generateMipmaps = true;
            cubeCamera.get([i][k]).renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
            scene.add( cubeCamera.get([i][k]) );
        }
    }

    // Create Geometries
    cubeGeometry = new THREE.BoxBufferGeometry(50, 50, 50);
    sphereGeometry = new THREE.SphereBufferGeometry(25, 10, 10);
    octahedronGeometry = new THREE.OctahedronBufferGeometry(25, 0);
    cylinderGeometry = new THREE.CylinderBufferGeometry(25, 25, 100, 3);

    // Create Shapes,
    // Randomize the scale and positions of shapes
    for (var i = 0; i < numSets; i++) {
        //Cube
        tempMaterial = new THREE.MeshBasicMaterial( {
            envMap: cubeCamera.get([i][0]).renderTarget.texture
        } );
        shape = new THREE.Mesh(cubeGeometry, tempMaterial);
        shape.position.x = getRandomArbitrary(minX, maxX); 
        shape.position.y = getRandomArbitrary(minY, maxY);
        shape.position.z = getRandomArbitrary(minZ, maxZ);
        shape.scale.x = getRandomArbitrary(3, numSets/2 +4);
        shape.scale.y = getRandomArbitrary(3, numSets/2 +4);
        shape.scale.z = getRandomArbitrary(3, numSets/2 +4);
        scene.add(shape);

        //Sphere
        tempMaterial = new THREE.MeshBasicMaterial( {
            envMap: cubeCamera.get([i][1]).renderTarget.texture
        } );
        shape = new THREE.Mesh(sphereGeometry, tempMaterial);
        shape.position.x = getRandomArbitrary(minX, maxX); 
        shape.position.y = getRandomArbitrary(minY, maxY);
        shape.position.z = getRandomArbitrary(minZ, maxZ);
        shape.scale.x = getRandomArbitrary(3, numSets/2 +4);
        shape.scale.y = getRandomArbitrary(3, numSets/2 +4);
        shape.scale.z = getRandomArbitrary(3, numSets/2 +4);
        scene.add(shape);

        //Octahendron
        tempMaterial = new THREE.MeshBasicMaterial( {
            envMap: cubeCamera.get([i][2]).renderTarget.texture
        } );
        shape = new THREE.Mesh(octahedronGeometry, tempMaterial);
        shape.position.x = getRandomArbitrary(minX, maxX); 
        shape.position.y = getRandomArbitrary(minY, maxY);
        shape.position.z = getRandomArbitrary(minZ, maxZ);
        shape.scale.x = getRandomArbitrary(3, numSets/2 +3);
        shape.scale.y = getRandomArbitrary(3, numSets/2 +3);
        shape.scale.z = getRandomArbitrary(3, numSets/2 +3);
        scene.add(shape);

        //Cylinder
        tempMaterial = new THREE.MeshBasicMaterial( {
            envMap: cubeCamera.get([i][3]).renderTarget.texture
        } );
        shape = new THREE.Mesh(cylinderGeometry, tempMaterial);
        shape.position.x = getRandomArbitrary(minX, maxX); 
        shape.position.y = getRandomArbitrary(minY, maxY);
        shape.position.z = getRandomArbitrary(minZ, maxZ);
        shape.scale.x = getRandomArbitrary(3, numSets/2 +3);
        shape.scale.y = getRandomArbitrary(3, numSets/2 +3);
        shape.scale.z = getRandomArbitrary(3, numSets/2 +3);
        scene.add(shape);
    }


    // Lighting
    scene.add(new THREE.HemisphereLight( 0xffffff, 0xffffff, 10));

    var bulb = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), new THREE.MeshBasicMaterial({color: 0xFEF9B7}));
    light = new THREE.PointLight( 0xFEF9B7, lightInt, 100000 );
    light.position.set(getRandomArbitrary(minX, maxX), getRandomArbitrary(minX, maxX), getRandomArbitrary(minX, maxX));
    scene.add(light);
    light.add(bulb);

    lightMod = new THREE.Vector3(1, 1, 1);
    changeLightMod();
}

function checkCameraBounds() {

    // Sorry, the min and max values are all screwed up. 
    // They work, but don't make sense.

    if (camera.position.x > minX -10) {
        camera.position.x = minX -10;
    }
    if (camera.position.x < maxX +10) {
        camera.position.x = maxX +10;
    }

    if (camera.position.y < -81 +10) {
        camera.position.y = -81 +10;
    }
    if (camera.position.y >  132 -10) {
        camera.position.y = 132 - 10;
    }

    if (camera.position.z > minZ -10) {
        camera.position.z = minZ -10;
    }
    if (camera.position.z < maxZ +10) {
        camera.position.z = maxZ +10;
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function slider3Set() {
    sliderValue.innerText = slider3.innerText;
    numSets = parseInt(slider3.innerText);
    reflectRes = 256;
    createRoom();
}
function slider10Set() {
    sliderValue.innerText = slider10.innerText;
    numSets = parseInt(slider10.innerText);
    reflectRes = 128;
    createRoom();
}
function slider30Set() {
    sliderValue.innerText = slider30.innerText;
    numSets = parseInt(slider30.innerText);
    reflectRes = 64;
    createRoom();
}
function slider50Set() {
    sliderValue.innerText = slider50.innerText;
    numSets = parseInt(slider50.innerText);
    reflectRes = 16;
    createRoom();
}
function slider70Set() {
    sliderValue.innerText = slider70.innerText;
    numSets = parseInt(slider70.innerText);
    reflectRes = 8;
    createRoom();
}
function slider100Set() {
    sliderValue.innerText = slider100.innerText;
    numSets = parseInt(slider100.innerText);
    reflectRes = 4;
    createRoom();
}

function changeTexture() {
    if (textureBool == false) {
        texture = new THREE.TextureLoader().load( 'stars.png' );
        lightInt = 2;
    } else {
        texture = new THREE.TextureLoader().load( 'stars.jpg' );
        lightInt = 5;
    }
}

function textureCall() {
    if (textureBool == false) {
        textureBool = true;
    } else {
        textureBool = false;
    }
    createRoom();
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
            cube.position.x = getRandomArbitrary(minX, maxX);
            cube.position.y = getRandomArbitrary(minY, maxY);
            cube.position.z = getRandomArbitrary(minZ, maxZ);
            scene.add(cube);
            customCubeArray.push(cube);
        }
    }
}

function changeLightMod() {
    lightMod.x = getRandomArbitrary(-2, 2);
    lightMod.y = getRandomArbitrary(-2, 2);
    lightMod.z = getRandomArbitrary(-2, 2);
}

function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

function youwin() {
    image1.width = 500;
    image1.height = 500;
    image2.width = 600;
    image2.height = 400;
    cancelAnimationFrame(id);
}

function animate() {

    id = requestAnimationFrame( animate );

    if (cameraBool == false) {
        controls.update( clock.getDelta() );
    }

    // Update Shape Maps
    for (var i = 0; i < numSets; i++) {
        // Cube
        cubeCamera.get([i][0]).update(renderer, scene);

        // Sphere
        cubeCamera.get([i][1]).update(renderer, scene);

        //Octahedron
        cubeCamera.get([i][2]).update(renderer, scene);

        //Cylinder
        cubeCamera.get([i][3]).update(renderer, scene);
    }

    // Update light positions
    if (light.position.x > minX -10) {
        light.position.x = minX -10;
        changeLightMod();
    }
    if (light.position.x < maxX +10) {
        light.position.x = maxX +10;
        changeLightMod();
    }
    if (light.position.y < -81 +10) {
        light.position.y = -81 +10;
        changeLightMod();
    }
    if (light.position.y >  132 -10) {
        light.position.y = 132 - 10;
        changeLightMod();
    }
    if (light.position.z > minZ -10) {
        light.position.z = minZ -10;
        changeLightMod();
    }
    if (light.position.z < maxZ +10) {
        light.position.z = maxZ +10;
        changeLightMod();
    }
    light.position.x += lightMod.x;
    light.position.y += lightMod.y;
    light.position.z += lightMod.z;

    // check to see if the player won
    var distance = distanceVector(camera.position, light.position);
    if (distance > -10 && distance < 10) {
        youwin();
    }

    checkCameraBounds();

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