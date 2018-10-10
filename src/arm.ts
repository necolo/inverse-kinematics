import { vec2, vec3 } from 'gl-matrix';

export class Arm {
    public id:number;
    public head:vec3;
    public tail:vec3 = vec3.create();
    public prev:Arm|null;
    public next:Arm|null = null;
    public length:number;
    public color:vec3 = vec3.fromValues(1, 1, 1);
    public angle:number;

    constructor (id:number, prev:Arm|null, len = 1, angle = 0) {
        this.id = id;
        this.prev = prev;
        this.head = this.prev && this.prev.tail || vec3.fromValues(0, 0, 0);
        this.length = len;
        this.angle = angle;
        this.calTail();
        (window as any).vec3 = vec3;
        (window as any).vec2 = vec2;
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

        /* codes from some paper
        const a = vec3.fromValues(0, 0, 1);
        const b = vec3.sub(vec3.create(), this.tail, this.head);
        vec3.normalize(b, b);

        const r = vec3.cross(vec3.create(), a, b);
        const f = vec3.sub(vec3.create(), target, this.tail);
        vec3.normalize(f, f);

        const magf = vec3.dist(target, this.tail);
        const sinaf = Math.sin(vec3.angle(a, f));
        const cosrf = Math.cos(vec3.angle(r, f));
        const sens = 0.001;
        const torque = magf * sinaf * Math.sign(cosrf) * sens;

        const angle = vec3.angle(b, [1, 0, 0]);

        if (this.prev) {
            this.prev.update(target);
        }

        if (vec3.dot(b, f) >= 0.98) { return; }

        const theta = angle + torque;
        this.tail = vec3.fromValues(
            this.length * Math.cos(theta),
            this.length * Math.sin(theta),
            0
        );
        vec3.add(this.tail, this.tail, this.head);

        if (this.next) {
            this.next.head = this.tail;
        }
        */
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