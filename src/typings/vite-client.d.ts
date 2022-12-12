// web worker
declare module "*?worker" {
  class workerConstructor extends Worker {
    constructor();
  }
  export default workerConstructor;
}

declare module "*?worker&inline" {
  class workerConstructor extends Worker {
    constructor();
  }
  export default workerConstructor;
}

declare module "*?sharedworker" {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}

declare module "*?raw" {
  const src: string;
  export default src;
}

declare module "*?url" {
  const src: string;
  export default src;
}

declare module "*?inline" {
  const src: string;
  export default src;
}
