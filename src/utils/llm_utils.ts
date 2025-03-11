import { PromptLibrary } from "../domain/promptLibrary";
import { Model } from "../domain/model";

export class LLMUtility {
    private static instance: LLMUtility | null = null;
    private static globalTemplates: Record<string, string> = {};

    private constructor() {}

    public static getInstance(): LLMUtility {
        if (!LLMUtility.instance) {
            LLMUtility.instance = new LLMUtility();
        }
        return LLMUtility.instance;
    }

    public static initialize(
        templates: Record<string, string>,
        models?: Array<{
            name: string,
            parameters: string,
            quantization: string,
            prompts?: string[]
        }>
    ): void {
        const instance = LLMUtility.getInstance();
        LLMUtility.globalTemplates = templates;

        if (models?.length) {
            const modelObjects = models.map(model =>
                new Model(model.name, model.parameters, model.quantization)
            );

            PromptLibrary.initializeModels(modelObjects);

            models.forEach(model => {
                model.prompts?.forEach(promptKey => {
                    if (LLMUtility.globalTemplates[promptKey]) {
                        PromptLibrary.addPrompt(
                            model.name,
                            promptKey,
                            LLMUtility.globalTemplates[promptKey]
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
            if (LLMUtility.globalTemplates[promptKey]) {
                PromptLibrary.addPrompt(name, promptKey, LLMUtility.globalTemplates[promptKey]);
            }
        });
    }

    public addTemplate(
        templateKey: string,
        templateValue: string,
        assignToModels?: string[]
    ): void {
        LLMUtility.globalTemplates[templateKey] = templateValue;

        assignToModels?.forEach(modelName => {
            PromptLibrary.addPrompt(modelName, templateKey, templateValue);
        });
    }

    public addCustomPrompt(modelName: string, promptKey: string, promptValue: string): void {
        PromptLibrary.addPrompt(modelName, promptKey, promptValue);
    }

    public getTemplates(): Record<string, string> {
        return { ...LLMUtility.globalTemplates };
    }
}
