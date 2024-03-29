import { existsSync, path } from "./deps.js";
import { _prettifyError } from "./lib.js";
import compiler from "./compiler.js";
import { Environment } from "./environment.js";
import precompileGlobal from "./precompile_global.js";

const readdirNamesSync = (p) => Deno.readdirSync(p).map((q) => q.name).sort();

function match(filename, patterns) {
  if (!Array.isArray(patterns)) {
    return false;
  }
  return patterns.some((pattern) => filename.match(pattern));
}

function precompileString(str, opts) {
  opts = opts || {};
  opts.isString = true;
  const env = opts.env || new Environment([]);
  const wrapper = opts.wrapper || precompileGlobal;

  if (!opts.name) {
    throw new Error('the "name" option is required when compiling a string');
  }
  return wrapper([_precompile(str, opts.name, env)], opts);
}

function precompile(input, opts) {
  // The following options are available:
  //
  // * name: name of the template (auto-generated when compiling a directory)
  // * isString: input is a string, not a file path
  // * asFunction: generate a callable function
  // * force: keep compiling on error
  // * env: the Environment to use (gets extensions and async filters from it)
  // * include: which file/folders to include (folders are auto-included, files are auto-excluded)
  // * exclude: which file/folders to exclude (folders are auto-included, files are auto-excluded)
  // * wrapper: function(templates, opts) {...}
  //       Customize the output format to store the compiled template.
  //       By default, templates are stored in a global variable used by the runtime.
  //       A custom loader will be necessary to load your custom wrapper.

  opts = opts || {};
  const env = opts.env || new Environment([]);
  const wrapper = opts.wrapper || precompileGlobal;

  if (opts.isString) {
    return precompileString(input, opts);
  }

  const pathStats = existsSync(input) && Deno.statSync(input);
  const precompiled = [];
  const templates = [];

  function addTemplates(dir) {
    readdirNamesSync(dir).forEach((file) => {
      const filepath = path.join(dir, file);
      let subpath = filepath.substr(path.join(input, "/").length);
      const stat = Deno.statSync(filepath);

      if (stat && stat.isDirectory()) {
        subpath += "/";
        if (!match(subpath, opts.exclude)) {
          addTemplates(filepath);
        }
      } else if (match(subpath, opts.include)) {
        templates.push(filepath);
      }
    });
  }

  if (pathStats.isFile()) {
    precompiled.push(_precompile(
      Deno.readTextFileSync(input),
      opts.name || input,
      env,
    ));
  } else if (pathStats.isDirectory()) {
    addTemplates(input);

    for (let i = 0; i < templates.length; i++) {
      const name = templates[i].replace(path.join(input, "/"), "");

      try {
        precompiled.push(_precompile(
          Deno.readTextFileSync(templates[i]),
          name,
          env,
        ));
      } catch (e) {
        if (opts.force) {
          // Don't stop generating the output if we're
          // forcing compilation.
          console.error(e);
        } else {
          throw e;
        }
      }
    }
  }

  return wrapper(precompiled, opts);
}

function _precompile(str, name, env) {
  env = env || new Environment([]);

  const asyncFilters = env.asyncFilters;
  const extensions = env.extensionsList;
  let template;

  name = name.replace(/\\/g, "/");

  try {
    template = compiler.compile(str, asyncFilters, extensions, name, env.opts);
  } catch (err) {
    throw _prettifyError(name, false, err);
  }

  return { name, template };
}

export default {
  precompile,
  precompileString,
};
