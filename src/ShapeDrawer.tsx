import { Scene, SceneArea, SceneObject } from "./Scene";
import { Texture } from "./Textures";
import { lineLength, Point, stretch, subtract } from "./Vector";

export const drawScene = (context: CanvasRenderingContext2D, textures: Record<string, Texture>, scene: Scene, debug?: boolean) => {

    const globalScale: Point = [context.canvas.width / scene.size[0], context.canvas.height / scene.size[1]];

    const reset = () => {
        context.setTransform(new DOMMatrix());
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = '';
        context.shadowBlur = 0;
        context.fillStyle = '';
        context.strokeStyle = '';
        context.scale(...globalScale);
    }

    const debugPoint = (point: Point, style: string = '#0ff') => {
        reset();
        context.beginPath();
        context.moveTo(...point);
        context.strokeStyle = style;
        context.fillStyle = style;
        context.arc(...point, 2 / globalScale[0], 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }


    const sceneArea = (shape: SceneArea) => {
        reset();

        const texture = textures[shape.texture.name];

        context.beginPath();
        context.moveTo(...shape.vertices[0]);
        shape.vertices.slice(1).forEach(vertex => {
            context.lineTo(...vertex);
        });
        context.closePath();



        //edge shade
        context.shadowColor = 'rgba(30, 30, 30, .9)';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = scene.edgeShade ?? 0;

        context.rotate(shape.texture.rotate ?? 0);
        const textureScale = texture.scale * (shape.texture.scale || 1);

        if (shape.stretch) {
            context.translate(...shape.vertices[0]);

            const vector: Point = subtract(shape.vertices[1], shape.vertices[0]);

            const stretchWidth = lineLength(vector);
            const stretchHeight = lineLength(subtract(shape.vertices[2], shape.vertices[1]));

            const angle = Math.atan2(vector[1], vector[0]);
            context.rotate(angle);

            const imageScale: Point = [textureScale / texture.loadedImage.width, textureScale / texture.loadedImage.height];
            //const imageScale: Point = [textureScale / Math.max(texture.loadedImage.width, texture.loadedImage.height), textureScale / Math.max(texture.loadedImage.width, texture.loadedImage.height)];
            context.scale(...imageScale);
            context.scale(stretchWidth, stretchHeight);
            context.scale(1.2, 1.2)
            context.drawImage(texture.loadedImage, - texture.loadedImage.width / 10, - texture.loadedImage.height / 10);
        } else {
            const imageScale: Point = [textureScale / texture.loadedImage.width, textureScale / texture.loadedImage.height];
            context.scale(...imageScale);

            context.fillStyle = context.createPattern(texture.loadedImage, 'repeat') || '#c0c';
            context.fill();
        }


        if (debug) {
            context.strokeStyle = 'rgba(255, 255, 0, 1)';
            context.lineWidth = 20;
            context.stroke();
        }
    }

    const sceneObject = (shape: SceneObject, shadowDirection: Point) => {
        reset();
        const texture = textures[shape.texture.name];
        const textureScale = texture.scale * (shape.texture.scale || 1);

        context.moveTo(...shape.origin);

        context.translate(...shape.origin);
        context.rotate((shape.texture.rotate ?? 0) + shape.orientation);

        const imageScale: Point = [textureScale / texture.loadedImage.naturalWidth, textureScale / texture.loadedImage.naturalHeight];

        context.scale(...imageScale);

        //TODO: debug why this fucks up everything
        // context.fillStyle = '#cfc';
        // context.fill();

        const shadowVector = stretch(shadowDirection, shape.height ?? 0);
        context.shadowColor = 'rgba(30, 30, 30, .9)';
        context.shadowOffsetX = shadowVector[0];
        context.shadowOffsetY = shadowVector[1];
        context.shadowBlur = 2;

        context.drawImage(texture.loadedImage, -texture.loadedImage.naturalWidth / 2, -texture.loadedImage.naturalHeight / 2);

        if (debug) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            // fix this
            // context.fillStyle = 'rgba(0, 0, 255, .2)';
            // context.fillRect(-1 / 2, -1 / 2, 1, 1);
            debugPoint(shape.origin);
            context.arc(...shape.origin, shape.radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 0, 0, .2)';
            context.fill();
        }
    }


    const drawScene = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        console.log(scene);
        Object.values(scene.layers).forEach(layer => {
            layer.areas?.sort((a, b) => (a.stretch ? 1 : 0) - (b.stretch ? 1 : 0)).forEach(sceneArea);
            layer.objects?.forEach(ob => sceneObject(ob, scene.shadowVector));
        });
        if (scene.tint && scene.tint !== 'none') {
            reset();
            context.fillStyle = scene.tint;
            context.setTransform(new DOMMatrix());
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
        reset();
        context.setTransform(new DOMMatrix());
        context.beginPath();
        for (let x = 0; x < scene.size[0]; x++) {
            context.moveTo(globalScale[0] * x, 0);
            context.lineTo(globalScale[0] * x, context.canvas.height);
        }
        for (let y = 0; y < scene.size[1]; y++) {
            context.moveTo(0, y * globalScale[1]);
            context.lineTo(context.canvas.width, y * globalScale[1]);
        }
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.stroke();
    }

    drawScene();
}