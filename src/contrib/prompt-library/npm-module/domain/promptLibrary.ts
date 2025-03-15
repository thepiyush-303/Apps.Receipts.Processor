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

    /**
     * Fills a prompt template with provided values
     * @param modelName - The name of the model
     * @param promptKey - The key of the prompt template
     * @param replacements - An object containing key-value pairs for replacements
     * @returns The filled prompt with all placeholders replaced with their values
     */
    static fillPromptTemplate(
        modelName: string,
        promptKey: string,
        replacements: Record<string, string>
    ): string {
        const template = this.getPrompt(modelName, promptKey);
        if (!template) {
            return '';
        }

        let filledPrompt = template;
        Object.entries(replacements).forEach(([key, value]) => {
            const bracketPattern = new RegExp(`\\{${key}\\}`, 'g');
            filledPrompt = filledPrompt.replace(bracketPattern, value)
        });

        return filledPrompt;
    }
}