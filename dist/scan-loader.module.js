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
exports.ScanLoaderModule = void 0;
const common_1 = require("@nestjs/common");
const glob_1 = require("glob");
const path_1 = require("path");
let ScanLoaderModule = ScanLoaderModule_1 = class ScanLoaderModule {
    static register(opts) {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];
        common_1.Logger.log('Start scanning...', this.name);
        const providers = [];
        if (opts.providersPaths) {
            common_1.Logger.log('Scanning Providers...', this.name);
            const fileProviders = opts.providersPaths
                .map((path) => glob_1.sync(path_1.join(opts.basePath, path), {
                ignore: ['**/*.d.ts', ...defIgnores],
            }))
                .reduce((acc, val) => [...acc, ...val], []);
            for (const providersFile of fileProviders) {
                const s = __rest(require(providersFile), []);
                const providersRequire = Object.values(s);
                for (const provider of providersRequire) {
                    common_1.Logger.log(`${provider.name} loaded`, this.name);
                    providers.push(provider);
                }
            }
        }
        const controllers = [];
        if (opts.controllersPaths) {
            common_1.Logger.log('Scanning Controllers...', this.name);
            const fileControllers = opts.controllersPaths
                .map((path) => glob_1.sync(path_1.join(opts.basePath, path), {
                ignore: ['**/*.d.ts', ...defIgnores],
            }))
                .reduce((acc, val) => [...acc, ...val], []);
            for (const controllerFile of fileControllers) {
                const c = __rest(require(controllerFile), []);
                const controllersRequire = Object.values(c);
                for (const controller of controllersRequire) {
                    common_1.Logger.log(`${controller.name} loaded`, this.name);
                    controllers.push(controller);
                }
            }
        }
        common_1.Logger.log('Scan sucessfull', this.name);
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