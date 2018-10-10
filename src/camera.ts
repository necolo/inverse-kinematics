import { mat4, vec3 } from 'gl-matrix';
import { GLMouse } from 'gl-mouse';
import { unproject } from 'raycaster';

export class Camera {
    public projection:mat4;
    public mouse:GLMouse;
    public viewportWidth:number;
    public viewportHeight:number;

    constructor (regl) {
        this.projection = mat4.create();

        this.mouse = new GLMouse(regl._gl.canvas as HTMLCanvasElement, {
            eye: [0, 0, 8],
        });
        this.viewportWidth = 1;
        this.viewportHeight = 1;

        this.mouse.tick();
        this.projection = this.calProjection();
    }

    public calProjection () {
        const w = this.viewportWidth;
        const h = this.viewportHeight;

        return mat4.perspective(
            this.projection,
            Math.PI / 4,
            w / h,
            0.1,
            100
        );
    }

    public get eye () {
        return this.mouse.eye;
    }

    public get view () {
        return this.mouse.view;
    }
    
    public screenToRay (sx:number, sy:number) {
        const invProjection = mat4.create();
        const invView = mat4.create();
        mat4.invert(invProjection, this.projection);
        mat4.invert(invView, this.view);

        return unproject(
            [sx, sy],
            [0, 0, innerWidth, innerHeight],
            invProjection,
            invView,
        );
    }

    public tick () {
        this.mouse.tick();
        this.projection = this.calProjection();
    }
}