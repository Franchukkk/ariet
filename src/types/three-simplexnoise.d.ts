declare module "three/examples/jsm/math/SimplexNoise" {
  export class SimplexNoise {
    constructor(random?: () => number);
    noise2d(x: number, y: number): number;
    noise3d(x: number, y: number, z: number): number;
    noise4d(x: number, y: number, z: number, w: number): number;
  }
}