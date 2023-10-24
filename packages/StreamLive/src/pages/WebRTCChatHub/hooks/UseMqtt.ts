import { useState, useEffect } from 'react';
import * as mqtt from 'mqtt/dist/mqtt.min';


import { Client, IClientPublishOptions, IClientSubscribeOptions } from 'mqtt';

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
    const [client, setClient] = useState<Client | null>(null);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const mqttClient = mqtt.connect(brokerUrl);

        mqttClient.on('connect', () => {
            setIsConnected(true);
        });

        mqttClient.on('error', (err) => {
            setError(err);
        });

        mqttClient.on('message', (topic, payload) => {
            const message: Message = {
                topic,
                payload: payload.toString(),
            };
            setMessageHistory((prev) => [...prev, message]);
        });

        setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, [brokerUrl]);

    const subscribe = (topic: string, options?: IClientSubscribeOptions) => {
        if (client) {
            client.subscribe(topic, options, (err) => {
                if (err) setError(err);
            });
        }
    };

    const unsubscribe = (topic: string) => {
        if (client) {
            client.unsubscribe(topic, (err) => {
                if (err) setError(err);
            });
        }
    };

    const sendMessage = (topic: string, message: string, options?: IClientPublishOptions) => {
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
