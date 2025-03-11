import { Model } from './model';

export class PromptLibrary {
    private static models: Model[] = [];
    private static prompts: Map<string, Map<string, string>> = new Map();

    static initializeModels(models: Model[]): void {
        this.models = models;
        models.forEach(model => {
            if (!this.prompts.has(model.name)) {
                this.prompts.set(model.name, new Map());
            }
        });
    }

    static addPrompt(modelName: string, promptKey: string, promptValue: string): void {
        if (!this.prompts.has(modelName)) {
            this.prompts.set(modelName, new Map());
        }
        this.prompts.get(modelName)?.set(promptKey, promptValue);
    }

    static getPrompt(modelName: string, promptKey: string): string {
        return this.prompts.get(modelName)?.get(promptKey) || '';
    }

    static listModels(): Model[] {
        return [...this.models];
    }
}
