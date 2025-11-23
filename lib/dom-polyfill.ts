if (typeof globalThis !== "undefined") {
  if (!globalThis.DOMMatrix) {
    globalThis.DOMMatrix = class DOMMatrix {
      constructor() {}
    } as any;
  }

  if (!globalThis.ImageData) {
    globalThis.ImageData = class ImageData {
      constructor(
        public data: Uint8ClampedArray,
        public width: number,
        public height: number
      ) {}
    } as any;
  }

  if (!globalThis.Path2D) {
    globalThis.Path2D = class Path2D {
      constructor() {}
    } as any;
  }

  if (!globalThis.CanvasRenderingContext2D) {
    globalThis.CanvasRenderingContext2D = class CanvasRenderingContext2D {
      constructor() {}
    } as any;
  }

  if (!globalThis.HTMLCanvasElement) {
    globalThis.HTMLCanvasElement = class HTMLCanvasElement {
      constructor() {}
    } as any;
  }
}
