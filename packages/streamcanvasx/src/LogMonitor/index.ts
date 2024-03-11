import DBManager from './service/dbservice';


class LogMonitor {
    dbManager: DBManager
    private _dbCreatedPromise: Promise<void> | null = null;
    private _dbCreated(): Promise<void> {
        if (!this._dbCreatedPromise) {
          this._dbCreatedPromise = new Promise((resolve) => {
            this._dbCreatedNotify = resolve;
          });
        }
        return this._dbCreatedPromise;
      }

      private _dbCreatedNotify: () => void;
    constructor() {
        this.dbManager = new DBManager("canvasStreamPlayer", 1);
        this.init();
    }

    async init() {
       await this.dbManager.createDB();
       this._dbCreatedNotify();
    }

    async log(data: {flvUrl: string;status?: string;message?: ""}) {
        await this._dbCreated();
        let time=new Date().getTime();
        let page=location.href;

        let logData=Object.assign({},data,{ time,page });
        this.dbManager.addData(logData);
    }
}

export default LogMonitor;