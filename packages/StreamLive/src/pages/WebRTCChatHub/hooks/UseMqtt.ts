import { useState, useEffect, useRef } from 'react';
// import * as mqtt from 'mqtt/dist/mqtt.min';
// import mqtt from 'mqtt/dist/mqtt.esm';
import mqtt, { MqttClient, IClientPublishOptions, IClientSubscribeOptions } from 'mqtt';


interface ICallMessage {
    room_id: string | null; // 房间名称
    initator: string | null; // 发起者device_id
    user_id: Array<string | number> | null; // 被邀请者device_id
    cmd?: string;
    whep?: Array<{url: string; user: string}>;
  }

interface Message<T> {
    topic: string;
    payload: T;
}

interface MqttHookResponse {
    isConnected: boolean;
    error: Error | null;
    messageHistory: Message[];
    sendMessage: (topic: string, message: string, options?: IClientPublishOptions) => void;
    subscribe: (topic: string, options?: IClientSubscribeOptions, callback?: (msg: Message<ICallMessage>) => void) => void;
    unsubscribe: (topic: string) => void;
}

function useMqtt(brokerUrl: string): MqttHookResponse {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messageHistory, setMessageHistory] = useState<Message<ICallMessage>[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(new Set());
    const clientRef = useRef<MqttClient | null>(null);
    const callbacksRef = useRef<Map<string, (msg: Message<ICallMessage>) => void>>(new Map()); // 维护一个函数池，存储不同 topic 对应的回调函数。


    useEffect(() => {
        const options = {

            clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
            username: 'root',
            password: 'root',
            // port: 8083,

          };

        //   alert(JSON.stringify(options));


        const mqttClient = mqtt.connect(brokerUrl, options);


        mqttClient.on('connect', () => {
            setIsConnected(true);
        });

        mqttClient.on('error', (err) => {
            setError(err);
        });

        mqttClient.on('message', (topic, payload, packet) => {
        //   console.log('--------------------------');
        //   console.log(`${payload.toString()}    ${new Date()}`);
        //   console.log('--------------------------');
            const message: Message<ICallMessage> = {
                topic,
                payload: JSON.parse(payload.toString()),
                cmd: packet.cmd,
            };

            const callback = callbacksRef.current.get(topic);
            if (callback) {
                callback(message);
            }


            setMessageHistory((prev) => [...prev, message]);
        });

        clientRef.current = mqttClient;

        // setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, [brokerUrl]);

    const subscribe = (topic: string, options?: IClientSubscribeOptions, callback?: (msg: Message) => void) => {
        if (subscribedTopics.has(topic)) {
            return false; // 判斷禁止重複訂閲
        }

        let client = clientRef.current;


        if (client) {
            client.subscribe(topic, options, (err) => {
                if (err) {
                    alert('error');
                }
                if (callback) {
                    callbacksRef.current.set(topic, callback);
                }
            });


            // 優雅
            setSubscribedTopics(new Set([...subscribedTopics, topic]));
        }
    };

    const unsubscribe = (topic: string) => {
        let client = clientRef.current;
        if (client) {
            client.unsubscribe(topic, (err) => {
                if (err) setError(err);
            });
        }
    };

    const sendMessage = (topic: string, message: string, options?: IClientPublishOptions) => {
        let client = clientRef.current;
        if (client && isConnected) {
            client.publish(topic, message, options, (err) => {
                if (err) {
                    alert(`${error}onmessage`);
                }
            });
        }
    };

    return {
        isConnected,
        error,
        messageHistory,
        sendMessage,
        subscribe,
        unsubscribe,
    };
}

export default useMqtt;
