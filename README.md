<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) module for autoload providers and controllers.

## Installation

```bash
$ npm install nestjs-scanloader
```

## Example

```TS
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScanLoaderModule } from 'nestjs-scanloader';

@Module({
    imports: [
        ScanLoaderModule.register({
            basePath: __dirname,
            controllersPaths: ['/controllers/**/*.controller.js'],
            providersPaths: ['/services/**/*.service.js'],
            imports: [JwtModule.register({})],
        }),
    ],
})
export class AppModule {}
```

## Register options

```TS
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
```

-   name: identifier of current register for logs.
-   basePath: url root for controllersPaths and providersPaths.
-   controllersPaths: list of [Glob](https://www.npmjs.com/package/glob) expresions for match controllers.
-   providersPaths: list of [Glob](https://www.npmjs.com/package/glob) expresions for match providers.
-   imports: list of dependecies modules for autolad provides and controllers.
-   ignores: list of [Glob](https://www.npmjs.com/package/glob) expresions for ignore during scan.
-   export: if autoload providers need to be exported.

## License

Nest is [MIT licensed](LICENSE).
