import { Position, Range } from "vscode-languageserver-types";
import { CommentNode } from "../syntax-tree/element/CommentNode";
import { RuleNode } from "../syntax-tree/element/RuleNode";
import { VariableNode } from "../syntax-tree/element/VariableNode";
import { GenericNode } from "../syntax-tree/GenericNode";

/**
 * Saves all elements of an OvDocument and provides a few methods 
 * for getting specific elements
 *
 * @export
 * @class OvElementManager
 */
export class OvElementManager {
    private _elements: GenericNode[];

    constructor() {
        this._elements = [];
    }

    /**
     * Returns generic Elements
     *
     * @readonly
     * @type {GenericNode[]}
     * @memberof OvElementManager
     */
    public getElements(): GenericNode[] {
        return this._elements;
    }

    public addElement(element: GenericNode) {
        this._elements.push(element);
    }

    public overrideElement(element: GenericNode, index: number) {
        if (this._elements.length <= index) {
            this._elements.push(element);
            if (this._elements.length <= index)
                throw Error("Can't override Element");
        }

        this._elements[index] = element;
    }

    public addElements(element: GenericNode[]) {
        this._elements.push(...element);
    }

    /**
     * Returns all known variables
     *
     * @readonly
     * @type {OvVariable[]}
     * @memberof OvElementManager
     */
    public getVariables(): VariableNode[] {
        return this._elements.filter(element => element instanceof VariableNode) as VariableNode[];
    }

    /**
     * Returns all known rules
     *
     * @readonly
     * @type {OvRule[]}
     * @memberof OvElementManager
     */
    public getRules(): RuleNode[] {
        return this._elements.filter(element => element instanceof RuleNode) as RuleNode[];
    }

    /**
     * Returns all known comments
     *
     * @readonly
     * @type {OvComment[]}
     * @memberof OvElementManager
     */
    public getComments(): CommentNode[] {
        return this._elements.filter(element => element instanceof CommentNode) as CommentNode[];
    }

    /**
     * Finds and returns the element at an specific position in the document
     *
     * @param {Position} position position where the element should be found
     * @returns {(GenericNode | undefined)} found rule
     * @memberof OvDocument
     */
    public getElementByPosition(position: Position): GenericNode | undefined {
        var lineNumber = position.line;

        var element = this.getElements().filter(rule => {
            var range = rule.getRange();
            if (!range) return false;

            return range.getStart().getLine() <= lineNumber &&
                range.getEnd().getLine() >= lineNumber;
        });
        if (!element || element.length == 0) return undefined;

        return element[0];
    }

    /**
     * Finds and returns the element at an specific position in the document
     *
     * @param {Position} range position where the element should be found
     * @returns {GenericNode[]} found rules
     * @memberof OvDocument
     */
    public getElementsByRange(range: Range): GenericNode[] {
        var elements = this.getElements().filter(rule => {
            var elementRange = rule.getRange();
            if (!elementRange) return false;

            var afterStart = range.start.line <= elementRange.getStart().getLine();
            var beforeEnd = range.end.line >= elementRange.getEnd().getLine();
            return afterStart && beforeEnd;
        });
        return elements;
    }

    /**
     * Searches for a rule with the specified name and returns it
     *
     * @param {string} name name of the defined rule
     * @returns {(OvVariable | null)} the found rule or null
     * @memberof OvDocument
     */
    public getVariablesByName(name: string): VariableNode[] | null {
        var filteredVariables: VariableNode[] = this.getVariables().filter(element => !!element.getNameNode() && element.getNameNode()!.getName().toLowerCase() == name.toLowerCase());
        if (filteredVariables.length > 0) {
            return filteredVariables;
        }
        return null;
    }

    /**
     * Returns all known variables
     *
     * @readonly
     * @type {OvVariable[]}
     * @memberof OvElementManager
     */
    public getUsedVariables(element: string, asKeyword: string | null): VariableNode[] {
        var returnNode: VariableNode[] = [];

        for (const variable of this.getVariables()) {
            if (!variable.getNameNode() ||
                !variable.getValue() ||
                element.indexOf(variable.getNameNode()!.getName()) == -1)
                continue;

            if (!asKeyword || element.toLowerCase().indexOf(asKeyword.toLowerCase() + " " + variable.getNameNode()!.getName().toLowerCase()) == -1) {
                returnNode.push(variable);
            }
        }

        return returnNode;
    }

    public getLines(): string {
        var lines: string[] = this._elements.map(element => element.getLines().join('\n'));
        return lines.join("\n\n");
    }
}