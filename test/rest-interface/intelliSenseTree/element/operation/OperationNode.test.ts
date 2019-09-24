import "jest";
import { Position } from 'vscode-languageserver';
import { CompletionState } from '../../../../../src/provider/code-completion/CompletionStates';
import { OperandNode } from '../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode';
import { OperationNode } from '../../../../../src/rest-interface/intelliSenseTree/element/operation/OperationNode';
import { IndexRange } from '../../../../../src/rest-interface/intelliSenseTree/IndexRange';
import { ArrayOperandNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/FunctionOperandNode";
import { OperatorNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperatorNode";

describe("Operation Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty OperationNode, expected Empty", () => {
        var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticOperand, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [CompletionState.Operand];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });


    test("getCompletionContainer with OperationNode with staticOperand, expected correct Datatype", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 6);

        var expected: string = "Decimal";
        var actual: string | null = operation.getCompletionContainer(positionParameter).getDataType();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticArrayOperand, expected Operands", () => {
        var item: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var leftOperand: ArrayOperandNode = new ArrayOperandNode([item], ["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [CompletionState.ArrayOperand, CompletionState.Operand];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticFunctionOperand, expected Operands", () => {
        var item: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var leftOperand: FunctionOperandNode = new FunctionOperandNode([item], ["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [CompletionState.FunctionOperand, CompletionState.Operand];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticFunctionOperand, expected correct DataType", () => {
        var item: OperandNode = new OperandNode(["Einkaufsliste.Preis"], IndexRange.create(0, "Summe von".length + 1, 0, "Einkaufsliste.Preis".length), "Decimal", "Einkaufsliste.Preis");
        var leftOperand: FunctionOperandNode = new FunctionOperandNode([item], ["Summe von Einkaufsliste.Preis"], IndexRange.create(0, 0, 0, "Summe von Einkaufsliste.Preis".length), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, "Summe von Einkaufsliste.Preis".length));

        var positionParameter = Position.create(0, "Summe von Einkaufsliste.Preis".length + 1);

        var expected: CompletionState[] = [CompletionState.FunctionOperand, CompletionState.Operand];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with Operand and Operation, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var expected: CompletionState[] = [CompletionState.Operator];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with Operand and Operation, expected correct OperatorDatatype", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var expected: string = "Object";
        var actual: string | null = operation.getCompletionContainer(positionParameter).getDataType();

        expect(actual).toEqual(expected);
    });


    test("getCompletionContainer with complete OperationNode, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticFunctionOperand, expected FunctionOperand and ConnectedOperation", () => {
        var leftOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 0, 0, 2), "Decimal", "18.0");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 3, 0, 9), "Boolean", "EQUALS", "Object");
        var item: OperandNode = new OperandNode(["Einkaufsliste.Preis"], IndexRange.create(0, 20, 0, 39), "Decimal", "Einkaufsliste.Preis");
        var rightOperand: FunctionOperandNode = new FunctionOperandNode([item], ["Summe von Einkaufsliste.Preis"], IndexRange.create(0, 10, 0, 39), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter"], IndexRange.create(0, 0, 0, 39));

        var positionParameter = Position.create(0, 40);

        var expected: CompletionState[] = [CompletionState.FunctionOperand, CompletionState.OperationEnd];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperationNode with staticArrayOperand, expected FunctionOperand and ConnectedOperation", () => {
        var leftOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 0, 0, 2), "Decimal", "18.0");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 3, 0, 9), "Boolean", "EQUALS", "Object");
        var item: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 10, 0, 15), "Decimal", "Alter");
        var rightOperand: ArrayOperandNode = new ArrayOperandNode([item], ["Alter"], IndexRange.create(0, 10, 0, 15), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter"], IndexRange.create(0, 10, 0, 15));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.ArrayOperand, CompletionState.OperationEnd];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete OperationNode and position after leftOperand, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete OperationNode and position after operator, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 13);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    
    test("getCompletionContainer with complete OperationNode and position before leftOperand, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alte"], IndexRange.create(0, 1, 0, 5), "Decimal", "Alte");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 1);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with incomplete OperationNode and invalid position, expected Operands", () => {
        var leftOperand: OperandNode = new OperandNode(["Alte"], IndexRange.create(0, 1, 0, 5), "Decimal", "Alte");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 8, 0, 14), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 7);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = operation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

});