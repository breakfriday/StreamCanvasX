interface ICar {
    startEngine: () => void;
    accelerate: (parms: {speed: number}) => void;
    stopEngine: () => void;
    getSpeed: () => number;
  }

  type AccelerateParams = Parameters<ICar['accelerate']>[0];

  class Car implements ICar {
    private currentSpeed: number;

    constructor() {
      this.currentSpeed = 0;
    }

    startEngine(): void {
      console.log('Engine started');
    }

    accelerate(params: AccelerateParams): void {
       let h = params.speed;
        params[0].speed;
    }

    stopEngine(): void {
      console.log('Engine stopped');
    }

    getSpeed(): number {
      return this.currentSpeed;
    }
  }

  const myCar = new Car();
  myCar.startEngine();
  myCar.accelerate({ speed: 21 });
  myCar.stopEngine();
