import { Type } from "class-transformer";
import { CompletionType } from "../../../../enums/CompletionType";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ArrayOperandNode } from "./operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operand/FunctionOperandNode";
import { OperandNode } from "./operand/OperandNode";
import { OperatorNode } from "./operand/OperatorNode";
import { ConditionNode } from "./ConditionNode";
import { ConnectedOperationNode } from "./ConnectedOperationNode";

export class OperationNode extends ConditionNode {
    @Type(() => OperandNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
                { value: FunctionOperandNode, name: "FunctionOperandNode" },
                { value: OperandNode, name: "OperandNode" },
                { value: ArrayOperandNode, name: "ArrayOperandNode" }
            ]
        }
    })
    private leftOperand: OperandNode;

    @Type(() => OperandNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
                { value: FunctionOperandNode, name: "FunctionOperandNode" },
                { value: OperandNode, name: "OperandNode" },
                { value: ArrayOperandNode, name: "ArrayOperandNode" }
            ]
        }
    })
    private rightOperand: OperandNode;

    @Type(() => OperatorNode)
    private operator: OperatorNode;

    constructor(leftOperand: OperandNode, rightOperand: OperandNode, operator: OperatorNode, lines: string[], range: IndexRange) {
        super(lines, range);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.operator = operator;
    }

    /**
     * Getter leftOperand
     * @return {OperandNode}
     */
    public getLeftOperand(): OperandNode {
        return this.leftOperand;
    }

    /**
     * Getter rightOperand
     * @return {OperandNode}
     */
    public getRightOperand(): OperandNode {
        return this.rightOperand;
    }

    /**
     * Getter operator
     * @return {string}
     */
    public getOperator(): OperatorNode {
        return this.operator;
    }

    /**
     * Setter leftOperand
     * @param {OperandNode} value
     */
    public setLeftOperand(value: OperandNode) {
        this.leftOperand = value;
    }

    /**
     * Setter rightOperand
     * @param {OperandNode} value
     */
    public setRightOperand(value: OperandNode) {
        this.rightOperand = value;
    }

    /**
     * Setter operator
     * @param {string} value
     */
    public setOperator(value: OperatorNode) {
        this.operator = value;
    }

    public getChilds(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.leftOperand)
            childList.push(this.leftOperand);

        if (!!this.rightOperand)
            childList.push(this.rightOperand);

        if (!!this.operator)
            childList.push(this.operator);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operation");

        return content;
    }


    public getCompletionContainer(): CompletionContainer {

        if (!this.leftOperand) return new CompletionContainer(CompletionType.Operand);

        var container: CompletionContainer = this.leftOperand.getCompletionContainer();
        if (!this.leftOperand.isComplete() && !this.operator) {
            return container;
        }

        if (!this.operator) {
            container.addType(CompletionType.Operator);
            container.specificDataType(this.leftOperand.getDataType());
            return container;
        }

        if (!this.rightOperand) {
            container = new CompletionContainer(CompletionType.Operand);
            container.specificDataType(this.leftOperand.getDataType());
            container.specifyNameFiltering(this.leftOperand.getName());
            return container;
        }

        container = this.rightOperand.getCompletionContainer();
        if (!this.rightOperand.isComplete() && !container.containsOperator()) {
            return container;
        }
        return new CompletionContainer(CompletionType.None);
    }
}
