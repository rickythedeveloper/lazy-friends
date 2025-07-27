const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const sharedRoot = path.resolve(projectRoot, '../packages/shared');

const config = getDefaultConfig(projectRoot)
    // watchFolders: [projectRoot, monorepoRoot],
    // alias: {
    //     '@lf/shared': path.resolve(projectRoot, '../packages/shared'),
    // },
    // resolver: {
    //     nodeModulesPaths: [
    //         path.resolve(projectRoot, 'node_modules'),
    //         // path.resolve(monorepoRoot, 'node_modules'),
    //     ]
    // }
// };

// // 1. Watch all files within the monorepo
config.watchFolders = [projectRoot, sharedRoot];
// // 2. Let Metro know where to resolve packages and in what order
// config.resolver.nodeModulesPaths = [
//     path.resolve(projectRoot, 'node_modules'),
//     // path.resolve(monorepoRoot, 'node_modules'),
// ];

config.resolver.alias = {
    // '@lf/shared': path.resolve(sharedRoot),
    'react': path.resolve(projectRoot, 'node_modules/react'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    '@tanstack/react-query': path.resolve(projectRoot, 'node_modules/@tanstack/react-query'),
}


config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    // path.resolve(sharedRoot, 'node_modules'),
]

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react') {
        return {
            filePath: path.resolve(projectRoot, 'node_modules/react/index.js'),
            type: 'sourceFile'
        }
    }

    return context.resolveRequest(context, moduleName, platform);
}

console.log(sharedRoot)

module.exports = config;
