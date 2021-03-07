import {
    DynamicModule,
    ForwardReference,
    Logger,
    Module,
    Provider,
    Type,
} from '@nestjs/common';
import { sync } from 'glob';
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

const ignoredFiles = ['**/*.d.ts', '**/*.js.map'];

@Module({})
export class ScanLoaderModule {
    static register(opts: ScanOptions): DynamicModule {
        const defProviders = opts.providers || [];
        const defImports = opts.imports || [];
        const defIgnores = opts.ignores || [];

        Logger.log('Start scanning...', `${this.name}-${opts.name}`);

        const providers: Provider<any>[] = [];
        if (opts.providersPaths) {
            Logger.log('Scanning Providers...', `${this.name}-${opts.name}`);
            const fileProviders: string[] = opts.providersPaths
                .map((path) =>
                    sync(join(opts.basePath, path), {
                        ignore: [...ignoredFiles, ...defIgnores],
                    }),
                )
                .reduce((acc, val) => [...acc, ...val], []);

            for (const providersFile of fileProviders) {
                Logger.log(
                    'Scanning file ' + basename(providersFile),
                    `${this.name}-${opts.name}`,
                );
                const s = require(providersFile);
                const providersRequire: any[] = Object.values(s);
                for (const provider of providersRequire) {
                    Logger.log(
                        `${provider.name} loaded`,
                        `${this.name}-${opts.name}`,
                    );
                    providers.push(provider as Provider<any>);
                }
            }
        }

        const controllers: Type<any>[] = [];
        if (opts.controllersPaths) {
            Logger.log('Scanning Controllers...', `${this.name}-${opts.name}`);
            const fileControllers: string[] = opts.controllersPaths
                .map((path) =>
                    sync(join(opts.basePath, path), {
                        ignore: [...ignoredFiles, ...defIgnores],
                    }),
                )
                .reduce((acc, val) => [...acc, ...val], []);

            for (const controllerFile of fileControllers) {
                Logger.log(
                    'Scanning file ' + basename(controllerFile),
                    `${this.name}-${opts.name}`,
                );
                const c = require(controllerFile);
                const controllersRequire: any[] = Object.values(c);
                for (const controller of controllersRequire) {
                    Logger.log(
                        `${controller.name} loaded`,
                        `${this.name}-${opts.name}`,
                    );
                    controllers.push(controller as Type<any>);
                }
            }
        }

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
