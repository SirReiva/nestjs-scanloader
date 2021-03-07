"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScanLoaderModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanLoaderModule = void 0;
const common_1 = require("@nestjs/common");
const glob_1 = require("glob");
const node_path_1 = require("node:path");
const path_1 = require("path");
const ignoredFiles = ['**/*.d.ts', '**/*.js.map'];
let ScanLoaderModule = ScanLoaderModule_1 = class ScanLoaderModule {
    static register(opts) {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];
        common_1.Logger.log('Start scanning...', `${this.name}-${opts.name}`);
        const providers = [];
        if (opts.providersPaths) {
            common_1.Logger.log('Scanning Providers...', `${this.name}-${opts.name}`);
            const fileProviders = opts.providersPaths
                .map((path) => glob_1.sync(path_1.join(opts.basePath, path), {
                ignore: [...ignoredFiles, ...defIgnores],
            }))
                .reduce((acc, val) => [...acc, ...val], []);
            for (const providersFile of fileProviders) {
                common_1.Logger.log('Scanning file ' + node_path_1.basename(providersFile), `${this.name}-${opts.name}`);
                const s = require(providersFile);
                const providersRequire = Object.values(s);
                for (const provider of providersRequire) {
                    common_1.Logger.log(`${provider.name} loaded`, `${this.name}-${opts.name}`);
                    providers.push(provider);
                }
            }
        }
        const controllers = [];
        if (opts.controllersPaths) {
            common_1.Logger.log('Scanning Controllers...', `${this.name}-${opts.name}`);
            const fileControllers = opts.controllersPaths
                .map((path) => glob_1.sync(path_1.join(opts.basePath, path), {
                ignore: [...ignoredFiles, ...defIgnores],
            }))
                .reduce((acc, val) => [...acc, ...val], []);
            for (const controllerFile of fileControllers) {
                common_1.Logger.log('Scanning file ' + node_path_1.basename(controllerFile), `${this.name}-${opts.name}`);
                const c = require(controllerFile);
                const controllersRequire = Object.values(c);
                for (const controller of controllersRequire) {
                    common_1.Logger.log(`${controller.name} loaded`, `${this.name}-${opts.name}`);
                    controllers.push(controller);
                }
            }
        }
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
//# sourceMappingURL=scan-loader.module.js.map