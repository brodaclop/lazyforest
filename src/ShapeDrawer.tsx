import { Scene, SceneArea, SceneObject } from "./Shape";
import { Texture } from "./Textures";
import { Point, stretch } from "./Vector";

export const ShapeDrawer = (context: CanvasRenderingContext2D, textures: Record<string, Texture>, debug?: boolean) => {

    const debugPoint = (point: Point, style: string = '#00f') => {
        context.beginPath();
        context.moveTo(...point);
        context.strokeStyle = style;
        context.fillStyle = style;
        context.arc(...point, 2, 0, 2 * Math.PI);
        context.fill();
        context.font = 'bold 28px serif';
        //        context.fillText(JSON.stringify(point), ...add(point, [10, 10]));
        context.stroke();
        context.closePath();

    }

    const sceneArea = (shape: SceneArea) => {
        clearShadow();
        const texture = textures[shape.texture.name];
        const scale = texture.scale * (shape.texture.scale || 1);

        context.beginPath();
        context.moveTo(...shape.vertices[0]);
        shape.vertices.slice(1).forEach(vertex => {
            context.lineTo(...vertex);
        });
        context.closePath();

        context.rotate(shape.texture.rotate ?? 0);
        context.scale(scale, scale);

        context.shadowColor = '';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = context.createPattern(texture.loadedImage, 'repeat') || '#ccc';
        context.fill();

        if (debug) {
            context.strokeStyle = 'rgba(255, 255, 0, 1)';
            context.lineWidth = 3;
            context.stroke();
        }
        context.setTransform(new DOMMatrix());
    }

    const sceneObject = (shape: SceneObject, shadowDirection: Point) => {
        clearShadow();
        const texture = textures[shape.texture.name];
        const scale = texture.scale * (shape.texture.scale || 1);

        context.moveTo(...shape.origin);

        context.translate(...shape.origin);
        context.rotate((shape.texture.rotate ?? 0) + shape.orientation);
        context.scale(scale, scale);

        const shadowVector = stretch(shadowDirection, shape.height ?? 0);
        context.shadowColor = 'rgba(30, 30, 30, .9)';
        context.shadowOffsetX = shadowVector[0];
        context.shadowOffsetY = shadowVector[1];
        context.shadowBlur = 2;

        context.drawImage(texture.loadedImage, -texture.loadedImage.width / 2, -texture.loadedImage.height / 2);

        if (debug) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.fillStyle = 'rgba(0, 0, 255, .2)';
            context.fillRect(-texture.loadedImage.width / 2, -texture.loadedImage.height / 2, texture.loadedImage.width, texture.loadedImage.height);
        }
        context.setTransform(new DOMMatrix());
        if (debug) {
            debugPoint(shape.origin);
            context.fillStyle = 'rgba(255, 0, 0, .2)';
            context.arc(...shape.origin, shape.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    const clearShadow = () => {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = '';
        context.shadowBlur = 0;
    }

    const scene = (scene: Scene, debug: boolean = false) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        Object.values(scene.layers).forEach(layer => {
            layer.areas?.forEach(sceneArea);
            layer.objects?.forEach(ob => sceneObject(ob, scene.shadowVector));
        });
        if (scene.tint && scene.tint !== 'none') {
            clearShadow();
            context.fillStyle = scene.tint;
            context.setTransform(new DOMMatrix());
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }

    return {
        sceneArea,
        sceneObject,
        scene
    };
}