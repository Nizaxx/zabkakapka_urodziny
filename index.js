import { 
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AxesHelper,
    AmbientLight,
    PointLight,
    RectAreaLight,
    TextureLoader,
    SpriteMaterial,
    Sprite,
    Raycaster,
    Vector2
} from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';

let 	canvas = document.getElementById('game'),
		canvasAsp = screen.width / screen.height,
        camera,
        controls,
        tort,
        iconsSprites = [],
        candlesLeft = [],
        lighttt = [],
        anim,
        rectLight = [];
const 	renderer = new WebGLRenderer( { antialias: false, canvas: canvas, powerPreference: 'high-performance' } ),
		scene = new Scene(),
		stats = new Stats();

function init() {
    let hellodiv = document.createElement('div');
    hellodiv.style = `position: absolute;display: block;z-index: 99;top:30%; left: ${(window.innerWidth/2) - 512/2}px;`;
    let txt = document.createElement('h1');
    txt.innerText = 'Pomyśl życzenie i zdmuchnij świeczki lewym myszki :) \n Poruszasz się też klikając lewym';
    txt.style = 'width:512px; height:30px; margin-top: -15px; text-align:center; font-weight: bold; font-family:Lucida Sans Unicode, Lucida Grande, sans-serif; font-size: 30px; color:orange;   text-shadow: -1px 0 yellow, 0 1px yellow, 1px 0 yellow, 0 -1px yellow;';
    hellodiv.appendChild(txt);
    canvas.parentElement.appendChild(hellodiv);
    setTimeout( () => {
        let _val = 0.975;
        let ID = setInterval( ()=> {
            if(_val<=0.05){
                txt.style.opacity=0;
                clearInterval( ID );
                canvas.parentElement.removeChild( hellodiv );
            } else {
                txt.style.opacity = _val;
                _val -= 0.025 + (_val/2.5);
            }
        }, 100);
    }, 8000);
    /*let axesHelper = new AxesHelper( 5 );
    axesHelper.position.set( 0.012522, 1.55611, -0.296613 );
    scene.add( axesHelper );*/

	// render
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    //document.body.appendChild( renderer.domElement );
    //console.log(renderer.domElement.parentElement);
	renderer.setPixelRatio( window.devicePixelRatio || 1 );
	renderer.gammaOutput = true;
	canvas.parentElement.appendChild( stats.dom );
    // camera
	camera = new PerspectiveCamera( //fov, aspect, close, far
		75,
		canvasAsp,
		0.1, 1000
    );

    // orbit control
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0, 0.5, 0);
    controls.update();
	controls.minPolarAngle = 0.25; // old one: 1.0303768265243125
	controls.maxPolarAngle = 1.5;
	controls.enableKeys = false;

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 1, 2 );
    controls.update();

    // light
    /*let ambient = new AmbientLight( 0x404040 );
    ambient.intensity = 0.5;
    scene.add( ambient );*/

    let rectLight1 = new RectAreaLight( 0xfffcbb, 1,  2, 2 );
    rectLight1.position.set( 0, 0.5, 3 );
    rectLight1.lookAt( 0, 0, 0 );
    scene.add( rectLight1 );
    let rectLight2 = rectLight1.clone();
    rectLight2.position.set( 0, 0.5, -3 );
    rectLight2.lookAt( 0, 0, 0 );
    scene.add( rectLight2 );
    let rectLight3 = rectLight1.clone();
    rectLight3.position.set( 3, 0.5, 0 );
    rectLight3.lookAt( 0, 0, 0 );
    scene.add( rectLight3 );
    let rectLight4 = rectLight1.clone();
    rectLight4.position.set( -3, 0.5, 0 );
    rectLight4.lookAt( 0, 0, 0 );
    scene.add( rectLight4 );

    rectLight.push( rectLight1 );
    rectLight.push( rectLight2 );
    rectLight.push( rectLight3 );
    rectLight.push( rectLight4 );

    let lightCoords = [
        [0.012522, 0.296613, 1.55611],
        [0.126406, 0.04385, 1.51359],
        [-0.129522, -0.171437, 1.50205],
        [0.295184, -0.415815, 1.29516],
        [0.083676, -0.443732, 1.2653],
        [-0.272627, -0.420763, 1.20381],
        [-0.424941, -0.08023, 1.08011],
        [-0.286032, 0.397751, 0.939898],
        [0.095236, 0.385534, 0.997839],
        [0.33894, 0.421643, 1.01575],
        [0.505924, 0.067835, 1.15753],
        [0.442081, -0.087206, 1.20546],
        [-0.288677, 0.665087, 0.78245],
        [-0.659953, 0.252501, 0.760023],
        [-0.632793, -0.196271, 0.722591],
        [-0.493308, -0.527583, 0.667974],
        [-0.097863, -0.628022, 0.667974],
        [0.230562, -0.678994, 0.647923],
        [0.490257, -0.455549, 0.662599],
        [0.710597, -0.101491, 0.68121],
        [0.603398, 0.257457, 0.720493]
    ];
    /*
        CONVERT COORDS BLENDER -> THREEJS
            THREEJS:    0.012522,   1.55611,    -0.296613
            BLENDER:    0.012522,  0.296613,   1.55611
    */
    let spriteMap = new TextureLoader().load( 'plomien.png' );
    let spriteMaterial = new SpriteMaterial( { map: spriteMap, color: 0xE16666 } );
    for( let i=0; i < lightCoords.length; i++ ){
        let light = new PointLight( 0xf0dfcb, 1, 1.001 );
        light.decay = 2;
        light.power = Math.PI * 3;
        light.position.set( lightCoords[i][0], lightCoords[i][2], -lightCoords[i][1] );
        lighttt.push( light );
        scene.add( light );

        let sprite = new Sprite( spriteMaterial );
        sprite.position.set( lightCoords[i][0], lightCoords[i][2]+0.04, -lightCoords[i][1] );
        sprite.scale.set( 0.1, 0.1, 0.1 );
        iconsSprites.push( sprite );
        candlesLeft.push( sprite );
        scene.add( sprite );
    }

    DRACOLoader.setDecoderPath( '/draco/' );
    const loader = new GLTFLoader().setPath( './' );
    loader.setDRACOLoader( new DRACOLoader() );
    DRACOLoader.getDecoderModule();
    // tort
    loader.load(
        // resource URL
        'torcik.glb',
        // called when the resource is loaded
        function ( gltf ) {
            console.log(gltf);
            tort = gltf.scene.children[0].parent;
            scene.add( tort );
        },
        // called while loading is progressing
        function ( xhr ) {
            return false;
        },
        // called when loading has errors
        function ( error ) {

            console.log( `GLTF ERROR: ${error}` );

        }
    );


    anim = requestAnimationFrame( render );
}

