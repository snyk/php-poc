const fs = require('fs'),
    tabdown = require('./tabdown'),
    exec = require('child_process').exec,
    appPath = process.argv.slice(2)[0],
    cmd1 = `cd ${appPath}  && php composer.phar show --format=json`,
    cmd2 = `cd ${appPath}  && php composer.phar show -t --no-ansi`;

exec(cmd1, { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
    function createInstalledPackagesDictionary(listOfGlobalDependencies) {
        const installedPackages = JSON.parse(listOfGlobalDependencies)['installed']
        var installedPackagesDictionary = {};
        for (let i = 0; i < installedPackages.length; i++) {
            installedPackagesDictionary[installedPackages[i]['name']] = installedPackages[i]
        }
        return installedPackagesDictionary;
    }
    installedPackagesDictionary = createInstalledPackagesDictionary(stdout);
    exec(cmd2, { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
        function converStrToTree(dependenciesTextTree) {
            const lines = dependenciesTextTree.toString().split('\n');
            let newLines = [];
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                line = line.split('--').join('')
                line = line.split('`').join('')
                line = line.split('|').join('')
                line = line.split('  ').join('\t')
                newLines.push(line);
            }
            var tree = tabdown.parse(newLines, '\t');
            return tree;
        }
        function convertTreeToSnykFormat(tree, depthTree) {
            function walkInTree(toNode, fromNode, parentNode) {
                if (!toNode['from']) {
                    toNode['from'] = [];
                }

                toNode['from'].push(toNode['name'] + '@' + toNode['version']);
                if (parentNode) {
                    for (let i = 0; i < parentNode['from'].length; i++) {
                        toNode['from'].push(parentNode['from'][i]);
                    }
                }

                if (fromNode['children'] && fromNode['children'].length > 0) {
                    for (let i = 0; i < fromNode['children'].length; i++) {
                        if (fromNode['children'][i]['data'].indexOf('php') == -1) {
                            const externalNode = getExactPackageVersion(fromNode['children'][i]['data'])
                            if (externalNode) {
                                let newNode = { "name": externalNode['name'], "version": externalNode['version'], "dependencies": [], from: [] };
                                toNode['dependencies'].push(newNode);
                                walkInTree(toNode['dependencies'][toNode['dependencies'].length - 1], fromNode['children'][i], toNode)
                            }
                        }
                    }
                }
                delete toNode['parent'];
            }
            function getExactPackageVersion(packageDependency) {
                for (var key in installedPackagesDictionary) {
                    if (packageDependency.indexOf(key) > -1) {
                        return installedPackagesDictionary[key];
                    }
                }
                return { name: packageDependency, version: 'NOT_FOUND' };
            }
            walkInTree(snykTree, depthTree);
        }
        let tree = converStrToTree(stdout);
        let snykTree = {
            "name": "app",
            "version": "0.0.0",
            "dependencies": []
        };
        convertTreeToSnykFormat(snykTree, tree);
        console.log(JSON.stringify(snykTree, null, 2));

    });
});