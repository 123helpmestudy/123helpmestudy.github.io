import { sleep } from './../utils.js';
import { apiCall } from './../api.js';


async function captureChatMessage() {
  // Define session and user variables if not already populated
  let sessionId = new Date();
  sessionId = sessionId.getTime();
  let localSessionId = localStorage.getItem('123helpmestudy-messenger-session-id');
  if (localSessionId == null) {
      localStorage.setItem('123helpmestudy-messenger-session-id', `${sessionId}`);
      localSessionId = `${sessionId}`;
  }
  let localSenderId = localStorage.getItem('123helpmestudy-messenger-sender-id');
  if (localSenderId == null) {
      localStorage.setItem('123helpmestudy-messenger-sender-id', `${sessionId}`);
      localSenderId = `${sessionId}`;
  }
  // Get stored secret
  let localSecret = localStorage.getItem('123helpmestudy-messenger-secret');
  if (localSecret == null) {
      let random = Math.random().toString(16);
      random = random.substring(2, 15);
      localStorage.setItem('123helpmestudy-messenger-secret', `${random}`);
      localSecret = `${random}`;
  }
  // Get chat area
  let chatInput = document.getElementById('live-chat-input');
  let chatValue = chatInput.value;
  if (chatValue == "") {
      chatInput.classList.add('is-invalid');
      return null;
  }
  chatInput.value = '';
  let html = `
  <div
      class="m-3 p-2 ml-5 text-left border border-success light-green-card"
      style=""
      id=${sessionId}
  >
      <p class="mb-0">
          ${chatValue.replace('\n', '<br/>')}
      </p>
  </div>
  `;
  let instantMessages = document.getElementById('instant-messages');
  instantMessages.innerHTML = instantMessages.innerHTML + html;
  instantMessages.scrollTop = instantMessages.scrollHeight;

  // Submit message to the API
  let path = '/api/messenger/send';
  let headers = {};
  let method = 'POST';
  let payload = {
      'type': 'new',
      'session_id': localSessionId,
      'sender_id': localSenderId,
      'secret': localSecret,
      'body': chatValue
  };
  let response = await apiCall(
      path,
      headers,
      method,
      payload
  );
  if (response['status'] == 200) {
      let newMessage = document.getElementById(`${sessionId}`);
      newMessage.innerHTML = newMessage.innerHTML + `
      <p class="text-right text-muted p-0 m-0" style="font-size: 10px;">
          Sent
      </p>
      `;
      // Show someone typing - randomly
      html = `
      <div
          id="live-chat-typing-${sessionId}"
          class="ml-4 font-italic"
          style="
              display: none;
              font-size: 12px;
          "
      >
          <span>Typing</span><span id="live-chat-typing-dots-${sessionId}"></span>
      </div>
      `;
      await sleep(15000);
      instantMessages.innerHTML = instantMessages.innerHTML + html;
      for (let h = 0; h < 3; h++) {
          document.getElementById(`live-chat-typing-${sessionId}`).style.display = 'block';
          for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 3; j++) {
                  document.getElementById(`live-chat-typing-dots-${sessionId}`).innerHTML += '.';
                  await sleep(500);
              }
              document.getElementById(`live-chat-typing-dots-${sessionId}`).innerHTML = '';
          }
          document.getElementById(`live-chat-typing-${sessionId}`).style.display = 'none';
          await sleep(8000);
      }
  } else {
      alert('Failed to send instant message');
  }
  // console.log(response['status']);
  // console.log(response['response']);
}


async function fetchConversation() {
    const sessionId = localStorage.getItem('123helpmestudy-messenger-session-id');
    const senderId = localStorage.getItem('123helpmestudy-messenger-sender-id');
    const secret = localStorage.getItem('123helpmestudy-messenger-secret');
    const path = '/api/messenger/fetch';
    const headers = {};
    const method = 'POST';
    const payload = {
        'type': 'conversation',
        'session_id': sessionId,
        'secret': secret
    };
    const response = await apiCall(
        path,
        headers,
        method,
        payload
    );
    if (response.status == 200) {
        const instantMessengerBox = document.getElementById('instant-messages');
        for (let messages in response.response.messages) {
            let messagesObj = response.response.messages[messages];
            if (messagesObj.length != 0) {
                instantMessengerBox.innerHTML = ''; // Clear messenger box
            }
            for (let i = 0; i < messagesObj.length; i++) {
                let messageObj = messagesObj[i];
                // Set default to be from 123 Help Me Study employee
                let messageBox = document.createElement('div');
                messageBox.className = 'ml-3 mr-5 my-3 p-2 text-left border border-info light-blue-card';
                // Check if message is from me?
                if (senderId == messageObj.sender_id) {
                    messageBox.className = 'mr-3 ml-5 my-3 p-2 text-left border border-success light-green-card';
                }
                // Add the message to the box
                let messageVal = document.createElement('p');
                messageVal.className = 'mb-0';
                messageVal.innerText = messageObj.message.replace('\r\n', '<br/>');
                messageBox.appendChild(messageVal);
                instantMessengerBox.appendChild(messageBox);
                // Randomly scroll down 1000 units in the overflow chat window div
                instantMessengerBox.scrollTop = 10000;
            }
        }
    }
}


async function fetchConversationAdmin(params) {
    // Get admin ID
    let adminId = await calculateAdminSenderId();
    // Submit message to the API
    let path = '/api/messenger/fetch';
    let headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    let method = 'POST';
    let payload = {
        'type': 'conversation',
        'session_id': params.sessionId,
        'secret': params.secret
    };
    while (true) {
        let response = await api_call(
            path,
            headers,
            method,
            payload
        );
        if (response['status'] == 200) {
            let messageBox = document.getElementById('instant-messenger-messages-list');
            messageBox.innerHTML = '';
            let sessions = response['response']['messages'];
            for (session in sessions) {
                let messages = sessions[session];
                // console.log(messages);
                for (let i = 0; i < messages.length; i++) {
                    // Define the base style for the chat bubble
                    let extraClass = "border-info light-blue-card ml-3 mr-5";
                    // Determine if message is from admin
                    if (messages[i].sender_id == adminId) {
                        extraClass = "border-success light-green-card ml-5 mr-3";
                    }
                    // Make the html
                    let html = `
                    <div class=" my-3  p-2 text-left border ${extraClass}">
                        <p
                            class="m-0 p-0"
                            style="
                                font-size: 10px;
                                color: grey;
                            "
                        >
                            ${new Date(messages[i].created_at)}
                        </p>
                        <p class="m-0 p-0">${messages[i].message}</p>
                    </div>
                    `;
                    messageBox.innerHTML = messageBox.innerHTML + html;
                }
            }
        } else {
        }
        // console.log(response['status']);
        // console.log(response['response']);
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(5000);
    }
}


async function calculateAdminSenderId() {
    // Calculate the admin's send_id
    let email = localStorage.getItem('123helpmestudy-email');
    let senderId = '';
    for (let i = 0; i < email.length; i++) {
        senderId = senderId + `${email[i].charCodeAt(0)}`;
    }
    let senderIdNumber = parseFloat(senderId) / senderId.length;
    while (senderIdNumber > 999999999) {
        senderIdNumber = parseFloat(senderId) / senderId.length;
        senderId = `${parseFloat(parseFloat(senderId) / senderId.length)}`;
    }
    senderId = `${parseInt(senderId)}`;
    return senderId;
}


export { captureChatMessage, fetchConversation };