function render(time) {	// time in ms 1000ms = 1s
    anim = requestAnimationFrame( render );
    
	renderer.render( scene, camera );
	stats.update();
}

let raycaster = new Raycaster();
let mouse = new Vector2();
function clickOnSprite(event){
    //console.log("CLICK! " + event.clientX + ", " + event.clientY);      

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
    raycaster.setFromCamera( mouse, camera );   

    var intersects = raycaster.intersectObjects( iconsSprites );
    console.log(lighttt);
    if( intersects[0] ) {
        let element = intersects[0];
        let indx = candlesLeft.indexOf(element.object);
        if(indx !== -1 ){
            scene.remove(element.object);
            candlesLeft.splice( indx, 1 );
            console.log( lighttt[indx] );
            lighttt[indx].intensity = 0;
            lighttt.splice( indx, 1 );
            console.log(candlesLeft.length);
        }
    }
    if(candlesLeft.length == 0) {
        for( let i=0; i < rectLight.length ; i++) {
            rectLight[i].intensity = 0.05;
        }
        end();
    }
}
document.addEventListener( 'mousedown', clickOnSprite, false );

function end(){
    candlesLeft.push( 123 );
    candlesLeft.push( 123 );
    candlesLeft.push( 123 );
    setTimeout(()=> {
        cancelAnimationFrame( anim );
    }, 1000);
    let cont = document.createElement('div');
    let txt = document.createElement('h1');
    txt.innerText = 'Wszystkiego najlepszego żabka :*';
    txt.style = 'width:512px; height:30px; margin-top: -15px; text-align:center; font-weight: bold; font-family:Lucida Sans Unicode, Lucida Grande, sans-serif; font-size: 75px; color:#660066;   text-shadow: -1px 0 #696969, 0 1px #696969, 1px 0 #696969, 0 -1px #696969;';
    cont.appendChild(txt);
    canvas.parentElement.appendChild(cont);
    cont.style = `position: absolute;display: block;z-index: 99;top:30%; left: ${(window.innerWidth/2) - 512/2}px;`;
    let audio = new Audio('2020_01_11_21_36_33.mp3');
    audio.play();
}

if ( WEBGL.isWebGLAvailable() ) {
	init();
} else {
	let warning = WEBGL.getWebGLErrorMessage();
	warning.style.position = 'absolute';
	warning.style.left = '50%';
	warning.style.transform = 'translateX(-50%)';
	canvas.parentElement.prepend( warning );
}