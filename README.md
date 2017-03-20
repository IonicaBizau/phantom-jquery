
[![phantom-jquery](http://i.imgur.com/s2eKXAp.png)](#)

# phantom-jquery

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Version](https://img.shields.io/npm/v/phantom-jquery.svg)](https://www.npmjs.com/package/phantom-jquery) [![Downloads](https://img.shields.io/npm/dt/phantom-jquery.svg)](https://www.npmjs.com/package/phantom-jquery)

> Access DOM elements using jQuery in PhantomJS.

This project could be useful in scraping websites easily or in unit testing.

## :cloud: Installation

```sh
$ npm i --save phantom-jquery
```


## :clipboard: Example



```js
// Dependencies
var phJQuery = require("phantom-jquery");

// Open my website
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

## :memo: Documentation


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



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)

Thanks! :heart:


## :cake: Thanks
This project is heavily inspired from [`jquery.go.js`](https://github.com/travist/jquery.go.js) by [**@travist**](https://github.com/travist). :cake:


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[badge_patreon]: http://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: http://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: http://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: http://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(https%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
