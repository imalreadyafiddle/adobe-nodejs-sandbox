// require the AT Node.js SDK
const TargetClient = require("@adobe/target-nodejs-sdk");

// set clientCode, orgID, property, and mbox name constants
const clientCode = "experienceedgeearlya";
const orgId = "53A16ACB5CC1D3760A495C99@AdobeOrg";
const propertyToken = "63a46bbc-26cb-7cc3-def0-9ae1b51b6c62";

// configure AT
const targetConfig = {
  client: clientCode,
  organizationId: orgId,
};

// initiate AT client
const targetClient = TargetClient.create(targetConfig);

// request object design
let request = {
  "context": {
    "channel": "web"
  },
  "property": {
    "token": propertyToken
  },
  "execute": {
    "pageLoad": {
      "parameters": {}
    },
    "mboxes": [
      
    ]
  }
};


const onTargetClientReady = function (mbox) {
  // make getOffers call using request object, using returned response
  request.execute.mboxes.push({"name":mbox})
  return targetClient.getOffers({request}).then((data) => {
    let response = data.response;
    // only execute if the response is 200 OK
    if (response.status === 200) {
      const mboxes = response.execute.mboxes;
      const targetExp = validateExperience(mboxes, mbox);
      
      const responseObj = {
        tokens: JSON.stringify(targetExp.options[targetExp.options.length-1].responseTokens),
        content: targetExp.options[targetExp.options.length-1].content
      };
      // we need to return the mbox name passed into the function.
      return responseObj;
    } else {
      // return null if no 200 response
      return null;
    }
  }).catch((err) => {
    // log an error to the console if above fails
    console.log("Response Error:\n", err);
  });
}


const validateExperience = function (targetMboxes, mboxName) {
  try {
    if (targetMboxes.length > 0) {
      for (let i = 0; i < targetMboxes.length; i++) {
        if (targetMboxes[i].name === mboxName && typeof targetMboxes[i].options !== undefined) {
          return targetMboxes[i];
        } else {
          return null
        }
      }
    }
  } catch (err) {
    console.log("Error: Validate Experience:\n", err);
    return null;
  }
}

module.exports = {onTargetClientReady}