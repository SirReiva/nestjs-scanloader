import {
    DynamicModule,
    ForwardReference,
    Logger,
    Module,
    Provider,
    Type,
} from '@nestjs/common';
import { sync } from 'glob';
import { join } from 'path';

export interface ScanOptions {
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

@Module({})
export class ScanLoaderModule {
    static register(opts: ScanOptions): DynamicModule {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];

        Logger.log('Start scanning...', this.name);

        const providers: Provider<any>[] = [];
        if (opts.providersPaths) {
            Logger.log('Scanning Providers...', this.name);
            const fileProviders: string[] = opts.providersPaths
                .map((path) =>
                    sync(join(opts.basePath, path), {
                        ignore: ['**/*.d.ts', ...defIgnores],
                    }),
                )
                .reduce((acc, val) => [...acc, ...val], []);

            for (const providersFile of fileProviders) {
                const { ...s } = require(providersFile);
                const providersRequire: any[] = Object.values(s);
                for (const provider of providersRequire) {
                    Logger.log(`${provider.name} loaded`, this.name);
                    providers.push(provider as Provider<any>);
                }
            }
        }

        const controllers: Type<any>[] = [];
        if (opts.controllersPaths) {
            Logger.log('Scanning Controllers...', this.name);
            const fileControllers: string[] = opts.controllersPaths
                .map((path) =>
                    sync(join(opts.basePath, path), {
                        ignore: ['**/*.d.ts', ...defIgnores],
                    }),
                )
                .reduce((acc, val) => [...acc, ...val], []);

            for (const controllerFile of fileControllers) {
                const { ...c } = require(controllerFile);
                const controllersRequire: any[] = Object.values(c);
                for (const controller of controllersRequire) {
                    Logger.log(`${controller.name} loaded`, this.name);
                    controllers.push(controller as Type<any>);
                }
            }
        }

        Logger.log('Scan sucessfull', this.name);
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
