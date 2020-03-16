"use strict";

/** The name of the world to display. */
let worldName = 'galvin_flat_14';


/** Resolution multiplier. Reduce to improve performance. */
let resolutionMultiplier = 1;


/** The ThreeJS scene. */
let scene;
/** The camera, allowing the user to view the map. */
let camera;
/** The ThreeJS WebGL renderer. */
var renderer;
/** The map controls, allowing the user to pan, zoom, and tilt. */
var controls;

var sunLight;

var raycaster;
var mouse;

/** The world. */
var world;

/**
 * Initialize the 3D map.
 */
function init() {
    /** The map div on the web app. */
    var mapElement = document.getElementById("map");

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x66a8f8);

    // Camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 64, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * resolutionMultiplier, window.innerHeight * resolutionMultiplier);
    mapElement.appendChild(renderer.domElement);

    // Shadows
    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Map controls
    controls = new THREE.MapControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.125;
    //controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 255;
    controls.maxPolarAngle = Math.PI / 2;
    //controls.addEventListener( 'change', renderer.render(scene, camera));

    // Lights
    sunLight = new THREE.DirectionalLight(0xFFFFFF);
    sunLight.position.set(8, 255, 16);
    //sunLight.castShadow = true;
    scene.add(sunLight);

    var ambientLight = new THREE.AmbientLight(0x2A2A47);//(0x2A2A47);
    scene.add(ambientLight);

    // Mouse and Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Window resize handler
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousemove", onMouseMove);

    // World
    world = new World(worldName);

    // Test data
    placeOceanSurface();
    placeClouds();
    placeBlock(0, 0, 0, "stone");
    placeBlock(1, 1, 1, "dirt");
}

/**
 * Runs every time the screen is refreshed, to render the scene.
 */
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
};


/**
 * Adjusts the camera and renderer when the window is resized.
 */
function onWindowResize() {
    // Adjust camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Adjust renderer size
    renderer.setSize(window.innerWidth * resolutionMultiplier, window.innerHeight * resolutionMultiplier);
}


/**
 * Updates the on-screen coords when mouse is moved.
 */
function onMouseMove(event) {
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        let point = intersects[0].point;

        let x = Math.floor(point.x);
        let z = Math.floor(point.z);

        document.getElementById("location-coords").innerHTML = x + " " + z;
    }
}


/**
 * Places the ocean surface.
 */
function placeOceanSurface() {
    var loader = new THREE.TextureLoader();
    loader.load("assets\\water_still.png", function (texture) {
        // Prevent anti-aliasing to preserve pixelated look
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1024, 64);

        let geometry = new THREE.PlaneGeometry(1024, 1024);
        let material = new THREE.MeshLambertMaterial({ map: texture });
        let surface = new THREE.Mesh(geometry, material);

        surface.position.set(0, 0, 0);
        surface.rotation.x = - Math.PI / 2;

        scene.add(surface);
    });
}
/**
 * Places the clouds.
 */
function placeClouds() {
    var loader = new THREE.TextureLoader();
    loader.load("assets\\clouds.png", function (texture) {
        // Prevent anti-aliasing to preserve pixelated look
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

        let geometry = new THREE.PlaneGeometry(1024, 1024);
        let material = new THREE.MeshBasicMaterial({ map: texture });
        let surface = new THREE.Mesh(geometry, material);

        surface.position.set(0, 255, 0);
        surface.rotation.x = - Math.PI / 2;

        scene.add(surface);
    });
}


/**
 * Breaks (removes) a block.
 */
function breakBlock(x, y, z) {
    //scene.remove(x, y, z);
    placeBlock(x, y, z, "air");
}

/**
 * Places a block.
 */
function placeBlock(x, y, z, material) {
    /*// Remove any existing block
    breakBlock(x, y, z);

    // Load the texture
    var loader = new THREE.TextureLoader();
    loader.load("assets\\" + material + ".png", function (texture) {
        // Prevent anti-aliasing to preserve pixelated look
        texture.magFilter = THREE.NearestFilter;

        // Create a 1x1x1 cube with the texture
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({ map: texture });
        var block = new THREE.Mesh(geometry, material);

        // Set its position
        block.position.set(x, y, z);

        // Place the block in the scene
        scene.add(block);
        //renderer.render(scene, camera);
    });*/

    world.setBlock(x, y, z, 1);
}


/**
 * Changes the world being displayed.
 */
function setWorld(newWorldName) {
    worldName = newWorldName;

    document.getElementById("location-name").innerHTML = "World " + worldName;
}


init();
animate();