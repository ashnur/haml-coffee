// Generated by CoffeeScript 1.6.2
(function() {
  var CoffeeMaker, CoffeeScript, findit, fs, green, optimist, red, reset;

  CoffeeScript = require('coffee-script');

  CoffeeMaker = require('./coffee-maker');

  fs = require('fs');

  findit = require('findit');

  red = '\u001b[31m';

  green = '\u001b[32m';

  reset = '\u001b[0m';

  optimist = require('optimist').usage('Usage: $0').options('i', {
    alias: 'input',
    describe: 'Either a file or a directory name to be compiled'
  }).options('o', {
    alias: 'output',
    describe: 'Set the output filename'
  }).options('n', {
    alias: 'namespace',
    describe: 'Set a custom template namespace',
    "default": 'window.HAML'
  }).options('t', {
    alias: 'template',
    describe: 'Set a custom template name'
  }).options('b', {
    alias: 'basename',
    boolean: true,
    "default": false,
    describe: 'Ignore file path when generate the template name'
  }).options('f', {
    alias: 'format',
    "default": 'html5',
    describe: 'Set HTML output format, either `xhtml`, `html4` or `html5`'
  }).options('u', {
    alias: 'uglify',
    boolean: true,
    "default": false,
    describe: 'Do not properly indent or format the HTML output'
  }).options('e', {
    alias: 'extend',
    boolean: true,
    "default": false,
    describe: 'Extend the template scope with the context'
  }).options('p', {
    alias: 'placement',
    "default": 'global',
    describe: 'Where to place the template function; one of: global, amd'
  }).options('d', {
    alias: 'dependencies',
    "default": "{ hc: 'hamlcoffee' }",
    describe: 'The global template amd module dependencies'
  }).options('preserve', {
    "default": 'pre,textarea',
    describe: 'Set a comma separated list of HTML tags to preserve'
  }).options('autoclose', {
    "default": 'meta,img,link,br,hr,input,area,param,col,base',
    describe: 'Set a comma separated list of self-closed HTML tags'
  }).options('hyphenate-data-attrs', {
    boolean: true,
    describe: 'Convert underscores to hyphens for data attribute keys'
  }).options('disable-html-attribute-escaping', {
    boolean: true,
    "default": true,
    describe: 'Disable any HTML attribute escaping'
  }).options('disable-html-escaping', {
    boolean: true,
    describe: 'Disable any HTML escaping'
  }).options('disable-clean-value', {
    boolean: true,
    describe: 'Disable any CoffeeScript code value cleaning'
  }).options('custom-html-escape', {
    "default": '',
    describe: 'Set the custom HTML escaping function name'
  }).options('custom-preserve', {
    "default": '',
    describe: 'Set the custom preserve whitespace function name'
  }).options('custom-find-and-preserve', {
    "default": '',
    describe: 'Set the custom find and preserve whitespace function name'
  }).options('custom-clean-value', {
    "default": '',
    describe: 'Set the custom code value clean function name'
  }).options('custom-surround', {
    "default": '',
    describe: 'Set the custom surround function name'
  }).options('custom-succeed', {
    "default": '',
    describe: 'Set the custom succeed function name'
  }).options('custom-precede', {
    "default": '',
    describe: 'Set the custom precede function name'
  }).options('custom-reference', {
    "default": '',
    describe: 'Set the custom object reference function name'
  });

  exports.run = function() {
    var argv, compilerOptions, dependencies, err, inputFilename, namespace, source, templateName;

    argv = optimist.argv;
    if (['xhtml', 'html4', 'html5'].indexOf(argv.f) === -1) {
      throw new Error("Unknown template format '" + argv.f + "'");
    }
    inputFilename = argv.i;
    templateName = argv.t;
    namespace = argv.n;
    dependencies = {};
    try {
      dependencies = CoffeeScript["eval"](argv.d);
    } catch (_error) {
      err = _error;
      console.error("  " + red + "[Haml Coffee] Invalid dependencies:" + reset + " %s (%s)", argv.d, err);
    }
    compilerOptions = {
      placement: argv.p,
      dependencies: dependencies,
      format: argv.f,
      uglify: argv.u,
      extendScope: argv.e,
      preserveTags: argv.preserve,
      escapeHtml: !argv['disable-html-escaping'],
      escapeAttributes: !argv['disable-html-attribute-escaping'],
      cleanValue: !argv['disable-clean-value'],
      hyphenateDataAttrs: argv['hyphenate-data-attrs'],
      customHtmlEscape: argv['custom-html-escape'],
      customCleanValue: argv['custom-clean-value'],
      customFindAndPreserve: argv['custom-find-and-preserve'],
      customPreserve: argv['custom-preserve'],
      customSurround: argv['custom-surround'],
      customSucceed: argv['custom-succeed'],
      customPrecede: argv['custom-precede'],
      customReference: argv['custom-reference'],
      basename: argv['basename']
    };
    if (inputFilename) {
      return fs.stat(inputFilename, function(err, stat) {
        var baseDir, compound, filename, outputFilename, _i, _len, _ref, _ref1, _ref2;

        if (!err) {
          if (!stat.isDirectory()) {
            outputFilename = argv.o || ("" + ((_ref = argv.i.match(/([^\.]+)(\.html)?\.haml[c]?$/)) != null ? _ref[1] : void 0) + ".jst");
            console.error("  " + green + "[Haml Coffee] Compiling file" + reset + " %s to %s", inputFilename, outputFilename);
            fs.writeFileSync(outputFilename, CoffeeMaker.compileFile(inputFilename, compilerOptions, namespace, templateName));
            return process.exit(0);
          } else {
            if (templateName) {
              console.error("  " + red + "[Haml Coffee] You can\'t compile all Haml templates in a directory and give a single template name!" + reset);
              process.exit(1);
            }
            console.log("  " + green + "[Haml Coffee] Compiling directory" + reset + " %s", inputFilename);
            baseDir = inputFilename.replace(/\/$/, '');
            compound = '';
            _ref1 = findit.sync(baseDir);
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              filename = _ref1[_i];
              if (filename.match(/([^\.]+)(\.html)?\.haml[c]?$/)) {
                if (argv.o) {
                  console.log("    " + green + "[Haml Coffee] Compiling file" + reset + " %s", filename);
                  compound += CoffeeMaker.compileFile(filename, compilerOptions, namespace);
                } else {
                  outputFilename = "" + ((_ref2 = filename.match(/([^\.]+)(\.html)?\.haml[c]?$/)) != null ? _ref2[1] : void 0) + ".jst";
                  console.log("  " + green + "[Haml Coffee] Compiling file" + reset + " %s to %s", inputFilename, outputFilename);
                  fs.writeFileSync(outputFilename, CoffeeMaker.compileFile(filename, compilerOptions));
                }
              }
            }
            if (argv.o) {
              console.log("    " + green + "[Haml Coffee] Writing all templates to" + reset + " %s", argv.o);
              fs.writeFileSync(argv.o, compound);
            }
            return process.exit(0);
          }
        } else {
          console.error("  " + red + "[Haml Coffee] Error compiling file" + reset + " %s: %s", argv.i, err);
          return process.exit(1);
        }
      });
    } else if (argv.help) {
      return console.log(optimist.help());
    } else {
      if (require('tty').isatty(process.stdin)) {
        console.log('Please enter template source code and press Ctrl-D to generate:\n');
      }
      source = '';
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function(chunk) {
        return source += chunk;
      });
      return process.stdin.on('end', function() {
        console.log('\n');
        return process.stdout.write(CoffeeMaker.compile(source, templateName || 'test', namespace, compilerOptions));
      });
    }
  };

}).call(this);
