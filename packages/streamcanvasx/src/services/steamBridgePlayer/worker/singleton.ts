class Singleton {
    private static instance: Singleton | null = null;
    constructor() {

    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    p1(event: MessageEvent<any>) {
        console.log('Received in worker:', event.data);
        let count = 0;
        for (let i = 0; i < event.data; i++) {
            count += i;
        }
        debugger;
    }
    updateData(event: MessageEvent<any>) {
        this.p1(event);
    }
}


export default Singleton;