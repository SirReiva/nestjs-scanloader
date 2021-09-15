import {
    DynamicModule,
    ForwardReference,
    Logger,
    Module,
    ModuleMetadata,
    Provider,
    Type,
} from '@nestjs/common';
import { sync } from 'fast-glob';
import { join, basename } from 'path';

export interface ScanOptions {
    name: string;
    basePath: string;
    controllersPaths?: string[];
    providersPaths?: string[];
    imports?: Array<
        Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    ignores?: string[];
    providers?: Provider<any>[];
    export?: boolean;
}

interface ILoaderResult {
    providers: Provider<any>[];
    controllers: Type<any>[];
}

export interface IScanOptions {
    basePath: string;
    controllersPaths?: string[];
    providersPaths?: string[];
    ignores?: string[];
}

const ignoredFiles = ['**/*.d.ts', '**/*.js.map'];

const scanLoader = (
    pathsProviders: string[],
    pathsControllers: string[],
    basePath: string,
    ignores: string[],
    name: string,
): ILoaderResult => {
    const providers: Provider<any>[] = [];
    if (pathsProviders.length > 0) {
        Logger.log('Scanning Providers...', name);
        const fileProviders: string[] = pathsProviders
            .map((path) =>
                sync(join(basePath, path).replace(/\\/g, '/'), {
                    ignore: [...ignoredFiles, ...ignores],
                    absolute: true,
                }),
            )
            .reduce((acc, val) => [...acc, ...val], []);

        for (const providersFile of fileProviders) {
            Logger.log('Scanning file ' + basename(providersFile), name);
            const s = require(providersFile);
            const providersRequire: any[] = Object.values(s);
            for (const provider of providersRequire) {
                Logger.log(`${provider.name} loaded`, name);
                providers.push(provider as Provider<any>);
            }
        }
    }

    const controllers: Type<any>[] = [];
    if (pathsControllers.length > 0) {
        Logger.log('Scanning Controllers...', name);
        const fileControllers: string[] = pathsControllers
            .map((path) =>
                sync(join(basePath, path).replace(/\\/g, '/'), {
                    ignore: [...ignoredFiles, ...ignores],
                    absolute: true,
                }),
            )
            .reduce((acc, val) => [...acc, ...val], []);

        for (const controllerFile of fileControllers) {
            Logger.log('Scanning file ' + basename(controllerFile), name);
            const c = require(controllerFile);
            const controllersRequire: any[] = Object.values(c);
            for (const controller of controllersRequire) {
                Logger.log(`${controller.name} loaded`, name);
                controllers.push(controller as Type<any>);
            }
        }
    }

    return {
        providers,
        controllers,
    };
};

@Module({})
export class ScanLoaderModule {
    static register(opts: ScanOptions): DynamicModule {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];

        Logger.log('Start scanning...', `${this.name}-${opts.name}`);

        const { controllers, providers } = scanLoader(
            opts.providersPaths || [],
            opts.controllersPaths || [],
            opts.basePath,
            defIgnores,
            `${this.name}-${opts.name}`,
        );

        Logger.log('Scan sucessfull', `${this.name}-${opts.name}`);
        return {
            controllers,
            module: ScanLoaderModule,
            providers: [...providers, ...defProviders],
            imports: opts.imports,
            exports: opts.export
                ? [...providers, ...defProviders, ...defImports]
                : undefined,
        };
    }
}

export function ScanModule(
    metadata: ModuleMetadata & IScanOptions,
): ClassDecorator {
    return (target: Function) => {
        const {
            controllersPaths,
            providersPaths,
            basePath,
            ignores,
            ...nestModuleMetadata
        } = metadata;
        const { controllers, providers } = scanLoader(
            providersPaths || [],
            controllersPaths || [],
            basePath,
            ignores || [],
            ScanLoaderModule.name + '-' + target.name,
        );
        const finalMetadata: ModuleMetadata = {
            ...nestModuleMetadata,
            controllers: [
                ...(nestModuleMetadata.controllers || []),
                ...controllers,
            ],
            providers: [...(nestModuleMetadata.providers || []), ...providers],
        };
        Module(finalMetadata)(target);
    };
}
