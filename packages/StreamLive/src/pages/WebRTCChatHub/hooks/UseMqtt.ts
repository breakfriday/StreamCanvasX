import { useState, useEffect, useRef } from 'react';
// import * as mqtt from 'mqtt/dist/mqtt.min';
// import mqtt from 'mqtt/dist/mqtt.esm';
import mqtt, { MqttClient, IClientPublishOptions, IClientSubscribeOptions } from 'mqtt';


interface Message {
    topic: string;
    payload: string;
}

interface MqttHookResponse {
    isConnected: boolean;
    error: Error | null;
    messageHistory: Message[];
    sendMessage: (topic: string, message: string, options?: IClientPublishOptions) => void;
    subscribe: (topic: string, options?: IClientSubscribeOptions, callback?: (msg: Message) => void) => void;
    unsubscribe: (topic: string) => void;
}

function useMqtt(brokerUrl: string): MqttHookResponse {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(new Set());
    const clientRef = useRef<MqttClient | null>(null);
    const callbacksRef = useRef<Map<string, (msg: Message) => void>>(new Map()); // 维护一个函数池，存储不同 topic 对应的回调函数。


    useEffect(() => {
        const options = {

            clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
            username: 'root',
            password: 'root',
            port: 8883,

          };

          alert(JSON.stringify(options));


        const mqttClient = mqtt.connect(brokerUrl, options);


        mqttClient.on('connect', () => {
            debugger;
            setIsConnected(true);
        });

        mqttClient.on('error', (err) => {
            debugger;
            setError(err);
        });

        mqttClient.on('message', (topic, payload, packet) => {
        //   console.log('--------------------------');
        //   console.log(`${payload.toString()}    ${new Date()}`);
        //   console.log('--------------------------');
            const message: Message = {
                topic,
                payload: JSON.parse(payload.toString()),
                cmd: packet.cmd,
            };

            const callback = callbacksRef.current.get(topic);
            if (callback) {
                callback(message);
            }

            debugger;

            setMessageHistory((prev) => [...prev, message]);
        });

        clientRef.current = mqttClient;

        // setClient(mqttClient);

        return () => {
            debugger;
            mqttClient.end();
        };
    }, [brokerUrl]);

    const subscribe = (topic: string, options?: IClientSubscribeOptions, callback?: (msg: Message) => void) => {
        if (subscribedTopics.has(topic)) {
            return false; // 判斷禁止重複訂閲
        }

        let client = clientRef.current;


        if (client) {
            debugger;
            client.subscribe(topic, options, (err) => {
                if (err) {
                    debugger;
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
