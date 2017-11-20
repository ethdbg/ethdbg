/**
 * TODO: Use eslint specified style, document with JSDoc
 * TODO: make Es6
 * @file Crawl the given AST through the function walk(ast, callback)
 * taken from ethereum/remix
 * @author yann300 <https://github.com/yann300>
 */

/**
 * @author yann300 <https://github.com/yann300>
 */
class AstWalker {
  /**
   * visit all the AST nodes
   *
   * @param{Object} ast  - AST node
   * @param{Object|Function} callback
   * if (Function) the function will be called for every node.
   * if (Object) callback[<Node Type>] will be called for
   * every node of type <Node Type>. callback["*"] will be called fo all other
   * nodes. In each case, if the callback returns false it does not descend
   * into children. If no callback for the current type, children are visited.
   */
  walk(ast, callback) {
    if (callback instanceof Function) {
      callback = {
        '*': callback,
      };
    }
    if (!('*' in callback)) {
      callback['*'] = () => {
        return true;
      };
    }
    if (this.manageCallBack(ast, callback) &&
        ast.children && ast.children.length > 0) {
      for (let k in ast.children) {
        let child = ast.children[k];
        this.walk(child, callback);
      }
    }
  }

  /**
   * walk the given @astList
   *
   * @param {Object} sourcesList - sources list (containing root AST node)
   * @param {function} callback - callback used by AstWalker to compute response
   */
  walkAstList(sourcesList, callback) {
    let walker = new AstWalker();
    for (let k in sourcesList) {
      walker.walk(sourcesList[k].AST, callback);
    }
  }

  /**
   * @author yann300
   * @param{node} node
   * @param{function} callback
   * @return{node}
   */
  manageCallBack(node, callback) {
    if (node.name in callback) {
      return callback[node.name](node);
    } else {
      return callback['*'](node);
    }
  }
}

module.exports = AstWalker;
