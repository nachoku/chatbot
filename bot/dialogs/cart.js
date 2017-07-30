var builder = require('botbuilder');



var lib = new builder.Library('cart');


lib.dialog('/',
[
    function (session, args, next) {
        session.send('Here is your cart');
        next();
    },
    function (session, args) {
        session.send("second");
    },
    function (session, args) {
        session.dialogData.recipientLastName = args.response;
        session.beginDialog('validators:phonenumber', {
            prompt: session.gettext('ask_recipient_phone_number'),
            retryPrompt: session.gettext('invalid_phone_number')
        });
    },
    function (session, args) {
        session.dialogData.recipientPhoneNumber = args.response;
        session.beginDialog('validators:notes', {
            prompt: session.gettext('ask_note'),
            retryPrompt: session.gettext('invalid_note')
        });
    },
    function (session, args) {
        session.dialogData.note = args.response;
        session.beginDialog('sender');
    },
    function (session, args) {
        session.dialogData.sender = args.sender;
        var details = {
            recipient: {
                firstName: session.dialogData.recipientFirstName,
                lastName: session.dialogData.recipientLastName,
                phoneNumber: session.dialogData.recipientPhoneNumber
            },
            note: session.dialogData.note,
            sender: session.dialogData.sender
        };
        session.endDialogWithResult({ details: details });
    }
]);

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};