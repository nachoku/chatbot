var util = require('util');
var builder = require('botbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var lib = new builder.Library('shop');



var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';



lib.dialog('/', [

    function(session, args, next){
        if ('Checkout'===(session.message.text)) {
            console.log("fewufhowefoiwfjoiwef------");
        // Order Flowers
        next();
        }
        builder.Prompts.text(session, "What would you like?");
        
        
    },


    function (session, args, next) {
        // Retrieve address, continue to shop
        if ('Checkout'===(session.message.text)) {
            console.log("fewufhowefoiwfjoiwef------");
        // Order Flowers
        next();
        }

        console.log('Shit starts hre');
        console.log(session.message);

        xhr.open("GET", model+session.message.text, false);
        xhr.send(xhr.responseText);
        console.log(xhr.responseText)
        var json = JSON.parse(xhr.responseText);
        input=json["entities"][0]["entity"];
        session.message.text=input
        xhr.open("GET", model+session.message.text, false);

        var search = builder;
        // console.log("result");
        // console.log(search);
        // search = args.response;
        session.message.search=search;
        session.beginDialog('product-selection:/', {search : search});
    },


    function (session, args, next) {
        // Ask for delivery address using 'address' library
        if ('Checkout'===(session.message.text)) {
            console.log("fewufhowefoiwfjoiwef------");
        // Order Flowers
        next();
        }

        var Check=localizedRegex(session, ['Checkout']);
        

        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "Shop More", "Shop More"),
            builder.CardAction.imBack(session, "Checkout", "Checkout")
        ]);

        session.send(new builder.Message(session)
        .addAttachment(welcomeCard));


        
    },

    function(session, args,next)
    {
        session.beginDialog('cart:/');
    },

    function (session) {
        // Ask for delivery address using 'address' library
        session.beginDialog('address:/',
            {
                promptMessage: session.gettext('provide_delivery_address', session.message.user.name || session.gettext('default_user_name'))
            });
    },


    // function (session, args) {
    //     // Retrieve address, continue to shop
    //     session.dialogData.recipientAddress = args.address;
    //     session.beginDialog('product-selection:/');
    // },
    function (session, args) {
        // Retrieve selection, continue to delivery date
        console.log('===========================================================================');
        session.dialogData.selection = args.selection;
        session.beginDialog('delivery:date');
    },
    function (session, args) {
        // Retrieve deliveryDate, continue to details
        session.dialogData.deliveryDate = args.deliveryDate;
        session.dialogData.recipientSize = args.recipientSize;
        console.log(session.dialogData);
        session.send('confirm_choice', session.dialogData.selection.name, session.dialogData.recipientSize, session.dialogData.deliveryDate.toLocaleDateString());
        session.beginDialog('details:/');
    },
    function (session, args) {
        // Retrieve details, continue to billing address
        session.dialogData.details = args.details;
        session.beginDialog('address:billing');
    },
    function (session, args, next) {
        // Retrieve billing address
        session.dialogData.billingAddress = args.billingAddress;
        next();
    },
    function (session, args) {
        // Continue to checkout
        var order = {
            selection: session.dialogData.selection,
            delivery: {
                date: session.dialogData.deliveryDate,
                address: session.dialogData.recipientAddress
            },
            details: session.dialogData.details,
            billingAddress: session.dialogData.billingAddress
        };

        console.log('order', order);
        session.beginDialog('checkout:/', { order: order });
    }
]);

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

var LocalizedRegexCache = {};
function localizedRegex(session, localeKeys) {
    var locale = session.preferredLocale();
    var cacheKey = locale + ":" + localeKeys.join('|');
    if (LocalizedRegexCache.hasOwnProperty(cacheKey)) {
        return LocalizedRegexCache[cacheKey];
    }

    var localizedStrings = localeKeys.map(function (key) { return session.localizer.gettext(locale, key); });
    var regex = new RegExp('^(' + localizedStrings.join('|') + ')', 'i');
    LocalizedRegexCache[cacheKey] = regex;
    return regex;
}