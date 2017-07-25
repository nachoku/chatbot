var builder = require('botbuilder');

// Main dialog with LUIS
var lib = new builder.Library('search');



var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&verbose=true&timezoneOffset=0';
var recognizer = new builder.LuisRecognizer(model);

/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/

console.log('Trying.......');
var intents = new builder.IntentDialog({ recognizers: [recognizer] })


.matches('footwear', (session, args) =>
{
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
})


.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

lib.dialog('/', intents).triggerAction({
    matches: 'search',
    onInterrupted: function (session) {
        session.send('Enter Search');
    }
}); 



// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};