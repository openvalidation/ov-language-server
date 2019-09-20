import { Type } from "class-transformer";
import { CompletionType } from "../../../../enums/CompletionType";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ConditionNode } from "./ConditionNode";
import { OperationNode } from "./OperationNode";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../aliases/AliasHelper";

export class ConnectedOperationNode extends ConditionNode {
    @Type(() => OperationNode)
    private conditions: ConditionNode[];

    constructor(conditions: ConditionNode[], lines: string[], range: IndexRange) {
        super(lines, range)
        this.conditions = conditions;
    }

    /**
     * Getter conditions
     * @return {ConditionNode}
     */
    public getConditions(): ConditionNode[] {
        return this.conditions;
    }

    /**
     * Setter conditions
     * @param {ConditionNode} value
     */
    public setConditions(value: ConditionNode[]) {
        this.conditions = value;
    }

    public isConstrained(): boolean {
        return this.getConditions().map(cond => cond.isConstrained()).some(bool => bool);
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        childList = childList.concat(this.conditions);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("ConnectedOperation");

        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (this.getConditions().length <= 1) {
            return new CompletionContainer(CompletionType.Operand);
        }

        for (const condition of this.getConditions()) {
            var container = condition.getCompletionContainer(position);
            if (!container.isEmpty() && !container.containsLogicalOperator())
                return container;
            if (condition.getRange().includesPosition(position))
                return CompletionContainer.createEmpty();
        }

        if (!this.getRange().positionBeforeEnd(position))
            return new CompletionContainer(CompletionType.LogicalOperator);
        else
            return CompletionContainer.createEmpty();
    }
    
    public getBeautifiedContent(aliasHelper: AliasHelper): string {
        if (this.getConditions().length == 0) return this.getLines().join("\n");
        var returnString: string = "";
        var index = 0;
        for (; index < this.getConditions().length - 1; index++) {
            const element = this.getConditions()[index];
            returnString += element.getBeautifiedContent(aliasHelper) + "\n";            
        }
        returnString += this.getConditions()[index].getBeautifiedContent(aliasHelper);

        return returnString;
    }
}
