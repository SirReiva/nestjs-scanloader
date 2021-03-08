import { DynamicModule, ForwardReference, ModuleMetadata, Provider, Type } from '@nestjs/common';
export interface ScanOptions {
    name: string;
    basePath: string;
    controllersPaths?: string[];
    providersPaths?: string[];
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    ignores?: string[];
    providers?: Provider<any>[];
    export?: boolean;
}
export interface IScanOptions {
    basePath: string;
    controllersPaths?: string[];
    providersPaths?: string[];
    ignores?: string[];
}
export declare class ScanLoaderModule {
    static register(opts: ScanOptions): DynamicModule;
}
export declare function ScanModule(metadata: ModuleMetadata & IScanOptions): ClassDecorator;
//# sourceMappingURL=scan-loader.module.d.ts.map