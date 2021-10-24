import { Shape } from "./ShapeGenerator";
import { add, invert, Point } from "./Vector";

export const ShapeDrawer = (context: CanvasRenderingContext2D, textures: Record<string, HTMLImageElement>, debug?: boolean) => {
    const shape = (shape: Shape) => {
        context.beginPath();
        context.moveTo(...shape.origin);
        shape.segments.forEach(segment => {
            if (segment.type === 'line') {
                context.lineTo(...segment.to);
            } else if (segment.type === 'quadratic') {
                const params: [number, number, number, number] = [...segment.control, ...segment.to];
                context.quadraticCurveTo(...params);
            }
        });
        context.closePath();



        const texture = textures[shape.appearance.texture];

        context.translate(...shape.origin);
        context.rotate(shape.appearance.rotate ?? 0);
        context.scale(shape.appearance.scale || 1, shape.appearance.scale || 1);

        if (shape.appearance.type === 'tiled') {
            context.fillStyle = context.createPattern(texture, 'repeat') || '#ccc';
            context.fill();
        }
        if (shape.appearance.type === 'single') {
            context.drawImage(texture, -texture.width / 2, -texture.height / 2);
            if (debug) {
                context.strokeStyle = '#00f';
                context.strokeRect(-texture.width / 2, -texture.height / 2, texture.width, texture.height);
            }
        }
        context.setTransform(new DOMMatrix());

        if (debug) {
            //debug outline
            context.beginPath();
            context.moveTo(...shape.origin);
            context.strokeStyle = '#00f';
            context.fillStyle = '#00f';
            context.arc(...shape.origin, 5, 0, 2 * Math.PI);
            context.font = 'bold 28px serif';
            context.fillText(JSON.stringify(shape.origin), ...add(shape.origin, [10, 10]));
            context.stroke();
            context.closePath();
        }

    }

    return {
        shape,
    };
}