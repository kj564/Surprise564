// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split('-')[0]; // Remove any trailing part from e.g. "12.53.3-alpha"
    let vers = str.split('.').slice(0, 3);
    while(vers.length < 3) vers.push('00');
    vers = vers.map((n, i, arr) => n.padStart(2, '0'));
    return vers.join('');
  }
  // 300000 -> "30.0.0"
  const packedVersionToHumanReadable = n => [n / 10_000 | 0, (n / 100 | 0) % 100, n % 100].join('.');

  const TARGET_NOT_SUPPORTED = 2147483647;

  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.

  // We skip the node version checking when running on Bun/Deno since the node
  // version they report doesn't seem to be useful.
  if (typeof process !== 'undefined' && !process.versions?.bun && typeof Deno === "undefined") {
    const currentNodeVersion = process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
    if (currentNodeVersion < 180300) {
      throw new Error(`This emscripten-generated code requires node v${ packedVersionToHumanReadable(180300) } (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
    }
  }

  const userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  if (!userAgent) {
    return;
  }

  const currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 150000) {
    throw new Error(`This emscripten-generated code requires Safari v${ packedVersionToHumanReadable(150000) } (detected v${currentSafariVersion})`);
  }

  const currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 79) {
    throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`);
  }

  const currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var programArgs = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName = globalThis.document?.currentScript?.src;

if (typeof __filename !== 'undefined') { // Node
  _scriptName = __filename;
} else
if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  const isNode = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
  if (!isNode) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('node:fs');

  scriptDirectory = __dirname + '/';

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename);
  assert(Buffer.isBuffer(ret));
  return ret;
};

readAsync = async (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename, binary ? undefined : 'utf8');
  assert(binary ? Buffer.isBuffer(ret) : typeof ret === 'string');
  return ret;
};
// end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  programArgs = process.argv.slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here
  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = async (url) => {
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use XHR on webview if URL is a file URL.
    if (isFileURI(url)) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            resolve(xhr.response);
            return;
          }
          reject(xhr.status);
        };
        xhr.onerror = reject;
        xhr.send(null);
      });
    }
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = console.log.bind(console);
var err = console.error.bind(console);

var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time (add `shell` to `-sENVIRONMENT` to enable)');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

if (!globalThis.WebAssembly) {
  err('no native wasm support detected');
}

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort('malloc() called but not included in the build - add `_malloc` to EXPORTED_FUNCTIONS');
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH extends Error {}

class EmscriptenSjLj extends EmscriptenEH {}

class CppException extends EmscriptenEH {
  constructor(excPtr) {
    super(excPtr);
    this.excPtr = excPtr;
    const excInfo = getExceptionMessage(this);
    this.name = excInfo[0];
    this.message = excInfo[1];
  }
}

// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true; // Switch to false at runtime to disable logging at the right times

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug !== 'undefined') return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  const h16 = new Int16Array(1);
  const h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) abort('Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)');
})();

function consumedModuleProp(prop) {
  let value = Module[prop];
  const msg = `Attempt to modify \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`;
  if (Array.isArray(value)) {
    value = new Proxy(value, {
      set(target, key, val) {
        abort(msg);
        return false;
      },
      defineProperty(target, key, descriptor) {
        abort(msg);
        return false;
      },
      deleteProperty(target, key) {
        abort(msg);
        return false;
      }
    });
  }
  Object.defineProperty(Module, prop, {
    configurable: true,
    get() { return value; },
    set() {
      abort(msg);
    }
  });
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);

}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_preloadFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

/**
 * Intercept access to a symbols in the global symbol.  This enables us to give
 * informative warnings/errors when folks attempt to use symbols they did not
 * include in their build, or no symbols that no longer exist.
 *
 * We don't define this in MODULARIZE mode since in that mode emscripten symbols
 * are never placed in the global scope.
 */
function hookGlobalSymbolAccess(sym, func) {
  if (!Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        func();
        return undefined;
      }
    });
  }
}

function missingGlobal(sym, msg) {
  hookGlobalSymbolAccess(sym, () => {
    warnOnce(`\`${sym}\` is no longer defined by emscripten. ${msg}`);
  });
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  hookGlobalSymbolAccess(sym, () => {
    // Can't `abort()` here because it would break code that does runtime
    // checks.  e.g. `if (typeof SDL === 'undefined')`.
    let msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
    // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
    // library.js, which means $name for a JS name with no prefix, or name
    // for a JS name like _name.
    let librarySymbol = sym;
    if (!librarySymbol.startsWith('_')) {
      librarySymbol = '$' + sym;
    }
    msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
    if (isExportedByForceFilesystem(sym)) {
      msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
    }
    warnOnce(msg);
  });

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        let msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      },
    });
  }
}

// end include: runtime_debug.js
// include: runtime_stack_check.js
const stackCookie1 = 0x02135467;
const stackCookie2 = 0x89BACDFE;

// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  let max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = stackCookie1;
  HEAPU32[(((max)+(4))>>2)] = stackCookie2;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function u32ToHexString(num) {
  return '0x' + (num >>> 0).toString(16).padStart(8, '0');
}

