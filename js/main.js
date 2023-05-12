import * as THREE from './lib/three.module.js';

import { GLTFLoader } from './lib/GLTFLoader.js';
import { DRACOLoader } from './lib/DRACOLoader.js';

import { init } from './init.js'
import { get_lights } from './lights.js'

import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js'

// Stats
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

var HOW_MANY_PENGUINS = 36;
var MODEL_SCALE = 2;
var ROTATION_SPEED = 0.01;
var POSITION_SPEED = 0.05;

var model;
function main() {
    var { scene, renderer, camera } = init(THREE);
    var scene = get_lights(THREE, scene)
    const directions = {};

    const textureLoader = new THREE.TextureLoader();
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./js/lib/')
    loader.setDRACOLoader(dracoLoader);
    loader.load(
        // gltf-pipeline -i model.glb -o model.gltf -d
        './gltf/penguin.glb',
        function (gltf) {
            for (let i = 0; i < HOW_MANY_PENGUINS; i++) { // create 5 copies of the model
                
                const texture = textureLoader.load(`./textures/texture${i}.jpg`);
                
                model = gltf.scene.clone();
                model.scale.set(MODEL_SCALE);
                model.name = `model-${i}`;
                // directions[`model-${i}`] = Math.random() * Math.PI * 2;
                
                model.position.x = Math.random() * 60 - 30;
                // model.position.y = 0;
                model.position.y = Math.random() * 80 - 40 ;

                model.rotation.x = Math.random();
                model.rotation.y = Math.random();
                model.rotation.z = Math.random();

                directions[`model-${i}`] = {
                    position: {x: Math.random() * POSITION_SPEED, y: Math.random() * POSITION_SPEED, z: Math.random() * POSITION_SPEED},
                    rotation: { x: Math.random() * ROTATION_SPEED, y: Math.random() * ROTATION_SPEED, z: Math.random() * ROTATION_SPEED}
                };

            model.castShadow = true
            model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE)
            model.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.flatShading = true;
                    node.blending = THREE.NoBlending;
                    // const newMaterial = new THREE.MeshPhongMaterial({ color: node.material.color });
                    // node.material = newMaterial;
                    const material = node.material.clone(); // create a new material instance for this mesh
                    material.map = texture; // assign the texture to this material instance
                    node.material = material;
                    
                    // const texture = textureLoader.load(`./textures/texture${i}.jpg`);
                    // node.material.map = texture;

                }
            });
            scene.add(model);
        }})

    

    function render() {
        stats.update()
        setTimeout( function() {

            for (let i = 0; i < HOW_MANY_PENGUINS; i++) {
                if(model){
                const model0 = scene.getObjectByName(`model-${i}`);
                model0.position.x += directions[`model-${i}`].position.x;
                model0.position.y += directions[`model-${i}`].position.y;
                model0.position.z += directions[`model-${i}`].position.z;
                model0.rotation.x += directions[`model-${i}`].rotation.x;
                model0.rotation.y += directions[`model-${i}`].rotation.y;
                model0.rotation.z += directions[`model-${i}`].rotation.z;
            }
        }
// 

    // 


        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }, 1000 / 30 );
    }
    requestAnimationFrame(render);

}

main();

