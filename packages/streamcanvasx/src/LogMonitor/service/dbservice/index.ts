class DbService {

    private dbName: string;
    private dbVersion: number;
    private db: IDBDatabase | null = null;
  
    constructor(dbName: string, dbVersion: number) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    public createDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBRequest).result as IDBDatabase;
                db.createObjectStore("data", { keyPath: "id", autoIncrement: true });
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBRequest).result as IDBDatabase;
                // create/open database success
                resolve();
            };

            request.onerror = () => {
                reject(new Error("Failed to create/open database 数据库打开报错"));
            };
        });
    }


    public connectDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve();
            } else {
                const request = indexedDB.open(this.dbName, this.dbVersion);
                request.onsuccess = (event) => {
                    this.db = (event.target as IDBRequest).result as IDBDatabase;
                    resolve();
                };

                request.onerror = () => {
                    reject(new Error("Failed to connect to database"));
                };
            }
        });
    }


    public createObjectStore(storeName: string, options?: IDBObjectStoreParameters): void {
        if (!this.db) {
            throw new Error("Database is not connected");
        }

        this.db.createObjectStore(storeName, options);
    }

  
   
  }
  