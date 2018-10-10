import { vec3 } from 'gl-matrix';
import glLine from './glLine';

const DEFAULT_COLOR = vec3.fromValues(0.3, 0.3, 0.3);

export = function (regl) {
    const drawLine = glLine(regl);

    const size = 10;
    const height = -1;

    return function (color?:vec3) {
        for (let i = -size; i < size; i ++) {
            drawLine([
                vec3.fromValues(-size, height, i),
                vec3.fromValues(size, height, i),
            ], DEFAULT_COLOR);

            drawLine([
                vec3.fromValues(i, height, -size),
                vec3.fromValues(i, height, size),
            ], DEFAULT_COLOR);
        }
    } 
}