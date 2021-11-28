import * as BABYLON from 'babylonjs';
import { Color3, Vector3 } from 'babylonjs';
import { LAYER_TYPES, Scene, SceneArea, SceneObject } from './Scene';
import { Texture } from './Textures';
import * as earcut from 'earcut';

export const babylonRender = (canvas: HTMLCanvasElement, textures: Record<string, Texture>, scene: Scene) => {

    const createMaterial = (texture: Texture, targetScene: BABYLON.Scene, scale: boolean) => {
        const baseTexture = new BABYLON.Texture(texture.url, targetScene);
        const mat = new BABYLON.StandardMaterial("pbr" + Math.random(), targetScene);
        //const mat = new BABYLON.PBRMetallicRoughnessMaterial("pbr" + Math.random(), targetScene);
        mat.diffuseTexture = baseTexture;
        mat.specularColor = new Color3(0, 0, 0);
        //mat.metallic = 0;
        mat.roughness = 0.4;
        if (scale) {
            baseTexture.uScale = texture.scale;
            baseTexture.vScale = texture.scale;
        }
        baseTexture.hasAlpha = !scale;
        //mat.transparencyMode = 1;
        return mat;
    }

    const drawArea = (area: SceneArea, targetScene: BABYLON.Scene, offset: number) => {
        const renderedArea = BABYLON.MeshBuilder.CreatePolygon('area' + Math.random(), { shape: area.vertices.map(v => new Vector3(v[0], 0, v[1])), sideOrientation: BABYLON.Mesh.DOUBLESIDE }, targetScene, earcut);
        const mat = createMaterial(textures[area.texture], targetScene, true);
        renderedArea.material = mat;
        renderedArea.position = new Vector3(0, offset, 0);
        renderedArea.receiveShadows = true;
        return renderedArea;
    }

    const drawObject = (ob: SceneObject, targetScene: BABYLON.Scene, offset: number) => {
        const cube: Array<Vector3> = [
            new Vector3(ob.origin[0] - ob.radius / 2, 0, ob.origin[1] - ob.radius / 2),
            new Vector3(ob.origin[0] + ob.radius / 2, 0, ob.origin[1] - ob.radius / 2),
            new Vector3(ob.origin[0] + ob.radius / 2, 0, ob.origin[1] + ob.radius / 2),
            new Vector3(ob.origin[0] - ob.radius / 2, 0, ob.origin[1] + ob.radius / 2),
        ]
        const renderedArea = BABYLON.MeshBuilder.CreatePolygon('area' + Math.random(), { shape: cube, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, targetScene, earcut);
        const mat = createMaterial(textures[ob.texture], targetScene, false);
        renderedArea.material = mat;
        renderedArea.position = new Vector3(0, ob.height / 20 + offset, 0);
        renderedArea.receiveShadows = true;
        return renderedArea;
    }

    const createScene = () => {
        const babScene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, 0, 20, new BABYLON.Vector3(scene.size[0] / 2, 0, scene.size[1] / 2), babScene);
        camera.attachControl(canvas, true);

        const sun = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), babScene);
        //const sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(0, 20, 0), babScene);
        sun.shadowEnabled = true;
        sun.shadowMaxZ = 20;
        sun.shadowMinZ = 0;
        sun.intensity = 1;
        sun.position = new Vector3(0, 5, 0);

        const sky = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), babScene);
        sky.diffuse = new Color3(0, 0.3, 0.7);

        const shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
        shadowGenerator.enableSoftTransparentShadow = true;
        shadowGenerator.useBlurCloseExponentialShadowMap = true;

        //const box = BABYLON.MeshBuilder.CreateBox("box", {}, babScene);
        let offset = 0;
        Object.values(scene.layers).sort((l1, l2) => LAYER_TYPES.indexOf(l1.type) - LAYER_TYPES.indexOf(l2.type)).forEach(layer => {
            layer.areas?.sort((a, b) => (a.stretch ? 1 : 0) - (b.stretch ? 1 : 0)).forEach(area => {
                offset += 0.001;
                shadowGenerator.getShadowMap()?.renderList?.push(drawArea(area, babScene, offset));
            });
            layer.objects?.forEach(ob => {
                offset += 0.001;
                shadowGenerator.getShadowMap()?.renderList?.push(drawObject(ob, babScene, offset));
            });
        });

        //        BABYLON.MeshBuilder.CreateGround("ground", { width: scene.size[0], height: scene.size[1] });


        return babScene;
    }

    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    // Add your code here matching the playground format

    const babScene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        babScene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
}