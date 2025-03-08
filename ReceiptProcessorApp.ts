import {
    IAppAccessors,
    ILogger,
    IRead,
    IConfigurationExtend,
    IHttp,
    IModify,
    IPersistence
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IMessage, IPostMessageSent } from "@rocket.chat/apps-engine/definition/messages";
import { isImageAttachment } from "./src/lib/imageProcessing"
import { settings } from './src/config/settings';
import { processImage } from "./src/lib/imageProcessing";
import { sendMessage } from "./src/utils/message";
import { SCAN_RECEIPT_PROMPT } from './src/const/prompt';

export class ReceiptProcessorApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        await Promise.all([
            ...settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            ),
        ]);
    }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        this.getLogger().info("Execute post message sent");

        const appUser = await this.getAccessors().reader.getUserReader().getAppUser(this.getID());
        const response = await processImage(http, message, read, SCAN_RECEIPT_PROMPT);

        if (appUser) {
            sendMessage(modify, appUser, message.room, response);
        } else {
            this.getLogger().warn("App user not found. Message not sent.");
        }
    }

    public async checkPostMessageSent(message: IMessage): Promise<boolean> {
        this.getLogger().info("Message Attachments:", message.attachments);
        return message.attachments?.some(isImageAttachment) ?? false;
    }
}
