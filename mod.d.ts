/**
 * Forked from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/nunjucks
 */

export type TemplateCallback<T> = (err: lib.TemplateError | null, res: T | null) => void;
export type Callback<E, T> = (err: E | null, res: T | null) => void;

namespace Nunjucks {
  export interface Extension {
    tags: string[];
    // Parser API is undocumented it is suggested to check the source: https://github.com/mozilla/nunjucks/blob/master/src/parser.js
    parse(parser: any, nodes: any, lexer: any): any;
  }

  export class Environment {
      options: {
          autoescape: boolean;
      };

      constructor(loader?: ILoader | ILoader[] | null, opts?: ConfigureOptions);
      render(name: string, context?: object): string;
      render(name: string, context?: object, callback?: TemplateCallback<string>): void;

      renderString(name: string, context: object): string;
      renderString(name: string, context: object, callback?: TemplateCallback<string>): void;

      addFilter(name: string, func: (...args: any[]) => any, async?: boolean): Environment;
      getFilter(name: string): (...args: any[]) => any;

      addExtension(name: string, ext: Extension): Environment;
      removeExtension(name: string): void;
      getExtension(name: string): Extension;
      hasExtension(name: string): boolean;

      addGlobal(name: string, value: any): Environment;
      getGlobal(name: string): any;

      getTemplate(name: string, eagerCompile?: boolean): Template;
      getTemplate(name: string, eagerCompile?: boolean, callback?: Callback<Error, Template>): void;

      express(app: object): void;

      on(
          event: 'load',
          fn: (name: string, source: { src: string; path: string; noCache: boolean }, loader: Loader) => void,
      ): void;
  }

  export class Template {
      constructor(src: string, env?: Environment, path?: string, eagerCompile?: boolean);
      render(context?: object): string;
      render(context?: object, callback?: TemplateCallback<string>): void;
  }

  export interface ILoader {
    async?: boolean | undefined;
    getSource(name: string): LoaderSource;
    getSource(name: string, callback: Callback<Error, LoaderSource>): void;
  }

  export interface LoaderSource {
    src: string;
    path: string;
    noCache: boolean;
  }

  export interface LoaderOptions {
    /** if true, the system will automatically update templates when they are changed on the filesystem */
    watch?: boolean;

    /**  if true, the system will avoid using a cache and templates will be recompiled every single time */
    noCache?: boolean;
  }

  // Needs both Loader and ILoader since nunjucks uses a custom object system
  // Object system is also responsible for the extend methods
  export class Loader {
    on(name: string, func: (...args: any[]) => any): void;
    emit(name: string, ...args: any[]): void;
    resolve(from: string, to: string): string;
    isRelative(filename: string): boolean;
    static extend<LoaderClass extends typeof Loader>(this: LoaderClass, toExtend: ILoader): LoaderClass;
  }

  export type FileSystemLoaderOptions = LoaderOptions;

  export class FileSystemLoader extends Loader implements ILoader {
    constructor(searchPaths?: string | string[], opts?: FileSystemLoaderOptions);
    getSource(name: string): LoaderSource;
  }

  export type NodeResolveLoaderOptions = LoaderOptions;

  export class NodeResolveLoader extends Loader implements ILoader {
    constructor(searchPaths?: string | string[], opts?: NodeResolveLoaderOptions);
    getSource(name: string): LoaderSource;
  }

  export class PrecompiledLoader extends Loader implements ILoader {
    constructor(compiledTemplates?: any[]);
    getSource(name: string): LoaderSource;
  }

  // export namespace compiler {
  //   // TODO
  // }

  // export namespace parser {
  //   // TODO
  // }

  // export namespace lexer {
  //   // TODO
  // }

  export namespace runtime {
      class SafeString {
          constructor(val: string);
          val: string;
          length: number;
          valueOf(): string;
          toString(): string;
      }
  }

  export namespace lib {
    class TemplateError extends Error {
        constructor(message: string, lineno: number, colno: number);

        name: string; // always 'Template render error'
        message: string;
        stack: string;

        cause?: Error | undefined;
        lineno: number;
        colno: number;
    }
  }

  // export namespace nodes {
  //   // TODO
  // }

  export function installJinjaCompat(): void;

  export interface ConfigureOptions {
    autoescape?: boolean | undefined;
    throwOnUndefined?: boolean | undefined;
    trimBlocks?: boolean | undefined;
    lstripBlocks?: boolean | undefined;
    watch?: boolean | undefined;
    noCache?: boolean | undefined;
    web?: {
      useCache?: boolean | undefined;
      async?: boolean | undefined;
    };
    express?: object | undefined;
    tags?: {
      blockStart?: string | undefined;
      blockEnd?: string | undefined;
      variableStart?: string | undefined;
      variableEnd?: string | undefined;
      commentStart?: string | undefined;
      commentEnd?: string | undefined;
    };
  }

  export function configure(options: ConfigureOptions): Environment;
  export function configure(path: string | string[], options?: ConfigureOptions): Environment;

  export function reset(): void;

  export function compile(message: string, lineno: number, colno: number, eagerCompile?: boolean): Template;

  export function render(name: string, context?: Record<string, unknown>): string;
  export function render(name: string, context?: Record<string, unknown>, callback?: TemplateCallback<string>): void;

  export function renderString(src: string, context: Record<string, unknown>): string;
  export function renderString(src: string, context: Record<string, unknown>, callback?: TemplateCallback<string>): void;

  export interface PrecompileOptions {
    name?: string | undefined;
    asFunction?: boolean | undefined;
    force?: boolean | undefined;
    env?: Environment | undefined;
    include?: string[] | undefined;
    exclude?: string[] | undefined;
    wrapper?(templates: { name: string; template: string }, opts: PrecompileOptions): string;
  }

  export function precompile(path: string, opts?: PrecompileOptions): string;

  export function precompileString(src: string, opts?: PrecompileOptions): string;
}

export default Nunjucks
