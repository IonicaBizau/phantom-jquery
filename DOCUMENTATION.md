## Documentation

You can see below the API reference of this module.

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

