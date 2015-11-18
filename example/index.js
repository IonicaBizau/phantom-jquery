// Dependencies
var phJQuery = require("../lib");

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
