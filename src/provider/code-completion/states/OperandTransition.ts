import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class OperandTransition extends StateTransition {
    private dataType: string | undefined;
    private nameFilter: string | undefined | null;

    constructor(datatype?: string, nameFilter?: string | null, prependingText?: string) {
        super(prependingText);

        this.dataType = datatype;
        this.nameFilter = nameFilter;
    }

    public getDataType(): string | undefined {
        return this.dataType;
    }

    public getNameFilter(): string[] | undefined | null {
        if (!this.nameFilter) return null;

        var filter: string[] = [this.nameFilter];
        var complexChild: string[] = this.nameFilter.split('.');
        if (complexChild.length > 1) {
            filter.push(complexChild[complexChild.length - 1]);
        }

        return filter;
    }

    public isValid(name: string, datatype: string): boolean {
        return (!!datatype && !! this.nameFilter && datatype == this.dataType && !this.nameFilter.includes(name) ||
                (!this.nameFilter && !this.dataType));
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addFittingIdentifier(this);
    }
}