function checkStackCookie() {
  if (ABORT) return;
  let max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  const val1 = HEAPU32[((max)>>2)];
  const val2 = HEAPU32[(((max)+(4))>>2)];
  if (val1 != stackCookie1 || val2 != stackCookie2) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords ${u32ToHexString(stackCookie2)} and ${u32ToHexString(stackCookie1)}, but received ${u32ToHexString(val2)} ${u32ToHexString(val1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// Memory management

var runtimeInitialized = false;



// When ALLOW_MEMORY_GROWTH is enabled, the conversion from Wasm
// memory to ArrayBuffer requires some additional logic.
function getMemoryBuffer() {
  return wasmMemory.buffer;
}

function updateMemoryViews() {
  // If we already have a heap that is resizeable/growable buffer we don't
  // need to do anything in updateMemoryViews.
  if (HEAP8?.buffer?.resizable) return;
  var b = getMemoryBuffer();
  HEAP8 = new Int8Array(b);
  
  HEAPU8 = new Uint8Array(b);
  
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  
  
  HEAP64 = new BigInt64Array(b);
  
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set,
       'JS engine does not provide full typed array support');

function preRun() {
  var preRun = Module['preRun'];
  if (preRun) {
    if (typeof preRun === 'function') preRun = [preRun];
    onPreRuns.push(...preRun);
  }
  consumedModuleProp('preRun');
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  // No ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // No ATPOSTCTORS hooks

  checkStackCookie();
}

function postRun() {
  checkStackCookie();

  var postRun = Module['postRun'];
  if (postRun) {
    if (typeof postRun === 'function') postRun = [postRun];
    onPostRuns.push(...postRun);
  }
  consumedModuleProp('postRun');

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/**
 * @param {string|number=} what
 */
function abort(what) {
  Module['onAbort']?.(what);

  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  throw new WebAssembly.RuntimeError(what);
}

// show errors on likely calls to FS when it was not included
function fsMissing() {
  abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
}
var FS = {
  init: fsMissing,
  createDataFile: fsMissing,
  createPreloadedFile: fsMissing,
  createLazyFile: fsMissing,
  open: fsMissing,
  mkdev: fsMissing,
  registerDevice:  fsMissing,
  analyzePath: fsMissing,
  ErrnoError: fsMissing,
};


function createExportWrapper(name, func, nargs) {
  assert(func);
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return func(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile('test_core_wasm.wasm');
}

function getBinarySync(file) {
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw 'both async and sync fetching of the wasm failed';
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {
      // Fall back to getBinarySync below;
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(binaryFile)) {
      err(`warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary
      // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
      && !isFileURI(binaryFile)
      // Avoid using instantiateStreaming() on Node.js since the `fetch()` API
      // does not support `file://` URLs.
      // See: https://github.com/emscripten-core/emscripten/pull/16917
      && !ENVIRONMENT_IS_NODE
     ) {
    try {
      var response = fetch(binaryFile, { credentials: 'same-origin' });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err('falling back to ArrayBuffer instantiation');
      // fall back of instantiateArrayBuffer below
    };
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance) {
    wasmExports = instance.exports;

    assignWasmExports(wasmExports);

    updateMemoryViews();

    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  var instantiateWasm = Module['instantiateWasm'];
  if (instantiateWasm) {
    return new Promise((resolve) => {
      try {
        instantiateWasm(info, (inst) => resolve(receiveInstance(inst)));
      } catch(e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        throw e;
      }
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  /** @type {!Int32Array} */
  var HEAP32;

  /** @type {!Int8Array} */
  var HEAP8;

  /** @type {!Uint32Array} */
  var HEAPU32;

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);


  var noExitRuntime = true;

  function ptrToString(ptr) {
      assert(typeof ptr === 'number', `ptrToString expects a number, got ${typeof ptr}`);
      // Convert to 32-bit unsigned value
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  

  function __ZN10ItemEntityC1EP5LevelfffRK12ItemInstance(...args
  ) {
  abort('missing function: _ZN10ItemEntityC1EP5LevelfffRK12ItemInstance');
  }
  __ZN10ItemEntityC1EP5LevelfffRK12ItemInstance.stub = true;

  function __ZN10TileEntity6isTypeEPS_i(...args
  ) {
  abort('missing function: _ZN10TileEntity6isTypeEPS_i');
  }
  __ZN10TileEntity6isTypeEPS_i.stub = true;

  function __ZN11FallingTileC1EP5Levelfffii(...args
  ) {
  abort('missing function: _ZN11FallingTileC1EP5Levelfffii');
  }
  __ZN11FallingTileC1EP5Levelfffii.stub = true;

  function __ZN12TripodCameraC1EP5LevelP6Playerfff(...args
  ) {
  abort('missing function: _ZN12TripodCameraC1EP5LevelP6Playerfff');
  }
  __ZN12TripodCameraC1EP5LevelP6Playerfff.stub = true;

  function __ZN14SimpleFoodData3eatEP8FoodItem(...args
  ) {
  abort('missing function: _ZN14SimpleFoodData3eatEP8FoodItem');
  }
  __ZN14SimpleFoodData3eatEP8FoodItem.stub = true;

  function __ZN16FillingContainer14removeResourceEi(...args
  ) {
  abort('missing function: _ZN16FillingContainer14removeResourceEi');
  }
  __ZN16FillingContainer14removeResourceEi.stub = true;

  function __ZN17TileEntityFactory16createTileEntityEi(...args
  ) {
  abort('missing function: _ZN17TileEntityFactory16createTileEntityEi');
  }
  __ZN17TileEntityFactory16createTileEntityEi.stub = true;

  function __ZN20NetherReactorPattern9getTileAtEiii(...args
  ) {
  abort('missing function: _ZN20NetherReactorPattern9getTileAtEiii');
  }
  __ZN20NetherReactorPattern9getTileAtEiii.stub = true;

  function __ZN20NetherReactorPatternC1Ev(...args
  ) {
  abort('missing function: _ZN20NetherReactorPatternC1Ev');
  }
  __ZN20NetherReactorPatternC1Ev.stub = true;

  function __ZN23NetherReactorTileEntity9lightItUpEiii(...args
  ) {
  abort('missing function: _ZN23NetherReactorTileEntity9lightItUpEiii');
  }
  __ZN23NetherReactorTileEntity9lightItUpEiii.stub = true;

  function __ZN4I18n3getERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE(...args
  ) {
  abort('missing function: _ZN4I18n3getERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE');
  }
  __ZN4I18n3getERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE.stub = true;

  function __ZN5ArrowC1EP5LevelP3Mobf(...args
  ) {
  abort('missing function: _ZN5ArrowC1EP5LevelP3Mobf');
  }
  __ZN5ArrowC1EP5LevelP3Mobf.stub = true;

  function __ZN5Level10levelEventEP6Playeriiiii(...args
  ) {
  abort('missing function: _ZN5Level10levelEventEP6Playeriiiii');
  }
  __ZN5Level10levelEventEP6Playeriiiii.stub = true;

  function __ZN5Level11addParticleERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEffffffi(...args
  ) {
  abort('missing function: _ZN5Level11addParticleERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEffffffi');
  }
  __ZN5Level11addParticleERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEffffffi.stub = true;

  function __ZN5Level11hasChunksAtEiiiiii(...args
  ) {
  abort('missing function: _ZN5Level11hasChunksAtEiiiiii');
  }
  __ZN5Level11hasChunksAtEiiiiii.stub = true;

  function __ZN5Level12getLevelDataEv(...args
  ) {
  abort('missing function: _ZN5Level12getLevelDataEv');
  }
  __ZN5Level12getLevelDataEv.stub = true;

  function __ZN5Level13getBrightnessERK10LightLayeriii(...args
  ) {
  abort('missing function: _ZN5Level13getBrightnessERK10LightLayeriii');
  }
  __ZN5Level13getBrightnessERK10LightLayeriii.stub = true;

  function __ZN5Level13getTileEntityEiii(...args
  ) {
  abort('missing function: _ZN5Level13getTileEntityEiii');
  }
  __ZN5Level13getTileEntityEiii.stub = true;

  function __ZN5Level13setTileEntityEiiiP10TileEntity(...args
  ) {
  abort('missing function: _ZN5Level13setTileEntityEiiiP10TileEntity');
  }
  __ZN5Level13setTileEntityEiiiP10TileEntity.stub = true;

  function __ZN5Level13setTilesDirtyEiiiiii(...args
  ) {
  abort('missing function: _ZN5Level13setTilesDirtyEiiiiii');
  }
  __ZN5Level13setTilesDirtyEiiiiii.stub = true;

  function __ZN5Level14isUnobstructedERK4AABB(...args
  ) {
  abort('missing function: _ZN5Level14isUnobstructedERK4AABB');
  }
  __ZN5Level14isUnobstructedERK4AABB.stub = true;

  function __ZN5Level14setTileAndDataEiiiii(...args
  ) {
  abort('missing function: _ZN5Level14setTileAndDataEiiiii');
  }
  __ZN5Level14setTileAndDataEiiiii.stub = true;

  function __ZN5Level15sendTileUpdatedEiii(...args
  ) {
  abort('missing function: _ZN5Level15sendTileUpdatedEiii');
  }
  __ZN5Level15sendTileUpdatedEiii.stub = true;

  function __ZN5Level15setDataNoUpdateEiiii(...args
  ) {
  abort('missing function: _ZN5Level15setDataNoUpdateEiiii');
  }
  __ZN5Level15setDataNoUpdateEiiii.stub = true;

  function __ZN5Level15setTileNoUpdateEiiii(...args
  ) {
  abort('missing function: _ZN5Level15setTileNoUpdateEiiii');
  }
  __ZN5Level15setTileNoUpdateEiiii.stub = true;

  function __ZN5Level16getRawBrightnessEiii(...args
  ) {
  abort('missing function: _ZN5Level16getRawBrightnessEiii');
  }
  __ZN5Level16getRawBrightnessEiii.stub = true;

  function __ZN5Level16removeTileEntityEiii(...args
  ) {
  abort('missing function: _ZN5Level16removeTileEntityEiii');
  }
  __ZN5Level16removeTileEntityEiii.stub = true;

  function __ZN5Level17addToTickNextTickEiiiii(...args
  ) {
  abort('missing function: _ZN5Level17addToTickNextTickEiiiii');
  }
  __ZN5Level17addToTickNextTickEiiiii.stub = true;

  function __ZN5Level17hasNeighborSignalEiii(...args
  ) {
  abort('missing function: _ZN5Level17hasNeighborSignalEiii');
  }
  __ZN5Level17hasNeighborSignalEiii.stub = true;

  function __ZN5Level17updateNeighborsAtEiiii(...args
  ) {
  abort('missing function: _ZN5Level17updateNeighborsAtEiiii');
  }
  __ZN5Level17updateNeighborsAtEiiii.stub = true;

  function __ZN5Level22setTileAndDataNoUpdateEiiiii(...args
  ) {
  abort('missing function: _ZN5Level22setTileAndDataNoUpdateEiiiii');
  }
  __ZN5Level22setTileAndDataNoUpdateEiiiii.stub = true;

  function __ZN5Level7explodeEP6Entityffffb(...args
  ) {
  abort('missing function: _ZN5Level7explodeEP6Entityffffb');
  }
  __ZN5Level7explodeEP6Entityffffb.stub = true;

  function __ZN5Level7setDataEiiii(...args
  ) {
  abort('missing function: _ZN5Level7setDataEiiii');
  }
  __ZN5Level7setDataEiiii.stub = true;

  function __ZN5Level7setTileEiiii(...args
  ) {
  abort('missing function: _ZN5Level7setTileEiiii');
  }
  __ZN5Level7setTileEiiii.stub = true;

  function __ZN5Level8mayPlaceEiiiibh(...args
  ) {
  abort('missing function: _ZN5Level8mayPlaceEiiiibh');
  }
  __ZN5Level8mayPlaceEiiiibh.stub = true;

  function __ZN5Level9addEntityEP6Entity(...args
  ) {
  abort('missing function: _ZN5Level9addEntityEP6Entity');
  }
  __ZN5Level9addEntityEP6Entity.stub = true;

  function __ZN5Level9canSeeSkyEiii(...args
  ) {
  abort('missing function: _ZN5Level9canSeeSkyEiii');
  }
  __ZN5Level9canSeeSkyEiii.stub = true;

  function __ZN5Level9playSoundEP6EntityRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEff(...args
  ) {
  abort('missing function: _ZN5Level9playSoundEP6EntityRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEff');
  }
  __ZN5Level9playSoundEP6EntityRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEff.stub = true;

  function __ZN5Level9playSoundEfffRKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEff(...args
  ) {
  abort('missing function: _ZN5Level9playSoundEfffRKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEff');
  }
  __ZN5Level9playSoundEfffRKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEff.stub = true;

  function __ZN5Sheep8setColorEi(...args
  ) {
  abort('missing function: _ZN5Sheep8setColorEi');
  }
  __ZN5Sheep8setColorEi.stub = true;

  function __ZN6Entity10intersectsEffffff(...args
  ) {
  abort('missing function: _ZN6Entity10intersectsEffffff');
  }
  __ZN6Entity10intersectsEffffff.stub = true;

  function __ZN6Entity10isPickableEv(...args
  ) {
  abort('missing function: _ZN6Entity10isPickableEv');
  }
  __ZN6Entity10isPickableEv.stub = true;

  function __ZN6Entity10isPushableEv(...args
  ) {
  abort('missing function: _ZN6Entity10isPushableEv');
  }
  __ZN6Entity10isPushableEv.stub = true;

  function __ZN6Entity10isSneakingEv(...args
  ) {
  abort('missing function: _ZN6Entity10isSneakingEv');
  }
  __ZN6Entity10isSneakingEv.stub = true;

  function __ZN6Entity10outOfWorldEv(...args
  ) {
  abort('missing function: _ZN6Entity10outOfWorldEv');
  }
  __ZN6Entity10outOfWorldEv.stub = true;

  function __ZN6Entity11animateHurtEv(...args
  ) {
  abort('missing function: _ZN6Entity11animateHurtEv');
  }
  __ZN6Entity11animateHurtEv.stub = true;

  function __ZN6Entity11isShootableEv(...args
  ) {
  abort('missing function: _ZN6Entity11isShootableEv');
  }
  __ZN6Entity11isShootableEv.stub = true;

  function __ZN6Entity11playerTouchEP6Player(...args
  ) {
  abort('missing function: _ZN6Entity11playerTouchEP6Player');
  }
  __ZN6Entity11playerTouchEP6Player.stub = true;

  function __ZN6Entity12isItemEntityEv(...args
  ) {
  abort('missing function: _ZN6Entity12isItemEntityEv');
  }
  __ZN6Entity12isItemEntityEv.stub = true;

  function __ZN6Entity12moveRelativeEfff(...args
  ) {
  abort('missing function: _ZN6Entity12moveRelativeEfff');
  }
  __ZN6Entity12moveRelativeEfff.stub = true;

  function __ZN6Entity12shouldRenderER4Vec3(...args
  ) {
  abort('missing function: _ZN6Entity12shouldRenderER4Vec3');
  }
  __ZN6Entity12shouldRenderER4Vec3.stub = true;

  function __ZN6Entity13getBrightnessEf(...args
  ) {
  abort('missing function: _ZN6Entity13getBrightnessEf');
  }
  __ZN6Entity13getBrightnessEf.stub = true;

  function __ZN6Entity13getEntityDataEv(...args
  ) {
  abort('missing function: _ZN6Entity13getEntityDataEv');
  }
  __ZN6Entity13getEntityDataEv.stub = true;

  function __ZN6Entity13getHeadHeightEv(...args
  ) {
  abort('missing function: _ZN6Entity13getHeadHeightEv');
  }
  __ZN6Entity13getHeadHeightEv.stub = true;

  function __ZN6Entity13getPickRadiusEv(...args
  ) {
  abort('missing function: _ZN6Entity13getPickRadiusEv');
  }
  __ZN6Entity13getPickRadiusEv.stub = true;

  function __ZN6Entity13isUnderLiquidEPK8Material(...args
  ) {
  abort('missing function: _ZN6Entity13isUnderLiquidEPK8Material');
  }
  __ZN6Entity13isUnderLiquidEPK8Material.stub = true;

  function __ZN6Entity13playStepSoundEiiii(...args
  ) {
  abort('missing function: _ZN6Entity13playStepSoundEiiii');
  }
  __ZN6Entity13playStepSoundEiiii.stub = true;

  function __ZN6Entity13saveWithoutIdEP11CompoundTag(...args
  ) {
  abort('missing function: _ZN6Entity13saveWithoutIdEP11CompoundTag');
  }
  __ZN6Entity13saveWithoutIdEP11CompoundTag.stub = true;

  function __ZN6Entity14awardKillScoreEPS_i(...args
  ) {
  abort('missing function: _ZN6Entity14awardKillScoreEPS_i');
  }
  __ZN6Entity14awardKillScoreEPS_i.stub = true;

  function __ZN6Entity14makeStuckInWebEv(...args
  ) {
  abort('missing function: _ZN6Entity14makeStuckInWebEv');
  }
  __ZN6Entity14makeStuckInWebEv.stub = true;

  function __ZN6Entity15causeFallDamageEf(...args
  ) {
  abort('missing function: _ZN6Entity15causeFallDamageEf');
  }
  __ZN6Entity15causeFallDamageEf.stub = true;

  function __ZN6Entity15checkFallDamageEfb(...args
  ) {
  abort('missing function: _ZN6Entity15checkFallDamageEfb');
  }
  __ZN6Entity15checkFallDamageEfb.stub = true;

  function __ZN6Entity15interpolateTurnEff(...args
  ) {
  abort('missing function: _ZN6Entity15interpolateTurnEff');
  }
  __ZN6Entity15interpolateTurnEff.stub = true;

  function __ZN6Entity15isHangingEntityEv(...args
  ) {
  abort('missing function: _ZN6Entity15isHangingEntityEv');
  }
  __ZN6Entity15isHangingEntityEv.stub = true;

  function __ZN6Entity15setEquippedSlotEiii(...args
  ) {
  abort('missing function: _ZN6Entity15setEquippedSlotEiii');
  }
  __ZN6Entity15setEquippedSlotEiii.stub = true;

  function __ZN6Entity15spawnAtLocationEP12ItemInstancef(...args
  ) {
  abort('missing function: _ZN6Entity15spawnAtLocationEP12ItemInstancef');
  }
  __ZN6Entity15spawnAtLocationEP12ItemInstancef.stub = true;

  function __ZN6Entity15spawnAtLocationEii(...args
  ) {
  abort('missing function: _ZN6Entity15spawnAtLocationEii');
  }
  __ZN6Entity15spawnAtLocationEii.stub = true;

  function __ZN6Entity15spawnAtLocationEiif(...args
  ) {
  abort('missing function: _ZN6Entity15spawnAtLocationEiif');
  }
  __ZN6Entity15spawnAtLocationEiif.stub = true;

  function __ZN6Entity21isCreativeModeAllowedEv(...args
  ) {
  abort('missing function: _ZN6Entity21isCreativeModeAllowedEv');
  }
  __ZN6Entity21isCreativeModeAllowedEv.stub = true;

  function __ZN6Entity22interactPreventDefaultEv(...args
  ) {
  abort('missing function: _ZN6Entity22interactPreventDefaultEv');
  }
  __ZN6Entity22interactPreventDefaultEv.stub = true;

  function __ZN6Entity4burnEi(...args
  ) {
  abort('missing function: _ZN6Entity4burnEi');
  }
  __ZN6Entity4burnEi.stub = true;

  function __ZN6Entity4hurtEPS_i(...args
  ) {
  abort('missing function: _ZN6Entity4hurtEPS_i');
  }
  __ZN6Entity4hurtEPS_i.stub = true;

  function __ZN6Entity4loadEP11CompoundTag(...args
  ) {
  abort('missing function: _ZN6Entity4loadEP11CompoundTag');
  }
  __ZN6Entity4loadEP11CompoundTag.stub = true;

  function __ZN6Entity4moveEfff(...args
  ) {
  abort('missing function: _ZN6Entity4moveEfff');
  }
  __ZN6Entity4moveEfff.stub = true;

  function __ZN6Entity4pushEPS_(...args
  ) {
  abort('missing function: _ZN6Entity4pushEPS_');
  }
  __ZN6Entity4pushEPS_.stub = true;

  function __ZN6Entity4pushEfff(...args
  ) {
  abort('missing function: _ZN6Entity4pushEfff');
  }
  __ZN6Entity4pushEfff.stub = true;

  function __ZN6Entity4saveEP11CompoundTag(...args
  ) {
  abort('missing function: _ZN6Entity4saveEP11CompoundTag');
  }
  __ZN6Entity4saveEP11CompoundTag.stub = true;

  function __ZN6Entity4turnEff(...args
  ) {
  abort('missing function: _ZN6Entity4turnEff');
  }
  __ZN6Entity4turnEff.stub = true;

  function __ZN6Entity5resetEv(...args
  ) {
  abort('missing function: _ZN6Entity5resetEv');
  }
  __ZN6Entity5resetEv.stub = true;

  function __ZN6Entity6isFreeEfff(...args
  ) {
  abort('missing function: _ZN6Entity6isFreeEfff');
  }
  __ZN6Entity6isFreeEfff.stub = true;

  function __ZN6Entity6isFreeEffff(...args
  ) {
  abort('missing function: _ZN6Entity6isFreeEffff');
  }
  __ZN6Entity6isFreeEffff.stub = true;

  function __ZN6Entity6lerpToEfffffi(...args
  ) {
  abort('missing function: _ZN6Entity6lerpToEfffffi');
  }
  __ZN6Entity6lerpToEfffffi.stub = true;

  function __ZN6Entity6moveToEfffff(...args
  ) {
  abort('missing function: _ZN6Entity6moveToEfffff');
  }
  __ZN6Entity6moveToEfffff.stub = true;

  function __ZN6Entity6removeEv(...args
  ) {
  abort('missing function: _ZN6Entity6removeEv');
  }
  __ZN6Entity6removeEv.stub = true;

  function __ZN6Entity6setPosEP9EntityPos(...args
  ) {
  abort('missing function: _ZN6Entity6setPosEP9EntityPos');
  }
  __ZN6Entity6setPosEP9EntityPos.stub = true;

  function __ZN6Entity6setPosEfff(...args
  ) {
  abort('missing function: _ZN6Entity6setPosEfff');
  }
  __ZN6Entity6setPosEfff.stub = true;

  function __ZN6Entity6setRotEff(...args
  ) {
  abort('missing function: _ZN6Entity6setRotEff');
  }
  __ZN6Entity6setRotEff.stub = true;

  function __ZN6Entity7isAliveEv(...args
  ) {
  abort('missing function: _ZN6Entity7isAliveEv');
  }
  __ZN6Entity7isAliveEv.stub = true;

  function __ZN6Entity7setSizeEff(...args
  ) {
  abort('missing function: _ZN6Entity7setSizeEff');
  }
  __ZN6Entity7setSizeEff.stub = true;

  function __ZN6Entity8baseTickEv(...args
  ) {
  abort('missing function: _ZN6Entity8baseTickEv');
  }
  __ZN6Entity8baseTickEv.stub = true;

  function __ZN6Entity8interactEP6Player(...args
  ) {
  abort('missing function: _ZN6Entity8interactEP6Player');
  }
  __ZN6Entity8interactEP6Player.stub = true;

  function __ZN6Entity8isInLavaEv(...args
  ) {
  abort('missing function: _ZN6Entity8isInLavaEv');
  }
  __ZN6Entity8isInLavaEv.stub = true;

  function __ZN6Entity8isInWallEv(...args
  ) {
  abort('missing function: _ZN6Entity8isInWallEv');
  }
  __ZN6Entity8isInWallEv.stub = true;

  function __ZN6Entity8isOnFireEv(...args
  ) {
  abort('missing function: _ZN6Entity8isOnFireEv');
  }
  __ZN6Entity8isOnFireEv.stub = true;

  function __ZN6Entity8isPlayerEv(...args
  ) {
  abort('missing function: _ZN6Entity8isPlayerEv');
  }
  __ZN6Entity8isPlayerEv.stub = true;

  function __ZN6Entity8lavaHurtEv(...args
  ) {
  abort('missing function: _ZN6Entity8lavaHurtEv');
  }
  __ZN6Entity8lavaHurtEv.stub = true;

  function __ZN6Entity8markHurtEv(...args
  ) {
  abort('missing function: _ZN6Entity8markHurtEv');
  }
  __ZN6Entity8markHurtEv.stub = true;

  function __ZN6Entity8resetPosEb(...args
  ) {
  abort('missing function: _ZN6Entity8resetPosEb');
  }
  __ZN6Entity8resetPosEb.stub = true;

  function __ZN6Entity8setLevelEP5Level(...args
  ) {
  abort('missing function: _ZN6Entity8setLevelEP5Level');
  }
  __ZN6Entity8setLevelEP5Level.stub = true;

  function __ZN6Entity9isInWaterEv(...args
  ) {
  abort('missing function: _ZN6Entity9isInWaterEv');
  }
  __ZN6Entity9isInWaterEv.stub = true;

  function __ZN6EntityD2Ev(...args
  ) {
  abort('missing function: _ZN6EntityD2Ev');
  }
  __ZN6EntityD2Ev.stub = true;

  function __ZN6Player10canDestroyEP4Tile(...args
  ) {
  abort('missing function: _ZN6Player10canDestroyEP4Tile');
  }
  __ZN6Player10canDestroyEP4Tile.stub = true;

  function __ZN6Player14startUsingItemE12ItemInstancei(...args
  ) {
  abort('missing function: _ZN6Player14startUsingItemE12ItemInstancei');
  }
  __ZN6Player14startUsingItemE12ItemInstancei.stub = true;

  function __ZN6Player15getDestroySpeedEP4Tile(...args
  ) {
  abort('missing function: _ZN6Player15getDestroySpeedEP4Tile');
  }
  __ZN6Player15getDestroySpeedEP4Tile.stub = true;

  function __ZN6Player15getSelectedItemEv(...args
  ) {
  abort('missing function: _ZN6Player15getSelectedItemEv');
  }
  __ZN6Player15getSelectedItemEv.stub = true;

  function __ZN6Player6isHurtEv(...args
  ) {
  abort('missing function: _ZN6Player6isHurtEv');
  }
  __ZN6Player6isHurtEv.stub = true;

  function __ZN7ChickenC1EP5Level(...args
  ) {
  abort('missing function: _ZN7ChickenC1EP5Level');
  }
  __ZN7ChickenC1EP5Level.stub = true;

  function __ZN7Feature10placeBlockEP5Leveliiii(...args
  ) {
  abort('missing function: _ZN7Feature10placeBlockEP5Leveliiii');
  }
  __ZN7Feature10placeBlockEP5Leveliiii.stub = true;

  function __ZN7Feature10placeBlockEP5Leveliiiii(...args
  ) {
  abort('missing function: _ZN7Feature10placeBlockEP5Leveliiiii');
  }
  __ZN7Feature10placeBlockEP5Leveliiiii.stub = true;

  function __ZN7FeatureC2Eb(...args
  ) {
  abort('missing function: _ZN7FeatureC2Eb');
  }
  __ZN7FeatureC2Eb.stub = true;

  function __ZN8PaintingC1EP5Leveliiii(...args
  ) {
  abort('missing function: _ZN8PaintingC1EP5Leveliiii');
  }
  __ZN8PaintingC1EP5Leveliiii.stub = true;

  function __ZN9HitResultC1ERKS_(...args
  ) {
  abort('missing function: _ZN9HitResultC1ERKS_');
  }
  __ZN9HitResultC1ERKS_.stub = true;

  function __ZN9HitResultC1EiiiiRK4Vec3(...args
  ) {
  abort('missing function: _ZN9HitResultC1EiiiiRK4Vec3');
  }
  __ZN9HitResultC1EiiiiRK4Vec3.stub = true;

  function __ZN9HitResultC1Ev(...args
  ) {
  abort('missing function: _ZN9HitResultC1Ev');
  }
  __ZN9HitResultC1Ev.stub = true;

  function __ZN9Inventory11getSelectedEv(...args
  ) {
  abort('missing function: _ZN9Inventory11getSelectedEv');
  }
  __ZN9Inventory11getSelectedEv.stub = true;

  function __ZN9PrimedTntC1EP5Levelfff(...args
  ) {
  abort('missing function: _ZN9PrimedTntC1EP5Levelfff');
  }
  __ZN9PrimedTntC1EP5Levelfff.stub = true;

  function __ZN9Throwable10getAuxDataEv(...args
  ) {
  abort('missing function: _ZN9Throwable10getAuxDataEv');
  }
  __ZN9Throwable10getAuxDataEv.stub = true;

  function __ZN9Throwable10getGravityEv(...args
  ) {
  abort('missing function: _ZN9Throwable10getGravityEv');
  }
  __ZN9Throwable10getGravityEv.stub = true;

  function __ZN9Throwable10lerpMotionEfff(...args
  ) {
  abort('missing function: _ZN9Throwable10lerpMotionEfff');
  }
  __ZN9Throwable10lerpMotionEfff.stub = true;

  function __ZN9Throwable13getThrowPowerEv(...args
  ) {
  abort('missing function: _ZN9Throwable13getThrowPowerEv');
  }
  __ZN9Throwable13getThrowPowerEv.stub = true;

  function __ZN9Throwable19getShadowHeightOffsEv(...args
  ) {
  abort('missing function: _ZN9Throwable19getShadowHeightOffsEv');
  }
  __ZN9Throwable19getShadowHeightOffsEv.stub = true;

  function __ZN9Throwable20addAdditonalSaveDataEP11CompoundTag(...args
  ) {
  abort('missing function: _ZN9Throwable20addAdditonalSaveDataEP11CompoundTag');
  }
  __ZN9Throwable20addAdditonalSaveDataEP11CompoundTag.stub = true;

  function __ZN9Throwable21getThrowUpAngleOffsetEv(...args
  ) {
  abort('missing function: _ZN9Throwable21getThrowUpAngleOffsetEv');
  }
  __ZN9Throwable21getThrowUpAngleOffsetEv.stub = true;

  function __ZN9Throwable22readAdditionalSaveDataEP11CompoundTag(...args
  ) {
  abort('missing function: _ZN9Throwable22readAdditionalSaveDataEP11CompoundTag');
  }
  __ZN9Throwable22readAdditionalSaveDataEP11CompoundTag.stub = true;

  function __ZN9Throwable25shouldRenderAtSqrDistanceEf(...args
  ) {
  abort('missing function: _ZN9Throwable25shouldRenderAtSqrDistanceEf');
  }
  __ZN9Throwable25shouldRenderAtSqrDistanceEf.stub = true;

  function __ZN9Throwable4tickEv(...args
  ) {
  abort('missing function: _ZN9Throwable4tickEv');
  }
  __ZN9Throwable4tickEv.stub = true;

  function __ZN9ThrowableC2EP5LevelP3Mob(...args
  ) {
  abort('missing function: _ZN9ThrowableC2EP5LevelP3Mob');
  }
  __ZN9ThrowableC2EP5LevelP3Mob.stub = true;

  function __ZNK5Sheep8getColorEv(...args
  ) {
  abort('missing function: _ZNK5Sheep8getColorEv');
  }
  __ZNK5Sheep8getColorEv.stub = true;

  function __ZNK5Sheep9isShearedEv(...args
  ) {
  abort('missing function: _ZNK5Sheep9isShearedEv');
  }
  __ZNK5Sheep9isShearedEv.stub = true;

  function __ZNK6Entity13getEntityDataEv(...args
  ) {
  abort('missing function: _ZNK6Entity13getEntityDataEv');
  }
  __ZNK6Entity13getEntityDataEv.stub = true;

  function __ZNK9LevelData11getGameTypeEv(...args
  ) {
  abort('missing function: _ZNK9LevelData11getGameTypeEv');
  }
  __ZNK9LevelData11getGameTypeEv.stub = true;

  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  
  
    /**
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul
   * @return {number}
   */
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // As a tiny code save trick, compare idx against maxIdx using a negation,
      // so that maxBytesToRead=undefined/NaN means Infinity.
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
  
  
    /**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce(`Invalid UTF-8 leading byte ${ptrToString(u0)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`);
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
  /** @type {!Uint8Array} */
  var HEAPU8;
  
    /**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(typeof ptr === 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  var ___assert_fail = (condition, filename, line, func) =>
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);

  var exceptionCaught =  [];
  
  
  var uncaughtExceptionCount = 0;
  
  
  class ExceptionInfo {
      // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
  
      set_type(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      }
  
      get_type() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      }
  
      set_destructor(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      }
  
      get_destructor() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      }
  
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr)+(12)] = caught;
      }
  
      get_caught() {
        return HEAP8[(this.ptr)+(12)] != 0;
      }
  
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr)+(13)] = rethrown;
      }
  
      get_rethrown() {
        return HEAP8[(this.ptr)+(13)] != 0;
      }
  
      // Initialize native structure fields. Should be called once after allocated.
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      }
  
      get_adjusted_ptr() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      }
    }
  var ___cxa_begin_catch = (ptr) => {
      var info = new ExceptionInfo(ptr);
      if (!info.get_caught()) {
        info.set_caught(true);
        uncaughtExceptionCount--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(info);
      return ___cxa_get_exception_ptr(ptr);
    };

  var setTempRet0 = (val) => __emscripten_tempret_set(val);
  
  var exceptionLast = null;
  
  
  var findMatchingCatch = (args) => {
      var thrown = exceptionLast?.excPtr;
      if (!thrown) {
        // just pass through the null ptr
        setTempRet0(0);
        return 0;
      }
      var info = new ExceptionInfo(thrown);
      info.set_adjusted_ptr(thrown);
      var thrownType = info.get_type();
      if (!thrownType) {
        // just pass through the thrown ptr
        setTempRet0(0);
        return thrown;
      }
  
      // can_catch receives a **, add indirection
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var caughtType of args) {
        if (!caughtType || caughtType === thrownType) {
          // Catch all clause matched or exactly the same type is caught
          break;
        }
        var adjusted_ptr_addr = info.ptr + 16;
        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);
          return thrown;
        }
      }
      setTempRet0(thrownType);
      return thrown;
    };
  var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

  var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);

  
  
  
  
  
  
  
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  
  
  var getExceptionMessageCommon = (ptr) => {
      var sp = stackSave();
      var type_addr_addr = stackAlloc(4);
      var message_addr_addr = stackAlloc(4);
      ___get_exception_message(ptr, type_addr_addr, message_addr_addr);
      var type_addr = HEAPU32[((type_addr_addr)>>2)];
      var message_addr = HEAPU32[((message_addr_addr)>>2)];
      var type = UTF8ToString(type_addr);
      _free(type_addr);
      var message;
      if (message_addr) {
        message = UTF8ToString(message_addr);
        _free(message_addr);
      }
      stackRestore(sp);
      return [type, message];
    };
  var getExceptionMessage = (exn) => getExceptionMessageCommon(exn.excPtr);
  
  var decrementExceptionRefcount = (exn) => ___cxa_decrement_exception_refcount(exn.excPtr);
  
  var incrementExceptionRefcount = (exn) => ___cxa_increment_exception_refcount(exn.excPtr);
  
  var __Unwind_RaiseException = (ex) => {
      throw ex;
    };
  var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      ___cxa_increment_exception_refcount(ptr);
      ptr = exceptionLast = new CppException(ptr);
      uncaughtExceptionCount++;
      __Unwind_RaiseException(ptr);
    };

  
  var __Unwind_Resume = (ex) => {
      throw ex;
    };
  var ___resumeException = (ptr) => {
      ptr = exceptionLast ??= new CppException(ptr);
      __Unwind_Resume(ptr);
    };

  var __abort_js = () =>
      abort('native code called abort()');

  var _emscripten_get_now = () => performance.now();
  
  var _emscripten_date_now = () => Date.now();
  
  var nowIsMonotonic = 1;
  
  var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
  
  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  
  /** not-@type {!BigInt64Array} */
  var HEAP64;
  function _clock_time_get(clk_id, ignored_precision, ptime) {
    ignored_precision = bigintToI53Checked(ignored_precision);
  
  
      if (!checkWasiClock(clk_id)) {
        return 28;
      }
      var now;
      // all wasi clocks but realtime are monotonic
      if (clk_id === 0) {
        now = _emscripten_date_now();
      } else if (nowIsMonotonic) {
        now = _emscripten_get_now();
      } else {
        return 52;
      }
      // "now" is in ms, and wasi times are in ns.
      var nsec = Math.round(now * 1_000_000);
      HEAP64[((ptime)>>3)] = BigInt(nsec);
      return 0;
    ;
  }

  var getHeapMax = () =>
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      2147483648;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, 'alignment argument is required');
      return Math.ceil(size / alignment) * alignment;
    };
  
  var growMemory = (size) => {
      var oldHeapSize = wasmMemory.buffer.byteLength;
      var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
        updateMemoryViews();
        return 1 /*success*/;
      } catch(e) {
        err(`growMemory: Attempted to grow heap from ${oldHeapSize} bytes to ${size} bytes, but got error: ${e}`);
      }
      // implicit 0 return to save code size (caller will cast 'undefined' into 0
      // anyhow)
    };
  
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      // With multithreaded builds, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
      assert(requestedSize > oldSize);
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false;
      }
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = growMemory(newSize);
        if (replacement) {
  
          return true;
        }
      }
      err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
      return false;
    };

  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_close = (fd) => {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    };

  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
      return 70;
    ;
  }

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (!curr || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  
  
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };

  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        err(msg);
      }
  
      _proc_exit(status);
    };

  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };

  var wasmTableMirror = [];
  
  
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      /** @suppress {checkTypes} */
      assert(wasmTable.get(funcPtr) == func, 'table mirror is out of date');
      return func;
    };
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];

Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

  // End ATMODULES hooks

  checkIncomingModuleAPI();

  if (Module['arguments']) programArgs = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] === 'undefined', 'Module.read option was removed');
  assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
  assert(typeof Module['TOTAL_MEMORY'] === 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  assert(typeof Module['ENVIRONMENT'] === 'undefined', 'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
  assert(typeof Module['STACK_SIZE'] === 'undefined', 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module['wasmMemory'] === 'undefined', 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
  assert(typeof Module['INITIAL_MEMORY'] === 'undefined', 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

  var preInit = Module['preInit'];
  if (preInit) {
    if (typeof preInit === 'function') Module['preInit'] = preInit = [preInit];
    // Written as a loop so that preInit functions that themselves add more
    // preInit functions.  Is this actually needed?
    while (preInit.length > 0) {
      preInit.shift()();
    }
  }
  consumedModuleProp('preInit');
}

// Begin runtime exports
  var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'getTempRet0',
  'createNamedFunction',
  'zeroMemory',
  'withStackSave',
  'strError',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'readEmAsmArgs',
  'jstoi_q',
  'getExecutableName',
  'autoResumeAudioContext',
  'getDynCaller',
  'dynCall',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asyncLoad',
  'asmjsMangle',
  'mmapAlloc',
  'HandleAllocator',
  'getUniqueRunDependency',
  'addRunDependency',
  'removeRunDependency',
  'addOnInit',
  'addOnPostCtor',
  'addOnPreMain',
  'addOnExit',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'ccall',
  'cwrap',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'setValue',
  'getValue',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'callCanvasResizedCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'currentFullscreenStrategy',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'getEnvStrings',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'initRandomFill',
  'randomFill',
  'safeSetTimeout',
  'safeClearTimeout',
  'setImmediateWrapped',
  'safeRequestAnimationFrame',
  'clearImmediateWrapped',
  'registerPostMainLoop',
  'registerPreMainLoop',
  'getPromise',
  'makePromise',
  'addPromise',
  'idsToPromises',
  'makePromiseCallback',
  'incrementUncaughtExceptionCount',
  'decrementUncaughtExceptionCount',
  'Browser_asyncPrepareDataCounter',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_createPreloadedFile',
  'FS_preloadFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_fileDataToTypedArray',
  'FS_stdin_getChar',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetProgramUniformLocation',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'demangle',
  'stackTrace',
  'getNativeTypeSize',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

  var unexportedSymbols = [
  'run',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'INT53_MAX',
  'INT53_MIN',
  'bigintToI53Checked',
  'HEAP8',
  'HEAPU8',
  'HEAP16',
  'HEAPU16',
  'HEAP32',
  'HEAPU32',
  'HEAPF32',
  'HEAPF64',
  'HEAP64',
  'HEAPU64',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'setTempRet0',
  'ptrToString',
  'exitJS',
  'getHeapMax',
  'growMemory',
  'ENV',
  'ERRNO_CODES',
  'DNS',
  'Protocols',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'handleException',
  'keepRuntimeAlive',
  'alignMemory',
  'wasmTable',
  'wasmMemory',
  'noExitRuntime',
  'addOnPreRun',
  'addOnPostRun',
  'freeTableIndexes',
  'functionsInTableMap',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'UTF16Decoder',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'restoreOldWindowedStyle',
  'UNWIND_CACHE',
  'ExitStatus',
  'checkWasiClock',
  'flush_NO_FILESYSTEM',
  'emSetImmediate',
  'emClearImmediate',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'ExceptionInfo',
  'findMatchingCatch',
  'getExceptionMessageCommon',
  'incrementExceptionRefcount',
  'decrementExceptionRefcount',
  'getExceptionMessage',
  'Browser',
  'requestFullscreen',
  'setCanvasSize',
  'createContext',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'SYSCALLS',
  'preloadPlugins',
  'FS_stdin_getChar_buffer',
  'FS_unlink',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_root',
  'FS_mounts',
  'FS_devices',
  'FS_streams',
  'FS_nextInode',
  'FS_nameTable',
  'FS_currentPath',
  'FS_initialized',
  'FS_ignorePermissions',
  'FS_syncFSRequests',
  'FS_lookupPath',
  'FS_getPath',
  'FS_hashName',
  'FS_hashAddNode',
  'FS_hashRemoveNode',
  'FS_lookupNode',
  'FS_createNode',
  'FS_destroyNode',
  'FS_isRoot',
  'FS_isMountpoint',
  'FS_isFile',
  'FS_isDir',
  'FS_isLink',
  'FS_isChrdev',
  'FS_isBlkdev',
  'FS_isFIFO',
  'FS_isSocket',
  'FS_flagsToPermissionString',
  'FS_nodePermissions',
  'FS_mayLookup',
  'FS_mayCreate',
  'FS_mayDelete',
  'FS_mayOpen',
  'FS_checkOpExists',
  'FS_nextfd',
  'FS_getStreamChecked',
  'FS_getStream',
  'FS_createStream',
  'FS_closeStream',
  'FS_dupStream',
  'FS_doSetAttr',
  'FS_chrdev_stream_ops',
  'FS_major',
  'FS_minor',
  'FS_makedev',
  'FS_registerDevice',
  'FS_getDevice',
  'FS_getMounts',
  'FS_syncfs',
  'FS_mount',
  'FS_unmount',
  'FS_lookup',
  'FS_mknod',
  'FS_statfs',
  'FS_statfsStream',
  'FS_statfsNode',
  'FS_create',
  'FS_mkdir',
  'FS_mkdev',
  'FS_symlink',
  'FS_link',
  'FS_rename',
  'FS_rmdir',
  'FS_readdir',
  'FS_readlink',
  'FS_stat',
  'FS_fstat',
  'FS_lstat',
  'FS_doChmod',
  'FS_chmod',
  'FS_lchmod',
  'FS_fchmod',
  'FS_doChown',
  'FS_chown',
  'FS_lchown',
  'FS_fchown',
  'FS_doTruncate',
  'FS_truncate',
  'FS_ftruncate',
  'FS_utime',
  'FS_open',
  'FS_close',
  'FS_isClosed',
  'FS_llseek',
  'FS_read',
  'FS_write',
  'FS_mmap',
  'FS_msync',
  'FS_ioctl',
  'FS_writeFile',
  'FS_cwd',
  'FS_chdir',
  'FS_createDefaultDirectories',
  'FS_createDefaultDevices',
  'FS_createSpecialDirectories',
  'FS_createStandardStreams',
  'FS_staticInit',
  'FS_init',
  'FS_quit',
  'FS_analyzePath',
  'FS_createFile',
  'FS_createDataFile',
  'FS_forceLoadFile',
  'FS_createLazyFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'print',
  'printErr',
  'jstoi_s',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);

  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js

function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
  ignoredModuleProp('logReadFiles');
  ignoredModuleProp('loadSplitModule');
  ignoredModuleProp('onMalloc');
  ignoredModuleProp('onRealloc');
  ignoredModuleProp('onFree');
  ignoredModuleProp('onSbrkGrow');
  ignoredModuleProp('onCOSCacheHit');
  ignoredModuleProp('onCOSCacheMiss');
  ignoredModuleProp('onCOSStore');
  ignoredModuleProp('GL_MAX_TEXTURE_IMAGE_UNITS');
  ignoredModuleProp('SDL_canPlayWithWebAudio');
  ignoredModuleProp('SDL_numSimultaneouslyQueuedBuffers');
  ignoredModuleProp('freePreloadedMediaOnUse');
  ignoredModuleProp('preinitializedWebGLContext');
  ignoredModuleProp('keyboardListeningElement');
  ignoredModuleProp('doNotCaptureKeyboard');
  ignoredModuleProp('extraStackTrace');
  ignoredModuleProp('preloadPlugins');
  ignoredModuleProp('preMainLoop');
  ignoredModuleProp('postMainLoop');
  ignoredModuleProp('forcedAspectRatio');
  ignoredModuleProp('mainScriptUrlOrBlob');
  ignoredModuleProp('onFullScreen');
  ignoredModuleProp('INITIAL_MEMORY');
  ignoredModuleProp('wasmMemory');
  ignoredModuleProp('wasmBinary');
}

// Imports from the Wasm binary.
var _main = Module['_main'] = makeInvalidEarlyAccess('_main');
var _fflush = makeInvalidEarlyAccess('_fflush');
var _strerror = makeInvalidEarlyAccess('_strerror');
var _emscripten_stack_get_end = makeInvalidEarlyAccess('_emscripten_stack_get_end');
var _emscripten_stack_get_base = makeInvalidEarlyAccess('_emscripten_stack_get_base');
var _free = makeInvalidEarlyAccess('_free');
var _setThrew = makeInvalidEarlyAccess('_setThrew');
var __emscripten_tempret_set = makeInvalidEarlyAccess('__emscripten_tempret_set');
var _emscripten_stack_init = makeInvalidEarlyAccess('_emscripten_stack_init');
var _emscripten_stack_get_free = makeInvalidEarlyAccess('_emscripten_stack_get_free');
var __emscripten_stack_restore = makeInvalidEarlyAccess('__emscripten_stack_restore');
var __emscripten_stack_alloc = makeInvalidEarlyAccess('__emscripten_stack_alloc');
var _emscripten_stack_get_current = makeInvalidEarlyAccess('_emscripten_stack_get_current');
var ___cxa_decrement_exception_refcount = makeInvalidEarlyAccess('___cxa_decrement_exception_refcount');
var ___cxa_increment_exception_refcount = makeInvalidEarlyAccess('___cxa_increment_exception_refcount');
var ___get_exception_message = makeInvalidEarlyAccess('___get_exception_message');
var ___cxa_can_catch = makeInvalidEarlyAccess('___cxa_can_catch');
var ___cxa_get_exception_ptr = makeInvalidEarlyAccess('___cxa_get_exception_ptr');
var memory = makeInvalidEarlyAccess('memory');
var __indirect_function_table = makeInvalidEarlyAccess('__indirect_function_table');
var wasmMemory = makeInvalidEarlyAccess('wasmMemory');
var wasmTable = makeInvalidEarlyAccess('wasmTable');

function assignWasmExports(wasmExports) {
  assert(typeof wasmExports['main'] !== 'undefined', 'missing Wasm export: main');
  assert(typeof wasmExports['fflush'] !== 'undefined', 'missing Wasm export: fflush');
  assert(typeof wasmExports['strerror'] !== 'undefined', 'missing Wasm export: strerror');
  assert(typeof wasmExports['emscripten_stack_get_end'] !== 'undefined', 'missing Wasm export: emscripten_stack_get_end');
  assert(typeof wasmExports['emscripten_stack_get_base'] !== 'undefined', 'missing Wasm export: emscripten_stack_get_base');
  assert(typeof wasmExports['free'] !== 'undefined', 'missing Wasm export: free');
  assert(typeof wasmExports['setThrew'] !== 'undefined', 'missing Wasm export: setThrew');
  assert(typeof wasmExports['_emscripten_tempret_set'] !== 'undefined', 'missing Wasm export: _emscripten_tempret_set');
  assert(typeof wasmExports['emscripten_stack_init'] !== 'undefined', 'missing Wasm export: emscripten_stack_init');
  assert(typeof wasmExports['emscripten_stack_get_free'] !== 'undefined', 'missing Wasm export: emscripten_stack_get_free');
  assert(typeof wasmExports['_emscripten_stack_restore'] !== 'undefined', 'missing Wasm export: _emscripten_stack_restore');
  assert(typeof wasmExports['_emscripten_stack_alloc'] !== 'undefined', 'missing Wasm export: _emscripten_stack_alloc');
  assert(typeof wasmExports['emscripten_stack_get_current'] !== 'undefined', 'missing Wasm export: emscripten_stack_get_current');
  assert(typeof wasmExports['__cxa_decrement_exception_refcount'] !== 'undefined', 'missing Wasm export: __cxa_decrement_exception_refcount');
  assert(typeof wasmExports['__cxa_increment_exception_refcount'] !== 'undefined', 'missing Wasm export: __cxa_increment_exception_refcount');
  assert(typeof wasmExports['__get_exception_message'] !== 'undefined', 'missing Wasm export: __get_exception_message');
  assert(typeof wasmExports['__cxa_can_catch'] !== 'undefined', 'missing Wasm export: __cxa_can_catch');
  assert(typeof wasmExports['__cxa_get_exception_ptr'] !== 'undefined', 'missing Wasm export: __cxa_get_exception_ptr');
  assert(typeof wasmExports['memory'] !== 'undefined', 'missing Wasm export: memory');
  assert(typeof wasmExports['__indirect_function_table'] !== 'undefined', 'missing Wasm export: __indirect_function_table');
  _main = Module['_main'] = createExportWrapper('main', wasmExports['main'], 2);
  _fflush = createExportWrapper('fflush', wasmExports['fflush'], 1);
  _strerror = createExportWrapper('strerror', wasmExports['strerror'], 1);
  _emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'];
  _emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'];
  _free = createExportWrapper('free', wasmExports['free'], 1);
  _setThrew = createExportWrapper('setThrew', wasmExports['setThrew'], 2);
  __emscripten_tempret_set = createExportWrapper('_emscripten_tempret_set', wasmExports['_emscripten_tempret_set'], 1);
  _emscripten_stack_init = wasmExports['emscripten_stack_init'];
  _emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'];
  __emscripten_stack_restore = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'];
  ___cxa_decrement_exception_refcount = createExportWrapper('__cxa_decrement_exception_refcount', wasmExports['__cxa_decrement_exception_refcount'], 1);
  ___cxa_increment_exception_refcount = createExportWrapper('__cxa_increment_exception_refcount', wasmExports['__cxa_increment_exception_refcount'], 1);
  ___get_exception_message = createExportWrapper('__get_exception_message', wasmExports['__get_exception_message'], 3);
  ___cxa_can_catch = createExportWrapper('__cxa_can_catch', wasmExports['__cxa_can_catch'], 3);
  ___cxa_get_exception_ptr = createExportWrapper('__cxa_get_exception_ptr', wasmExports['__cxa_get_exception_ptr'], 1);
  memory = wasmMemory = wasmExports['memory'];
  __indirect_function_table = wasmTable = wasmExports['__indirect_function_table'];
}

var wasmImports = {
  /** @export */
  _ZN10ItemEntityC1EP5LevelfffRK12ItemInstance: __ZN10ItemEntityC1EP5LevelfffRK12ItemInstance,
  /** @export */
  _ZN10TileEntity6isTypeEPS_i: __ZN10TileEntity6isTypeEPS_i,
  /** @export */
  _ZN11FallingTileC1EP5Levelfffii: __ZN11FallingTileC1EP5Levelfffii,
  /** @export */
  _ZN12TripodCameraC1EP5LevelP6Playerfff: __ZN12TripodCameraC1EP5LevelP6Playerfff,
  /** @export */
  _ZN14SimpleFoodData3eatEP8FoodItem: __ZN14SimpleFoodData3eatEP8FoodItem,
  /** @export */
  _ZN16FillingContainer14removeResourceEi: __ZN16FillingContainer14removeResourceEi,
  /** @export */
  _ZN17TileEntityFactory16createTileEntityEi: __ZN17TileEntityFactory16createTileEntityEi,
  /** @export */
  _ZN20NetherReactorPattern9getTileAtEiii: __ZN20NetherReactorPattern9getTileAtEiii,
  /** @export */
  _ZN20NetherReactorPatternC1Ev: __ZN20NetherReactorPatternC1Ev,
  /** @export */
  _ZN23NetherReactorTileEntity9lightItUpEiii: __ZN23NetherReactorTileEntity9lightItUpEiii,
  /** @export */
  _ZN4I18n3getERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE: __ZN4I18n3getERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE,
  /** @export */
  _ZN5ArrowC1EP5LevelP3Mobf: __ZN5ArrowC1EP5LevelP3Mobf,
  /** @export */
  _ZN5Level10levelEventEP6Playeriiiii: __ZN5Level10levelEventEP6Playeriiiii,
  /** @export */
  _ZN5Level11addParticleERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEffffffi: __ZN5Level11addParticleERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEffffffi,
  /** @export */
  _ZN5Level11hasChunksAtEiiiiii: __ZN5Level11hasChunksAtEiiiiii,
  /** @export */
  _ZN5Level12getLevelDataEv: __ZN5Level12getLevelDataEv,
  /** @export */
  _ZN5Level13getBrightnessERK10LightLayeriii: __ZN5Level13getBrightnessERK10LightLayeriii,
  /** @export */
  _ZN5Level13getTileEntityEiii: __ZN5Level13getTileEntityEiii,
  /** @export */
  _ZN5Level13setTileEntityEiiiP10TileEntity: __ZN5Level13setTileEntityEiiiP10TileEntity,
  /** @export */
  _ZN5Level13setTilesDirtyEiiiiii: __ZN5Level13setTilesDirtyEiiiiii,
  /** @export */
  _ZN5Level14isUnobstructedERK4AABB: __ZN5Level14isUnobstructedERK4AABB,
  /** @export */
  _ZN5Level14setTileAndDataEiiiii: __ZN5Level14setTileAndDataEiiiii,
  /** @export */
  _ZN5Level15sendTileUpdatedEiii: __ZN5Level15sendTileUpdatedEiii,
  /** @export */
  _ZN5Level15setDataNoUpdateEiiii: __ZN5Level15setDataNoUpdateEiiii,
  /** @export */
  _ZN5Level15setTileNoUpdateEiiii: __ZN5Level15setTileNoUpdateEiiii,
  /** @export */
  _ZN5Level16getRawBrightnessEiii: __ZN5Level16getRawBrightnessEiii,
  /** @export */
  _ZN5Level16removeTileEntityEiii: __ZN5Level16removeTileEntityEiii,
  /** @export */
  _ZN5Level17addToTickNextTickEiiiii: __ZN5Level17addToTickNextTickEiiiii,
  /** @export */
  _ZN5Level17hasNeighborSignalEiii: __ZN5Level17hasNeighborSignalEiii,
  /** @export */
  _ZN5Level17updateNeighborsAtEiiii: __ZN5Level17updateNeighborsAtEiiii,
  /** @export */
  _ZN5Level22setTileAndDataNoUpdateEiiiii: __ZN5Level22setTileAndDataNoUpdateEiiiii,
  /** @export */
  _ZN5Level7explodeEP6Entityffffb: __ZN5Level7explodeEP6Entityffffb,
  /** @export */
  _ZN5Level7setDataEiiii: __ZN5Level7setDataEiiii,
  /** @export */
  _ZN5Level7setTileEiiii: __ZN5Level7setTileEiiii,
  /** @export */
  _ZN5Level8mayPlaceEiiiibh: __ZN5Level8mayPlaceEiiiibh,
  /** @export */
  _ZN5Level9addEntityEP6Entity: __ZN5Level9addEntityEP6Entity,
  /** @export */
  _ZN5Level9canSeeSkyEiii: __ZN5Level9canSeeSkyEiii,
  /** @export */
  _ZN5Level9playSoundEP6EntityRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEff: __ZN5Level9playSoundEP6EntityRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEff,
  /** @export */
  _ZN5Level9playSoundEfffRKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEff: __ZN5Level9playSoundEfffRKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEff,
  /** @export */
  _ZN5Sheep8setColorEi: __ZN5Sheep8setColorEi,
  /** @export */
  _ZN6Entity10intersectsEffffff: __ZN6Entity10intersectsEffffff,
  /** @export */
  _ZN6Entity10isPickableEv: __ZN6Entity10isPickableEv,
  /** @export */
  _ZN6Entity10isPushableEv: __ZN6Entity10isPushableEv,
  /** @export */
  _ZN6Entity10isSneakingEv: __ZN6Entity10isSneakingEv,
  /** @export */
  _ZN6Entity10outOfWorldEv: __ZN6Entity10outOfWorldEv,
  /** @export */
  _ZN6Entity11animateHurtEv: __ZN6Entity11animateHurtEv,
  /** @export */
  _ZN6Entity11isShootableEv: __ZN6Entity11isShootableEv,
  /** @export */
  _ZN6Entity11playerTouchEP6Player: __ZN6Entity11playerTouchEP6Player,
  /** @export */
  _ZN6Entity12isItemEntityEv: __ZN6Entity12isItemEntityEv,
  /** @export */
  _ZN6Entity12moveRelativeEfff: __ZN6Entity12moveRelativeEfff,
  /** @export */
  _ZN6Entity12shouldRenderER4Vec3: __ZN6Entity12shouldRenderER4Vec3,
  /** @export */
  _ZN6Entity13getBrightnessEf: __ZN6Entity13getBrightnessEf,
  /** @export */
  _ZN6Entity13getEntityDataEv: __ZN6Entity13getEntityDataEv,
  /** @export */
  _ZN6Entity13getHeadHeightEv: __ZN6Entity13getHeadHeightEv,
  /** @export */
  _ZN6Entity13getPickRadiusEv: __ZN6Entity13getPickRadiusEv,
  /** @export */
  _ZN6Entity13isUnderLiquidEPK8Material: __ZN6Entity13isUnderLiquidEPK8Material,
  /** @export */
  _ZN6Entity13playStepSoundEiiii: __ZN6Entity13playStepSoundEiiii,
  /** @export */
  _ZN6Entity13saveWithoutIdEP11CompoundTag: __ZN6Entity13saveWithoutIdEP11CompoundTag,
  /** @export */
  _ZN6Entity14awardKillScoreEPS_i: __ZN6Entity14awardKillScoreEPS_i,
  /** @export */
  _ZN6Entity14makeStuckInWebEv: __ZN6Entity14makeStuckInWebEv,
  /** @export */
  _ZN6Entity15causeFallDamageEf: __ZN6Entity15causeFallDamageEf,
  /** @export */
  _ZN6Entity15checkFallDamageEfb: __ZN6Entity15checkFallDamageEfb,
  /** @export */
  _ZN6Entity15interpolateTurnEff: __ZN6Entity15interpolateTurnEff,
  /** @export */
  _ZN6Entity15isHangingEntityEv: __ZN6Entity15isHangingEntityEv,
  /** @export */
  _ZN6Entity15setEquippedSlotEiii: __ZN6Entity15setEquippedSlotEiii,
  /** @export */
  _ZN6Entity15spawnAtLocationEP12ItemInstancef: __ZN6Entity15spawnAtLocationEP12ItemInstancef,
  /** @export */
  _ZN6Entity15spawnAtLocationEii: __ZN6Entity15spawnAtLocationEii,
  /** @export */
  _ZN6Entity15spawnAtLocationEiif: __ZN6Entity15spawnAtLocationEiif,
  /** @export */
  _ZN6Entity21isCreativeModeAllowedEv: __ZN6Entity21isCreativeModeAllowedEv,
  /** @export */
  _ZN6Entity22interactPreventDefaultEv: __ZN6Entity22interactPreventDefaultEv,
  /** @export */
  _ZN6Entity4burnEi: __ZN6Entity4burnEi,
  /** @export */
  _ZN6Entity4hurtEPS_i: __ZN6Entity4hurtEPS_i,
  /** @export */
  _ZN6Entity4loadEP11CompoundTag: __ZN6Entity4loadEP11CompoundTag,
  /** @export */
  _ZN6Entity4moveEfff: __ZN6Entity4moveEfff,
  /** @export */
  _ZN6Entity4pushEPS_: __ZN6Entity4pushEPS_,
  /** @export */
  _ZN6Entity4pushEfff: __ZN6Entity4pushEfff,
  /** @export */
  _ZN6Entity4saveEP11CompoundTag: __ZN6Entity4saveEP11CompoundTag,
  /** @export */
  _ZN6Entity4turnEff: __ZN6Entity4turnEff,
  /** @export */
  _ZN6Entity5resetEv: __ZN6Entity5resetEv,
  /** @export */
  _ZN6Entity6isFreeEfff: __ZN6Entity6isFreeEfff,
  /** @export */
  _ZN6Entity6isFreeEffff: __ZN6Entity6isFreeEffff,
  /** @export */
  _ZN6Entity6lerpToEfffffi: __ZN6Entity6lerpToEfffffi,
  /** @export */
  _ZN6Entity6moveToEfffff: __ZN6Entity6moveToEfffff,
  /** @export */
  _ZN6Entity6removeEv: __ZN6Entity6removeEv,
  /** @export */
  _ZN6Entity6setPosEP9EntityPos: __ZN6Entity6setPosEP9EntityPos,
  /** @export */
  _ZN6Entity6setPosEfff: __ZN6Entity6setPosEfff,
  /** @export */
  _ZN6Entity6setRotEff: __ZN6Entity6setRotEff,
  /** @export */
  _ZN6Entity7isAliveEv: __ZN6Entity7isAliveEv,
  /** @export */
  _ZN6Entity7setSizeEff: __ZN6Entity7setSizeEff,
  /** @export */
  _ZN6Entity8baseTickEv: __ZN6Entity8baseTickEv,
  /** @export */
  _ZN6Entity8interactEP6Player: __ZN6Entity8interactEP6Player,
  /** @export */
  _ZN6Entity8isInLavaEv: __ZN6Entity8isInLavaEv,
  /** @export */
  _ZN6Entity8isInWallEv: __ZN6Entity8isInWallEv,
  /** @export */
  _ZN6Entity8isOnFireEv: __ZN6Entity8isOnFireEv,
  /** @export */
  _ZN6Entity8isPlayerEv: __ZN6Entity8isPlayerEv,
  /** @export */
  _ZN6Entity8lavaHurtEv: __ZN6Entity8lavaHurtEv,
  /** @export */
  _ZN6Entity8markHurtEv: __ZN6Entity8markHurtEv,
  /** @export */
  _ZN6Entity8resetPosEb: __ZN6Entity8resetPosEb,
  /** @export */
  _ZN6Entity8setLevelEP5Level: __ZN6Entity8setLevelEP5Level,
  /** @export */
  _ZN6Entity9isInWaterEv: __ZN6Entity9isInWaterEv,
  /** @export */
  _ZN6EntityD2Ev: __ZN6EntityD2Ev,
  /** @export */
  _ZN6Player10canDestroyEP4Tile: __ZN6Player10canDestroyEP4Tile,
  /** @export */
  _ZN6Player14startUsingItemE12ItemInstancei: __ZN6Player14startUsingItemE12ItemInstancei,
  /** @export */
  _ZN6Player15getDestroySpeedEP4Tile: __ZN6Player15getDestroySpeedEP4Tile,
  /** @export */
  _ZN6Player15getSelectedItemEv: __ZN6Player15getSelectedItemEv,
  /** @export */
  _ZN6Player6isHurtEv: __ZN6Player6isHurtEv,
  /** @export */
  _ZN7ChickenC1EP5Level: __ZN7ChickenC1EP5Level,
  /** @export */
  _ZN7Feature10placeBlockEP5Leveliiii: __ZN7Feature10placeBlockEP5Leveliiii,
  /** @export */
  _ZN7Feature10placeBlockEP5Leveliiiii: __ZN7Feature10placeBlockEP5Leveliiiii,
  /** @export */
  _ZN7FeatureC2Eb: __ZN7FeatureC2Eb,
  /** @export */
  _ZN8PaintingC1EP5Leveliiii: __ZN8PaintingC1EP5Leveliiii,
  /** @export */
  _ZN9HitResultC1ERKS_: __ZN9HitResultC1ERKS_,
  /** @export */
  _ZN9HitResultC1EiiiiRK4Vec3: __ZN9HitResultC1EiiiiRK4Vec3,
  /** @export */
  _ZN9HitResultC1Ev: __ZN9HitResultC1Ev,
  /** @export */
  _ZN9Inventory11getSelectedEv: __ZN9Inventory11getSelectedEv,
  /** @export */
  _ZN9PrimedTntC1EP5Levelfff: __ZN9PrimedTntC1EP5Levelfff,
  /** @export */
  _ZN9Throwable10getAuxDataEv: __ZN9Throwable10getAuxDataEv,
  /** @export */
  _ZN9Throwable10getGravityEv: __ZN9Throwable10getGravityEv,
  /** @export */
  _ZN9Throwable10lerpMotionEfff: __ZN9Throwable10lerpMotionEfff,
  /** @export */
  _ZN9Throwable13getThrowPowerEv: __ZN9Throwable13getThrowPowerEv,
  /** @export */
  _ZN9Throwable19getShadowHeightOffsEv: __ZN9Throwable19getShadowHeightOffsEv,
  /** @export */
  _ZN9Throwable20addAdditonalSaveDataEP11CompoundTag: __ZN9Throwable20addAdditonalSaveDataEP11CompoundTag,
  /** @export */
  _ZN9Throwable21getThrowUpAngleOffsetEv: __ZN9Throwable21getThrowUpAngleOffsetEv,
  /** @export */
  _ZN9Throwable22readAdditionalSaveDataEP11CompoundTag: __ZN9Throwable22readAdditionalSaveDataEP11CompoundTag,
  /** @export */
  _ZN9Throwable25shouldRenderAtSqrDistanceEf: __ZN9Throwable25shouldRenderAtSqrDistanceEf,
  /** @export */
  _ZN9Throwable4tickEv: __ZN9Throwable4tickEv,
  /** @export */
  _ZN9ThrowableC2EP5LevelP3Mob: __ZN9ThrowableC2EP5LevelP3Mob,
  /** @export */
  _ZNK5Sheep8getColorEv: __ZNK5Sheep8getColorEv,
  /** @export */
  _ZNK5Sheep9isShearedEv: __ZNK5Sheep9isShearedEv,
  /** @export */
  _ZNK6Entity13getEntityDataEv: __ZNK6Entity13getEntityDataEv,
  /** @export */
  _ZNK9LevelData11getGameTypeEv: __ZNK9LevelData11getGameTypeEv,
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  __cxa_begin_catch: ___cxa_begin_catch,
  /** @export */
  __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
  /** @export */
  __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
  /** @export */
  __cxa_throw: ___cxa_throw,
  /** @export */
  __resumeException: ___resumeException,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  clock_time_get: _clock_time_get,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  invoke_f,
  /** @export */
  invoke_fi,
  /** @export */
  invoke_ii,
  /** @export */
  invoke_iif,
  /** @export */
  invoke_iii,
  /** @export */
  invoke_iiiff,
  /** @export */
  invoke_iiifff,
  /** @export */
  invoke_iiifffi,
  /** @export */
  invoke_iiifffii,
  /** @export */
  invoke_iiii,
  /** @export */
  invoke_iiiif,
  /** @export */
  invoke_iiiiff,
  /** @export */
  invoke_iiiifff,
  /** @export */
  invoke_iiiii,
  /** @export */
  invoke_iiiiif,
  /** @export */
  invoke_iiiiii,
  /** @export */
  invoke_iiiiiii,
  /** @export */
  invoke_v,
  /** @export */
  invoke_vi,
  /** @export */
  invoke_viffffff,
  /** @export */
  invoke_vii,
  /** @export */
  invoke_viiffffffi,
  /** @export */
  invoke_viii,
  /** @export */
  invoke_viiiff,
  /** @export */
  invoke_viiii
};

function invoke_vii(index,a1,a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffffff(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiifffi(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiff(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiff(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iif(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_f(index) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiifff(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiff(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index,a1) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiifffii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiif(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_fi(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiif(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiifff(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_v(index) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var calledRun;

function callMain() {
  assert(typeof onPreRuns === 'undefined' || onPreRuns.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = _main;

  var argc = 0;
  var argv = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

async function run() {
  assert(!calledRun);
  calledRun = true;

  stackCheckInit();

  preRun();

  var setStatus = Module['setStatus'];
  if (setStatus) {
    setStatus('Running...');
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise((resolve) => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, '');
  }

  if (ABORT) return;

  initRuntime();

  // No ATMAINS hooks

  Module['onRuntimeInitialized']?.();
  consumedModuleProp('onRuntimeInitialized');

  var noInitialRun = Module['noInitialRun'] || false;
  if (!noInitialRun) callMain();

  postRun();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

var wasmExports;

// With async instantation wasmExports is assigned asynchronously when the
// instance is received.
createWasm().then(() => run());

// end include: postamble.js

