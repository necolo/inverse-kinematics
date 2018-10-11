import { Arm } from './arm';
import { vec3, vec2, mat4 } from 'gl-matrix';
import { Camera } from './camera';
import { Hit } from './hit';

export class State {
    public arms:Arm[] = [];
    public camera:Camera;
    public hit:Hit;

    constructor (regl) {
        this.camera = new Camera(regl);
        this.hit = new Hit(regl._gl.canvas, this.camera);

        const armCount = 3;
        const armLength = 0.5;
        const startPoint = vec3.fromValues(0, 0, 0);

        this.arms.push(new Arm(0, {
            len: armLength,
        }));

        for (let i = 1; i < armCount; i ++) {
            this.arms.push(new Arm( i, {
                len: armLength,
                prev: this.arms[i - 1],
                weight: 1 - 0.1 * i,
            }));
        }

        this.arms[0].color = vec3.fromValues(1, 0, 0);
    }

    public getLastArm () {
        return this.arms[this.arms.length - 1];
    }

    public update () {
        this.getLastArm().update(this.hit.position);
        
        this.arms[0].head = vec3.fromValues(0, 0, 0);
        this.arms[0].calTail();

        for (let i = 1; i < this.arms.length; i ++) {
            const arm = this.arms[i];
            arm.head = this.arms[i - 1].tail;
            arm.calTail();
        }
    }
}

function radians (_angle:number) {
    return _angle / 360 * Math.PI;
}

function angle (_rad:number) {
    return _rad / Math.PI * 360;
}

function forTest (state:State) {
    Object.assign((window as any), {
        vec3,
        vec2,
        mat4,
        state,
    });;
}