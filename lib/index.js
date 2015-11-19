"use strict";

// Dependencies
const ghosty = require("ghosty")
    , sliced = require("sliced")
    , ul = require("ul")
    , jQueryPath = require.resolve("jquery")
    , jQueryMethods = require("./jQuery-methods")
    ;

// This function takes care to start the Phantom process only once
var openPhantom = ghosty.create;

// Public interface
var PhantomJQuery = module.exports = {

    /**
     * open
     * Opens the specified document.
     *
     * @name open
     * @function
     * @param {String} url The page to open.
     * @param {Object} options An object containing:
     *
     *  - `include_jquery` (Boolean): If `false`, it will not re-inject jQuery on the page (default: `true`).
     *
     * @param {Function} callback The callback function.
     */
    open (url, options, callback) {

        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        options = ul.merge(options, {
            include_jquery: true
        });

        var jQueryInject = function (page, fn) {
            if (options.include_jquery === false) {
                return fn(null);
            }
            page.injectJs(jQueryPath, function (success) {
                fn(!success ? new Error("Failed to load jQuery.") : null);
            });
        };

        // Open phantom
        openPhantom(ph => {
            // Create the page
            ph.createPage(page => {
                // Open the url
                page.open(url, status => {
                    if (status === "fail") {
                        return callback(new Error("Failed to load the page."), page, ph, status);
                    }
                    jQueryInject(page, err => {
                        if (err) { return callback(err); }
                        var jq = PhantomJQuery.jQueryFn(ph, page, status);
                        callback(null, jq, page, ph, status);
                    });
                });
            });
        });
    }

    /**
     * jQueryFn
     * This function creates the jQuery-like function.
     *
     * @name jQueryFn
     * @function
     * @param {Phantom} ph The Phantom object.
     * @param {PhantomPage} page The Phantom page object.
     * @param {String} status The page status (most probably `"success"`).
     * @return {Function} The jQuery-like function.
     */
  , jQueryFn (ph, page, status) {
        return function () {
            var args = sliced(arguments);
            return new jQueryInterface(ph, page, status, args);
        };
    }

    /**
     * wrapElement
     * Converts an jQueryInterface instance into jQuery-like function.
     *
     * @name wrapElement
     * @function
     * @param {jQueryInterface} elm The jQueryInterface element.
     * @return {Function} The jQuery-like function.
     */
  , wrapElement (elm) {
        return PhantomJQuery.jQueryFn(elm._ph, elm._page, elm._status);
    }

    /**
     * addJQueryMethod
     * Extends the jQueryInterface with new fields.
     *
     * @name addJQueryMethod
     * @function
     * @param {Object} cField An object containing:
     *
     *  - `field` (String): The field name.
     *  - `type` (String): The field type (e.g. `function`).
     *
     */
  , addJQueryMethod (cField) {
        jQueryInterface.prototype[cField.field] = function () {
            var args = sliced(arguments)
              , jQueryArgs = args.slice(0, -1)
              , cb = args[args.length - 1]
              ;

            return this[evaluate]({
                method: cField.field
              , methArgs: jQueryArgs
              , args: this._args
              , is_func: cField.type === "function"
            }, cb);
        };
    }
};

// Keep the evaluate as private method
var evaluate = Symbol();

// This is not exposed to the public
class jQueryInterface {
    /**
     * jQueryInterface
     * This class provides a jQuery-like functionality, having an async interface.
     *
     * Instances of this class will have the jQuery methods, that will be used like this:
     *
     * ```js
     * $(".my-class").text(function (text) {
     *   // Do something with .my-class text
     * });
     * ```
     *
     * Or if you like to set the text, provide the text string as first argument:
     *
     * ```js
     * $(".my-class").text("text to set", function () {
     *   // Do something after setting the text
     * });
     * ```
     *
     * Note that as long the Phantom's `evaluate` method is async, all these methods will be async.
     *
     * @name jQueryInterface
     * @function
     * @param {Phantom} ph The Phantom object.
     * @param {PhantomPage} page The Phantom page object.
     * @param {String} status The page status (most probably `"success"`).
     * @param {Array} args The arguments to call the jQuery function with.
     * @return {jQueryInterface} The jQuery async interface.
     */
    constructor (ph, page, status, args) {
        this._ph = ph;
        this._page = page;
        this._status = status;
        this._args = args;
        this[evaluate] = function (fnData, callback) {
            // Note that PhantomJS doesn't support (yet) array functions,
            // so, we just use the simple function
            return this._page.evaluate(function (data) {
                var args = data.args
                  , meth = data.method
                  , methArgs = data.methArgs
                  , $elm = (window.$ || window.jQuery).apply(this, args)
                  ;

                if (data.is_func) {
                    return $elm[meth].apply($elm, methArgs);
                }

                return $elm[meth];
            }, callback, fnData);
        };
    }
}

// Initialize the jQuery interface
jQueryMethods.forEach(PhantomJQuery.addJQueryMethod);

// Overrides
// If you observe a limitation in current implementation (I'm sure there are),
// fix it here by creating an override

/**
 * eq
 * Get the element at specified index.
 *
 * @name eq
 * @function
 * @param {Number} index The index of the element.
 * @param {Function} callback The callback function.
 */
jQueryInterface.prototype.eq = function (index, callback) {
    var jq = PhantomJQuery.wrapElement(this)
      , args = ul.clone(this._args)
      ;

    args[0] += ":eq(" + index + ")";

    callback(jq.apply(this, args));
};

/**
 * each
 * Iterate the elements.
 *
 * @name each
 * @function
 * @param {Function} callback The callback function (called for each element).
 *
 *     You can use it like this:
 *
 *     ```js
 *     $(".items .item").each(function (current_item, index, next) {
 *         current_item.text(function (text) {
 *            // Do something with the item's text, then go to the next element
 *            console.log(text);
 *            next();
 *         });
 *     }, function () {
 *         console.log("All elements were iterated.");
 *     });
 *     ```
 *
 * @param {Function} done This function is called when the elements' iteration was ended.
 */
jQueryInterface.prototype.each = function (callback, done) {

    var self = this;
    callback = callback || function () {};
    done = done || function () {};

    function doSeq(index) {
        self.length(function (length) {
            if (index === length) {
                return done();
            }
            self.eq(index, function (elm) {
                if (callback.length === 3) {
                    return callback(elm, index, function () {
                        doSeq(index + 1);
                    });
                }
                callback(elm, index);
            });
        });
    }

    doSeq(0);
};


PhantomJQuery.jQueryInterface = jQueryInterface;
