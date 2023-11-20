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
    subscribe: (topic: string, options?: IClientSubscribeOptions) => void;
    unsubscribe: (topic: string) => void;
}

function useMqtt(brokerUrl: string): MqttHookResponse {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(new Set());
    const clientRef = useRef<MqttClient | null>(null);


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
            setIsConnected(true);
        });

        mqttClient.on('error', (err) => {
            setError(err);
        });

        mqttClient.on('message', (topic, payload) => {
            debugger;
            const message: Message = {
                topic,
                payload: payload.toString(),
            };
            debugger;
            setMessageHistory((prev) => [...prev, message]);
        });

        clientRef.current = mqttClient;

        // setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, [brokerUrl]);

    const subscribe = (topic: string, options?: IClientSubscribeOptions) => {
        if (subscribedTopics.has(topic)) {
            return false; // 判斷禁止重複訂閲
        }

        let client = clientRef.current;


        if (client) {
            client.subscribe(topic, options, (err) => {
                if (err) setError(err);
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
                if (err) setError(err);
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
