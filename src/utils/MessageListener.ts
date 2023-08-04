// MessageBus.ts

type MessageListener = (data: any) => void;

const listeners: Record<string, MessageListener[]> = {};

export function sendMessage(event: string, data: any) {
  const eventListeners = listeners[event] || [];
  eventListeners.forEach((listener) => listener(data));
}

export function addMessageListener(event: string, listener: MessageListener) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(listener);
}

export function removeMessageListener(event: string, listener: MessageListener) {
  const eventListeners = listeners[event] || [];
  const index = eventListeners.indexOf(listener);
  if (index !== -1) {
    eventListeners.splice(index, 1);
  }
}
