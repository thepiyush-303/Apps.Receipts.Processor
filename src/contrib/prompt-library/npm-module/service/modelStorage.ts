import { PromptLibrary } from "../domain/promptLibrary"
import { Model } from "../domain/model"
import { IModelStorage } from "../index"

export class ModelStorage implements IModelStorage {
    private globalTemplates: Record<string, string> = {};

    public initialize(
        templates: Record<string, string>,
        models?: Array<{
            name: string,
            parameters: string,
            quantization: string,
            prompts?: string[]
        }>
    ): void {
        this.globalTemplates = templates;

        if (models?.length) {
            const modelObjects = models.map(model =>
                new Model(model.name, model.parameters, model.quantization)
            );

            PromptLibrary.initializeModels(modelObjects);

            models.forEach(model => {
                model.prompts?.forEach(promptKey => {
                    if (this.globalTemplates[promptKey]) {
                        PromptLibrary.addPrompt(
                            model.name,
                            promptKey,
                            this.globalTemplates[promptKey]
                        );
                    }
                });
            });
        }
    }

    public registerModel(
        name: string,
        parameters: string,
        quantization: string,
        promptKeys?: string[]
    ): void {
        const model = new Model(name, parameters, quantization);
        const currentModels = PromptLibrary.listModels();

        PromptLibrary.initializeModels(
            currentModels.length ? [...currentModels, model] : [model]
        );

        promptKeys?.forEach(promptKey => {
            if (this.globalTemplates[promptKey]) {
                PromptLibrary.addPrompt(name, promptKey, this.globalTemplates[promptKey]);
            }
        });
    }

    public addTemplate(
        templateKey: string,
        templateValue: string,
        assignToModels?: string[]
    ): void {
        this.globalTemplates[templateKey] = templateValue;

        assignToModels?.forEach(modelName => {
            PromptLibrary.addPrompt(modelName, templateKey, templateValue);
        });
    }

    public addCustomPrompt(modelName: string, promptKey: string, promptValue: string): void {
        PromptLibrary.addPrompt(modelName, promptKey, promptValue);
    }

    public getTemplates(): Record<string, string> {
        return { ...this.globalTemplates };
    }

    /**
     * Fills a prompt template with provided values
     * @param modelName - The name of the model
     * @param promptKey - The key of the prompt template
     * @param replacements - An object containing key-value pairs for replacements
     * @returns The filled prompt with all placeholders replaced with their values
     */
    public fillPromptTemplate(
        modelName: string,
        promptKey: string,
        replacements: Record<string, string>
    ): string {
        return PromptLibrary.fillPromptTemplate(modelName, promptKey, replacements);
    }
}

export const modelStorage = new ModelStorage();
