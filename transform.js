module.exports = function(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // 1. Remove all console.* calls
    root.find(j.CallExpression, {
        callee: {
            type: 'MemberExpression',
            object: { name: 'console' }
        }
    }).remove();

    // 2. Remove comments
    // jscodeshift attaches comments to nodes. We can iterate over all nodes and delete their comments.
    root.find(j.Node).forEach(path => {
        if (path.node.comments) {
            delete path.node.comments;
        }
    });

    return root.toSource();
};
