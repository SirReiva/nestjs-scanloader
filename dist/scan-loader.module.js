"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var ScanLoaderModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanModule = exports.ScanLoaderModule = void 0;
const common_1 = require("@nestjs/common");
const glob_1 = require("glob");
const path_1 = require("path");
const ignoredFiles = ['**/*.d.ts', '**/*.js.map'];
const scanLoader = (pathsProviders, pathsControllers, basePath, ignores, name) => {
    const providers = [];
    if (pathsProviders.length > 0) {
        common_1.Logger.log('Scanning Providers...', name);
        const fileProviders = pathsProviders
            .map((path) => glob_1.sync(path_1.join(basePath, path), {
            ignore: [...ignoredFiles, ...ignores],
        }))
            .reduce((acc, val) => [...acc, ...val], []);
        for (const providersFile of fileProviders) {
            common_1.Logger.log('Scanning file ' + path_1.basename(providersFile), name);
            const s = require(providersFile);
            const providersRequire = Object.values(s);
            for (const provider of providersRequire) {
                common_1.Logger.log(`${provider.name} loaded`, name);
                providers.push(provider);
            }
        }
    }
    const controllers = [];
    if (pathsControllers.length > 0) {
        common_1.Logger.log('Scanning Controllers...', name);
        const fileControllers = pathsControllers
            .map((path) => glob_1.sync(path_1.join(basePath, path), {
            ignore: [...ignoredFiles, ...ignores],
        }))
            .reduce((acc, val) => [...acc, ...val], []);
        for (const controllerFile of fileControllers) {
            common_1.Logger.log('Scanning file ' + path_1.basename(controllerFile), name);
            const c = require(controllerFile);
            const controllersRequire = Object.values(c);
            for (const controller of controllersRequire) {
                common_1.Logger.log(`${controller.name} loaded`, name);
                controllers.push(controller);
            }
        }
    }
    return {
        providers,
        controllers,
    };
};
let ScanLoaderModule = ScanLoaderModule_1 = class ScanLoaderModule {
    static register(opts) {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];
        common_1.Logger.log('Start scanning...', `${this.name}-${opts.name}`);
        const { controllers, providers } = scanLoader(opts.providersPaths || [], opts.controllersPaths || [], opts.basePath, defIgnores, `${this.name}-${opts.name}`);
        common_1.Logger.log('Scan sucessfull', `${this.name}-${opts.name}`);
        return {
            controllers,
            module: ScanLoaderModule_1,
            providers: [...providers, ...defProviders],
            imports: opts.imports,
            exports: opts.export
                ? [...providers, ...defProviders, ...defImports]
                : undefined,
        };
    }
};
ScanLoaderModule = ScanLoaderModule_1 = __decorate([
    common_1.Module({})
], ScanLoaderModule);
exports.ScanLoaderModule = ScanLoaderModule;
function ScanModule(metadata) {
    return (target) => {
        const { controllersPaths, providersPaths, basePath, ignores } = metadata, nestModuleMetadata = __rest(metadata, ["controllersPaths", "providersPaths", "basePath", "ignores"]);
        const { controllers, providers } = scanLoader(providersPaths || [], controllersPaths || [], basePath, ignores || [], ScanLoaderModule.name + '-' + target.name);
        const finalMetadata = Object.assign(Object.assign({}, nestModuleMetadata), { controllers: [
                ...(nestModuleMetadata.controllers || []),
                ...controllers,
            ], providers: [...(nestModuleMetadata.providers || []), ...providers] });
        common_1.Module(finalMetadata)(target);
    };
}
exports.ScanModule = ScanModule;
//# sourceMappingURL=scan-loader.module.js.map