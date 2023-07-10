import * as THREE from './lib/three.module.js';

import { GLTFLoader } from './lib/GLTFLoader.js';
import { DRACOLoader } from './lib/DRACOLoader.js';

import { init } from './init.js'
import { get_lights } from './lights.js'

var HOW_MANY_PENGUINS = 36;
var MODEL_SCALE = 1.5;
var ROTATION_SPEED = 0.02;
var POSITION_SPEED = 0.05;
var FPS=60;

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
            for (let i = 0; i < HOW_MANY_PENGUINS; i++) {

                const texture = textureLoader.load(`./textures/texture${i}.jpg`);

                model = gltf.scene.clone();
                model.scale.set(MODEL_SCALE);
                model.name = `model-${i}`;

                model.position.x = Math.random() * 80 - 60;
                model.position.z = Math.random() * 100;
                model.position.y = Math.random() * 80 - 20;

                model.rotation.x = Math.random() * 2;
                model.rotation.y = -Math.random() * 2;
                model.rotation.z = Math.random() * 2;

                directions[`model-${i}`] = {
                    position: { x: Math.random() * POSITION_SPEED, y: -Math.random() * POSITION_SPEED, z: 0 },
                    rotation: { x: Math.random() * ROTATION_SPEED, y: Math.random() * ROTATION_SPEED, z: Math.random() * ROTATION_SPEED }
                };

                model.castShadow = true
                model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE)
                model.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = false;
                        node.receiveShadow = false;
                        node.blending = THREE.NoBlending;
                        const material = node.material.clone();
                        material.map = texture;
                        node.material = material;

                    }
                });
                scene.add(model);
            }
        })



    function render() {
        setTimeout(function () {

            for (let i = 0; i < HOW_MANY_PENGUINS; i++) {
                if (model) {
                    const model0 = scene.getObjectByName(`model-${i}`);
                    model0.position.x += directions[`model-${i}`].position.x;
                    model0.position.y += directions[`model-${i}`].position.y;
                    model0.position.z += directions[`model-${i}`].position.z;
                    model0.rotation.x += directions[`model-${i}`].rotation.x;
                    model0.rotation.y += directions[`model-${i}`].rotation.y;
                    model0.rotation.z += directions[`model-${i}`].rotation.z;
                    if (model0.position.y < -40) {
                        model0.position.y = 40
                    }
                    if (model0.position.x > 80) {
                        model0.position.x = -80
                    }
                }
            }

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }, 1000 / FPS);
    }
    requestAnimationFrame(render);

    

}

main();



