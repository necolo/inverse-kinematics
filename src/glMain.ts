import { mat4, vec3 } from 'gl-matrix';
import glLine from './glLine';
import glPoint from './glPoint';
import glPlane from './glPlane';
import { State } from './state';

export = function (regl) {
    const drawLine = glLine(regl);
    const drawPoint = glPoint(regl);
    const drawPlane = glPlane(regl);

    let target = vec3.create();
    let targetIsSet = false;

    (window as any).setTarget = (_target:vec3|null) => {
        if (!_target) {
            targetIsSet = false;
            return;
        }
        target = _target;
        targetIsSet = true;
    }


    const setup = regl({
        uniforms: {
            view: regl.prop('camera.mouse.view'),
            projection: regl.prop('camera.projection'),
        },
    });

    return function (state:State) {
        state.camera.tick();
        setup(state, () => {
            const arms = state.arms;
            drawPlane();

            if (state.hit.isHit) {
                drawPoint(state.hit.position, undefined, vec3.fromValues(0, 1, 1));
                state.update();
            }

            for (let i = 0; i < arms.length; i ++) {
                const arm = arms[i];
                drawLine(arm.getLine(), arm.color);
                // drawPoint(arm.head);
                // drawPoint(arm.tail);
            }
        });
    }
}