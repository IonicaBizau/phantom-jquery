[![phantom-jquery](http://i.imgur.com/s2eKXAp.png)](#)

# phantom-jquery [![Support this project][donate-now]][paypal-donations]

Access DOM elements using jQuery in PhantomJS.

This project could be useful in scraping websites easily or in unit testing.

## Installation

```sh
$ npm i phantom-jquery
```

## Example

```js
// Dependencies
var phJQuery = require("phantom-jquery");

// Open Google.com
phJQuery.open("http://ionicabizau.net", (err, $, page, ph) => {

    // Handle error
    if (err) { return console.log(err); }

    // Iterate the link elements
    $("a").each((currentLink, index, next) => {

        // Get the current link text
        currentLink.text(text => {

            // Get the curent link href
            currentLink.attr("href", href => {

                // Show the text and the href
                console.log("Index: " + index + " [" + text + "](" + href + ")")

                // Go to the next link
                next();
            });
        });
    }, () => {
        ph.exit();
    });
});

// => Index: 0 [Blog](/)
// => Index: 1 [About](/about)
// => Index: 2 [FAQ](/faq)
// => Index: 3 [Contact](/contact)
// => Index: 4 [How to convert JSON to Markdown using json2md](/blog/27-how-to-convert-json-to-markdown-using-json2md)
// ...
// => Index: 27 [](http://bitbucket.com/IonicaBizau)
// => Index: 28 [](http://twitter.com/IonicaBizau)
// => Index: 29 [](http://youtube.com/IonicaBizau)
```

## Documentation

### `open(url, options, callback)`
Opens the specified document.

#### Params
- **String** `url`: The page to open.
- **Object** `options`: An object containing:
 - `include_jquery` (Boolean): If `false`, it will not re-inject jQuery on the page (default: `true`).
- **Function** `callback`: The callback function.

### `jQueryFn(ph, page, status)`
This function creates the jQuery-like function.

#### Params
- **Phantom** `ph`: The Phantom object.
- **PhantomPage** `page`: The Phantom page object.
- **String** `status`: The page status (most probably `"success"`).

#### Return
- **Function** The jQuery-like function.

### `wrapElement(elm)`
Converts an jQueryInterface instance into jQuery-like function.

#### Params
- **jQueryInterface** `elm`: The jQueryInterface element.

#### Return
- **Function** The jQuery-like function.

### `addJQueryMethod(cField)`
Extends the jQueryInterface with new fields.

#### Params
- **Object** `cField`: An object containing:
 - `field` (String): The field name.
 - `type` (String): The field type (e.g. `function`).

### `jQueryInterface(ph, page, status, args)`
This class provides a jQuery-like functionality, having an async interface.

Instances of this class will have the jQuery methods, that will be used like this:

```js
$(".my-class").text(function (text) {
  // Do something with .my-class text
});
```

Or if you like to set the text, provide the text string as first argument:

```js
$(".my-class").text("text to set", function () {
  // Do something after setting the text
});
```

Note that as long the Phantom's `evaluate` method is async, all these methods will be async.

#### Params
- **Phantom** `ph`: The Phantom object.
- **PhantomPage** `page`: The Phantom page object.
- **String** `status`: The page status (most probably `"success"`).
- **Array** `args`: The arguments to call the jQuery function with.

#### Return
- **jQueryInterface** The jQuery async interface.

### `eq(index, callback)`
Get the element at specified index.

#### Params
- **Number** `index`: The index of the element.
- **Function** `callback`: The callback function.

### `each(callback, done)`
Iterate the elements.

#### Params
- **Function** `callback`: The callback function (called for each element).
    You can use it like this:

    ```js
    $(".items .item").each(function (current_item, index, next) {
        current_item.text(function (text) {
           // Do something with the item's text, then go to the next element
           console.log(text);
           next();
        });
    }, function () {
        console.log("All elements were iterated.");
    });
    ```
- **Function** `done`: This function is called when the elements' iteration was ended.

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Thanks
This project is heavily inspired from [`jquery.go.js`](https://github.com/travist/jquery.go.js) by [**@travist**](https://github.com/travist). :cake:

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

## License

MIT © [Ionică Bizău][website]

[website]: http://ionicabizau.net
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
