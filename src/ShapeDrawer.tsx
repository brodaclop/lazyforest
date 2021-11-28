import { LAYER_TYPES, Scene, SceneArea, SceneObject } from "./Scene";
import { Texture } from "./Textures";
import { add, lineLength, lineNormal, normalize, Point, stretch, subtract } from "./Vector";
export const drawScene = (context: CanvasRenderingContext2D, textures: Record<string, Texture>, scene: Scene, debug?: boolean) => {

    const globalScale: Point = [context.canvas.width / scene.size[0], context.canvas.height / scene.size[1]];

    const borderArea = (area: SceneArea): Array<Point> => {
        const ret: Array<Point> = [];
        for (let i = 0; i < area.vertices.length; i++) {
            const p0 = area.vertices[(i + area.vertices.length - 1) % area.vertices.length];
            const p1 = area.vertices[i];
            const p2 = area.vertices[(i + 1) % area.vertices.length];
            const normal1 = lineNormal(p1, p2);
            const normal2 = lineNormal(p0, p1);
            const normal = normalize(add(normal1, normal2));
            ret.push(add(p1, stretch(normal, area.edge?.width[0] ?? 0)));
        }
        for (let i = area.vertices.length - 1; i >= 0; i--) {
            const p0 = area.vertices[(i + area.vertices.length - 1) % area.vertices.length];
            const p1 = area.vertices[i];
            const p2 = area.vertices[(i + 1) % area.vertices.length];
            const normal1 = lineNormal(p1, p2);
            const normal2 = lineNormal(p0, p1);
            const normal = normalize(add(normal1, normal2));
            ret.push(add(p1, stretch(normal, area.edge?.width[1] ?? 0)));
        }
        ret.splice(area.vertices.length, 0, ret[0], ret[ret.length - 1]);
        return ret;
    }

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

    const drawPath = (vertices: Array<Point>): void => {
        context.beginPath();
        context.moveTo(...vertices[0]);
        vertices.slice(1).forEach(vertex => {
            context.lineTo(...vertex);
        });
        context.closePath();
    }

    const sceneArea = (shape: SceneArea) => {
        reset();

        const texture = textures[shape.texture];

        drawPath(shape.vertices);


        //edge shade
        context.shadowColor = 'rgba(30, 30, 30, .5)';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = scene.edgeShade ?? 0;

        if (shape.stretch) {
            context.translate(...shape.vertices[0]);

            const vector: Point = subtract(shape.vertices[1], shape.vertices[0]);

            const stretchWidth = lineLength(vector);
            const stretchHeight = lineLength(subtract(shape.vertices[2], shape.vertices[1]));

            const angle = Math.atan2(vector[1], vector[0]);
            context.rotate(angle);

            const imageScale: Point = [texture.scale / texture.loadedImage.width, texture.scale / texture.loadedImage.height];
            //const imageScale: Point = [textureScale / Math.max(texture.loadedImage.width, texture.loadedImage.height), textureScale / Math.max(texture.loadedImage.width, texture.loadedImage.height)];
            context.scale(...imageScale);
            context.scale(stretchWidth, stretchHeight);
            context.scale(1.2, 1.2)
            context.drawImage(texture.loadedImage, - texture.loadedImage.width / 10, - texture.loadedImage.height / 10);
        } else {
            const imageScale: Point = [texture.scale / texture.loadedImage.width, texture.scale / texture.loadedImage.height];
            context.save();
            context.scale(...imageScale);

            context.fillStyle = context.createPattern(texture.loadedImage, 'repeat') || '#c0c';
            context.fill();
            context.restore();

            if (shape.edge) {
                const edgeTexture = textures[shape.edge.texture];
                const edgeScale: Point = [edgeTexture.scale / edgeTexture.loadedImage.width, edgeTexture.scale / edgeTexture.loadedImage.height];
                drawPath(borderArea(shape));
                context.scale(...edgeScale);
                context.fillStyle = context.createPattern(edgeTexture.loadedImage, 'repeat') || '#c0c';
                context.fill();
            }


        }


        if (debug) {
            context.strokeStyle = 'rgba(255, 255, 0, 1)';
            context.lineWidth = 20;
            context.stroke();
        }
    }

    const sceneObject = (shape: SceneObject, shadowDirection: Point) => {
        reset();
        const texture = textures[shape.texture];

        context.moveTo(...shape.origin);

        context.translate(...shape.origin);

        const imageScale: Point = [texture.scale / texture.loadedImage.naturalWidth, texture.scale / texture.loadedImage.naturalHeight];

        context.scale(...imageScale);
        context.rotate(shape.orientation);

        //TODO: debug why this fucks up everything
        // context.fillStyle = '#cfc';
        // context.fill();

        const shadowVector = stretch(shadowDirection, shape.height ?? 0);
        context.shadowColor = 'rgba(30, 30, 30, .8)';
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
            context.fillStyle = 'rgba(255, 0, 0, .5)';
            context.fill();
        }
    }


    const drawScene = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        Object.values(scene.layers).sort((l1, l2) => LAYER_TYPES.indexOf(l1.type) - LAYER_TYPES.indexOf(l2.type)).forEach(layer => {
            layer.areas?.sort((a, b) => (a.stretch ? 1 : 0) - (b.stretch ? 1 : 0)).forEach(sceneArea);
            layer.objects?.sort((a, b) => a.height - b.height).forEach(ob => sceneObject(ob, scene.shadowVector));
        });
        if (scene.tint && scene.tint !== 'none') {
            reset();
            context.fillStyle = scene.tint;
            context.setTransform(new DOMMatrix());
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
        reset();
        context.setTransform(new DOMMatrix());
        if (scene.grid) {
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
    }

    drawScene();
}