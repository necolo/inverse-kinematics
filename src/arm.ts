import { vec2, vec3 } from 'gl-matrix';

export class Arm {
    public id:number;
    public head:vec3;
    public tail:vec3 = vec3.create();
    public prev:Arm|null;
    public length:number;
    public color:vec3 = vec3.fromValues(1, 1, 1);
    public angle:number;
    public weight:number;

    constructor (id:number, spec:{
        prev?:Arm,
        len?:number,
        angle?:number,
        weight?:number,
    } = {}) {
        this.id = id;
        this.prev = spec.prev || null;
        this.head = this.prev && this.prev.tail || vec3.fromValues(0, 0, 0);
        this.length = spec.len || 1;
        this.angle = spec.angle || 0;
        this.weight = spec.weight || 1;
        this.calTail();
    }

    public calAngle (vector:vec3) {
        const nv = vec3.normalize(vec3.create(), vector);
        const baseVector = vec3.fromValues(1, 0, 0);
        this.angle = Math.sign(vec3.dot(nv, vec3.fromValues(0, 1, 0))) * vec3.angle(nv, baseVector);
    }

    public calTail () {
        vec3.set(
            this.tail,
            this.length * Math.cos(this.angle) + this.head[0],
            this.length * Math.sin(this.angle) + this.head[1],
            this.head[2],
        );
    }

    public follow (target:vec3) {
        const direction = vec3.sub(vec3.create(), target, this.head);
        this.calAngle(direction);

        setMag(direction, direction, this.length);
        vec3.mul(direction, direction, [-1, -1, 0]);
        vec3.add(
            this.head,
            target,
            direction,
        );
    }

    public getLine () {
        return [this.head, this.tail];
    }

    public update (target:vec3) {
        this.follow(target);
        this.calTail();
        this.prev && this.prev.update(this.head);
    }
}

function setMag (out:vec3, vec:vec3, len:number) {
    vec3.normalize(out, vec);
    vec3.set(
        out,
        out[0] * len,
        out[1] * len,
        out[2],
    );
}