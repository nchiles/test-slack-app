const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.command('/maint', async ({ ack, body, client, payload }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await openModal(body, client); 
    console.log(JSON.stringify(payload))
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});


app.shortcut('open_modal', async ({ shortcut, ack, client, payload }) => {
  try {
    // Acknowledge shortcut request
    await ack();
    // Call the views.open method using one of the built-in WebClients
    const result = await openModal(shortcut, client, payload); 
    // console.log(JSON.stringify(payload))
    // console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

function openModal(triggerSource, client, payload) {
  // console.log('stringified payload from modal: ' + JSON.stringify(payload))
  // const user = payload.user.username;
  // console.log('modal user: ' + user)
  return client.views.open({
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: triggerSource.trigger_id,
    // View payload
    view: {
      "title": {
        "type": "plain_text",
        "text": "Maintenance Request"
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit"
      },
      "blocks": [
        // Name Input
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Name",
            "emoji": true
          }
        },
        // Issue Input
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "multiline": true,
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Describe the issue",
            "emoji": true
          }
        },
        // Department Input
        {
          "type": "input",
          "element": {
            "type": "external_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select an department",
              "emoji": true
            },
            "action_id": "external_select-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Department",
            "emoji": true
          }
        }
      ],
      "type": "modal"
    }
  });
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();


