import { useEffect, useRef } from 'react';

interface StoredData {
    // 定义存储数据的结构
    // 例如，如果存储 MQTT 消息
    topic: string;
    payload: string;
    timestamp: Date;
}


const useIndexedDB = (storeName: string) => {
    const dbRef = useRef<IDBDatabase | null>(null);

    useEffect(() => {
        const request = indexedDB.open('MqttDatabase', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        };

        request.onsuccess = (event: Event) => {
            dbRef.current = (event.target as IDBOpenDBRequest).result;
        };

        request.onerror = (event: Event) => {
            console.error('Database error: ', (event.target as IDBOpenDBRequest).errorCode);
        };
    }, [storeName]);

    const addToDB = (data: StoredData) => {
        if (dbRef.current) {
            const transaction = dbRef.current.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            store.add(data);
        }
    };

    // 可以添加其他数据库操作方法...

    return { addToDB };
};

export default useIndexedDB;
