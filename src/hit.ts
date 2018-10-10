import { vec3 } from 'gl-matrix';
import { Camera } from './camera';
import { rayIntersectsTriangle } from 'raycaster';

const L = 5;
const P1 = vec3.fromValues(-L, L, 0);
const P2 = vec3.fromValues(L, L, 0);
const P3 = vec3.fromValues(-L, -L, 0);
const P4 = vec3.fromValues(L, -L, 0);

export class Hit {
    private _camera:Camera;
    public position = vec3.create();
    public isHit = false;

    constructor (canvas:HTMLCanvasElement, camera:Camera) {
        this._camera = camera;
        canvas.addEventListener('mousemove', this._handleMouseMove);
        canvas.addEventListener('mousedown', () => canvas.removeEventListener('mousemove', this._handleMouseMove));
        canvas.addEventListener('mouseup', () => canvas.addEventListener('mousemove', this._handleMouseMove));
    }

    private _handleMouseMove = (ev:MouseEvent) => {
        ev.preventDefault();

        const x = ev.clientX / window.innerWidth;
        const y = ev.clientY  / window.innerHeight;

        const ray = this._camera.screenToRay(ev.clientX, ev.clientY);

        this.isHit = this.rayIntersectsPlane(
            this._camera.eye,
            ray,
            this.position,
        );
    }

    public rayIntersectsPlane (rayOrigin:vec3, rayVector:vec3, out?:vec3) {
        return rayIntersectsTriangle(
            rayOrigin,
            rayVector,
            [P1, P3, P2],
            out,
        ) || rayIntersectsTriangle (
            rayOrigin,
            rayVector,
            [P2, P3, P4],
            out,
        )
    }
}