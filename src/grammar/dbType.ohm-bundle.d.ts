// AUTOGENERATED FILE
// This file was generated from dbType.ohm by `ohm generateBundles`.

import {
  ActionDict,
  Grammar,
  IterationNode,
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';

export interface DbTypeActionDict<T> extends ActionDict<T> {
  Type?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ParamType?: (this: NonterminalNode, arg0: IterationNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  WithDefault?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: NonterminalNode, arg5: TerminalNode) => T;
  OnDelete?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: NonterminalNode, arg5: TerminalNode) => T;
  OnUpdate?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode, arg4: NonterminalNode, arg5: TerminalNode) => T;
  Increment?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  Primary?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  Unsigned?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  NotNull?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  Unique?: (this: NonterminalNode, arg0: TerminalNode, arg1: TerminalNode, arg2: NonterminalNode, arg3: TerminalNode) => T;
  ArrayType?: (this: NonterminalNode, arg0: IterationNode, arg1: TerminalNode) => T;
  SimpleType?: (this: NonterminalNode, arg0: IterationNode) => T;
  Arg?: (this: NonterminalNode, arg0: IterationNode | NonterminalNode) => T;
  Quoted?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode, arg2: TerminalNode) => T;
  TypeChars?: (this: NonterminalNode, arg0: NonterminalNode | TerminalNode) => T;
  Unquote1?: (this: NonterminalNode, arg0: NonterminalNode | TerminalNode) => T;
  Unquote2?: (this: NonterminalNode, arg0: NonterminalNode | TerminalNode) => T;
  Boolean?: (this: NonterminalNode, arg0: TerminalNode) => T;
  Object?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  Prop?: (this: NonterminalNode, arg0: IterationNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
}

export interface DbTypeSemantics extends Semantics {
  addOperation<T>(name: string, actionDict: DbTypeActionDict<T>): this;
  extendOperation<T>(name: string, actionDict: DbTypeActionDict<T>): this;
  addAttribute<T>(name: string, actionDict: DbTypeActionDict<T>): this;
  extendAttribute<T>(name: string, actionDict: DbTypeActionDict<T>): this;
}

export interface DbTypeGrammar extends Grammar {
  createSemantics(): DbTypeSemantics;
  extendSemantics(superSemantics: DbTypeSemantics): DbTypeSemantics;
}

declare const grammar: DbTypeGrammar;
export default grammar;
