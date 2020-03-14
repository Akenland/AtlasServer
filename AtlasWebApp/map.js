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


/**
 * Initialize the 3D map.
 */
function init() {
    /** The map div on the web app. */
    var mapElement = document.getElementById("map");

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 512);
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
    controls.dampingFactor = 0.25;
    //controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 255;
    controls.maxPolarAngle = Math.PI / 2;
    //controls.addEventListener( 'change', renderer.render(scene, camera));

    // Lights
    var sunLight = new THREE.DirectionalLight(0xFAFAFA);
    sunLight.position.set(0, 255, 16);
    //sunLight.castShadow = true;
    scene.add(sunLight);

    var ambientLight = new THREE.AmbientLight(0x555555);//(0x2A2A47);
    scene.add(ambientLight);

    // Window resize handler
    window.addEventListener("resize", onWindowResize);

    // Test data
    placeBlock("stone", 0, 0, 0);
    placeBlock("dirt", 1, 1, 1);
}

/**
 * Runs every time the screen is refreshed, to render the scene.
 */
function animate() {
    setTimeout(function () {
        requestAnimationFrame(animate);
    }, 1000 / 30);

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
 * Breaks (removes) a block.
 */
function breakBlock(x, y, z) {
    scene.remove(x, y, z);
}

/**
 * Places a block.
 */
function placeBlock(material, x, y, z) {
    // Remove any existing block
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
    });
}


init();
animate();