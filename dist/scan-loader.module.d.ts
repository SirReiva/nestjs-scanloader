import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common';
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
export declare class ScanLoaderModule {
    static register(opts: ScanOptions): DynamicModule;
}
//# sourceMappingURL=scan-loader.module.d.ts.map