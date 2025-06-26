import { defineExtensionMessaging } from '@webext-core/messaging';

export interface ExtensionProtocol {
  extractContentRequest(): void;
  contentExtracted(data: { title: string; url: string; content: string }): void;
}

export const messenger = defineExtensionMessaging<ExtensionProtocol>();
export const { onMessage, sendMessage } = messenger;
