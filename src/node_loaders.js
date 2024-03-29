import { existsSync, path } from "./deps.js";
import Loader from "./loader.js";
import { PrecompiledLoader } from "./precompiled_loader.js";

class FileSystemLoader extends Loader {
  constructor(searchPaths, opts) {
    super();
    if (typeof opts === "boolean") {
      console.log(
        "[nunjucks] Warning: you passed a boolean as the second " +
          "argument to FileSystemLoader, but it now takes an options " +
          "object. See https://mozilla.github.io/nunjucks/api.html#filesystemloader",
      );
    }

    opts = opts || {};
    this.pathsToNames = {};
    this.noCache = !!opts.noCache;

    if (searchPaths) {
      searchPaths = Array.isArray(searchPaths) ? searchPaths : [searchPaths];
      // For windows, convert to forward slashes
      this.searchPaths = searchPaths.map(path.normalize);
    } else {
      this.searchPaths = ["."];
    }

    if (opts.watch) {
      throw new Error(
        "The `watch` option is not supported by the Deno port of Nunjucks",
      );
    }
  }

  getSource(name) {
    let fullpath = null;
    const paths = this.searchPaths;

    for (let i = 0; i < paths.length; i++) {
      const basePath = path.resolve(paths[i]);
      const p = path.resolve(paths[i], name);

      // Only allow the current directory and anything
      // underneath it to be searched
      if (p.indexOf(basePath) === 0 && existsSync(p)) {
        fullpath = p;
        break;
      }
    }

    if (!fullpath) {
      return null;
    }

    this.pathsToNames[fullpath] = name;

    const source = {
      src: Deno.readTextFileSync(fullpath),
      path: fullpath,
      noCache: this.noCache,
    };
    this.emit("load", name, source);
    return source;
  }
}

class NodeResolveLoader extends Loader {
  constructor(opts) {
    super();
    opts = opts || {};
    this.pathsToNames = {};
    this.noCache = !!opts.noCache;

    if (opts.watch) {
      throw new Error(
        "The `watch` option is not supported by the Deno port of Nunjucks",
      );
    }
  }

  getSource(name) {
    // Don't allow file-system traversal
    if ((/^\.?\.?(\/|\\)/).test(name)) {
      return null;
    }
    if ((/^[A-Z]:/).test(name)) {
      return null;
    }

    let fullpath;

    try {
      fullpath = require.resolve(name);
    } catch {
      return null;
    }

    this.pathsToNames[fullpath] = name;

    const source = {
      src: Deno.readTextFileSync(fullpath),
      path: fullpath,
      noCache: this.noCache,
    };

    this.emit("load", name, source);
    return source;
  }
}

export { FileSystemLoader, NodeResolveLoader, PrecompiledLoader };
