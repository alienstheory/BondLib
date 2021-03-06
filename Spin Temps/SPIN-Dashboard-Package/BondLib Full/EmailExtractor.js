var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var emails = [];
var events = require('events');


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
//processClientsecrets
// Load client secrets from a local file.
var read = function(broker) {
fs.readFile('client_secret.json', function processClientsecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  //authorize(JSON.parse(content), listMessages);
  authorize(JSON.parse(content), listMessages, broker);

});
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, broker) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      //callback("me","from:lbelf@bloomberg.net")

       callback(oauth2Client, broker);
    }
  });
}


function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      //console.log(callback.toString())
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the messages in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


function listMessages(auth, broker) {

  var prom = Promise.Resolve({then: function() {
    gmail.users.messages.list({
    q:'lbelf@bloomberg.net',
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    if(response.messages.length === 0) {
      console.log("line 120 ")
    }
    else {
      Promise.resolve(response.messages);


      return response.messages;
      }
    })

    })
}








    // if (messages.length === 0) {
    //   console.log("No messages found");
    // } else {
    //   for (var i = 0; i < messages.length; i++) {
    //     var msgId = messages[i];
    //     gmail.users.messages.get({
    //       id: msgId,
    //       auth: auth,
    //       userId:'me'
    //     }, function(err, response) {
    //         if(err) {
    //          console.log("This is an error message " + err);
    //          return;
    //         }
    //         else {
    //           try {
    //             console.log(response);
    //             var b = Buffer.from(response.payload.body.data.toString(),'base64');
    //             email[msgId] = b.toString();
    //           }
    //           catch(e) {
    //             console.log("error fetching messages");
    //           }

    //         }

    //     })

//       }

//         }
//      }

//   );
// }


 module.exports = {


    'runExtractor' : function(broker) {
      read(broker);
     // console.log(emails);
      return emails;
    }


 // return module;

 };




