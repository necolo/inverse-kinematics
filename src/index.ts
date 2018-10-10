import glMain from './glMain';
import glPoint  from './glPoint';
import { State } from './state';
import { vec3 } from 'gl-matrix';

(() => {
    const regl = require('regl')();
    const drawMain = glMain(regl);
    const drawPoint = glPoint(regl);

    const state = new State(regl);

    regl.frame(({tick}) => {
        regl.clear({
            color: [0, 0, 0, 1],
        });
        drawMain(state);
    })
})()