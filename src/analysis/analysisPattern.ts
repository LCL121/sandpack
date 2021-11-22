import { isIdentifierNode } from '../nodes/sharedNodes';
import {
  isArrayPatternNode,
  isAssignmentPatternNode,
  isObjectPatternNode,
  isRestElementNode,
  PatternNode
} from '../nodes/patternNode';

interface AnalysisPatternResult {
  exported: string;
  local: string;
}

/** PatternNode */
export function analysisPattern(node: PatternNode): AnalysisPatternResult[] {
  const result: AnalysisPatternResult[] = [];
  if (isIdentifierNode(node)) {
    result.push({
      exported: node.name,
      local: node.name
    });
  } else if (isArrayPatternNode(node)) {
    if (node.elements) {
      for (const element of node.elements) {
        result.push(...analysisPattern(element));
      }
    }
  } else if (isAssignmentPatternNode(node)) {
    result.push(...analysisPattern(node.left));
  } else if (isObjectPatternNode(node)) {
    // { t1: { t2: t3 } } = {} => only need t3
    for (const property of node.properties) {
      if (isRestElementNode(property)) {
        result.push(...analysisPattern(property.argument));
      } else {
        result.push(...analysisPattern(property.value));
      }
    }
  } else if (isRestElementNode(node)) {
    result.push(...analysisPattern(node.argument));
  }

  return result;
}
