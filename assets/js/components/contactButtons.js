import { sleep } from './../components/utils.js';
import { captureChatMessage, fetchConversation } from './apiCalls/instantMessenger.js';

const chatBoxHeight = 600;
const chatBoxWidth = 500;
let chatWindowVisible = false;
let chatBoxDisplay = 'block';
let chatBoxViewHeight = `${chatBoxHeight}px`;
let chatBoxViewWidth = `${chatBoxWidth}px`;
if (!chatWindowVisible) {
    chatBoxDisplay = 'none';
    chatBoxViewHeight = '0px';
    chatBoxViewWidth = '0px';
}

async function maximiseInstantMessengerBox() {
    const instantMessageBox = document.getElementById('instant-message-box');
    instantMessageBox.style.display = 'block';
    let currentHeight = parseInt(instantMessageBox.style.height.toString().replace('px', ''));
    let currentWidth = parseInt(instantMessageBox.style.width.toString().replace('px', ''));
    let resizeWidth = true;
    let resizeHeight = true;
    let stopResize = false;
    while (!stopResize) {
        // Manage WIDTH
        if (resizeWidth) currentWidth = currentWidth + 10;
        // Check for smaller device sizes
        if (currentWidth > window.innerWidth) {
            currentWidth = currentWidth - (currentWidth - window.innerWidth) - 10;
            resizeWidth = false;
        }
        // Check if chat window has passed the box size threshold
        if (currentWidth > chatBoxWidth) {
            resizeWidth = false;
        }

        // Manage HEIGHT
        if (resizeHeight) currentHeight = currentHeight + 10;
        if (currentHeight > chatBoxHeight) {
            resizeHeight = false;
        }

        // Check if we need to continue resizing
        if (!resizeWidth && !resizeHeight) {
            stopResize = true;
        }
        instantMessageBox.style.height = `${currentHeight}px`;
        instantMessageBox.style.width = `${currentWidth}px`;
        await sleep(5);
    }
    chatWindowVisible = true;
}

async function minimiseInstantMessengerBox() {
    let instantMessageBox = document.getElementById('instant-message-box');
    if (instantMessageBox === undefined) return;
    let currentHeight = parseInt(instantMessageBox.style.height.toString().replace('px', ''));
    let currentWidth = parseInt(instantMessageBox.style.width.toString().replace('px', ''));
    while (currentHeight > 0 || currentWidth > 0) {
        currentHeight = currentHeight - 10;
        currentWidth = currentWidth - 10;
        instantMessageBox.style.height = `${currentHeight}px`;
        instantMessageBox.style.width = `${currentWidth}px`;
        // Hide at the last second
        if (currentHeight <= 50) {
            instantMessageBox.style.display = 'none';
        }
        await sleep(5);
    }
    chatWindowVisible = false;
}

async function setContactButtons() {
    /*
     TODO:
     Add slack
     https://join.slack.com/t/123helpmestudy/shared_invite/zt-qu1qc57r-YvbbiOGxrp5bpiKOUUJGfw
 
     Add messaging button
    */

    const contactButtons = document.getElementById('contact-buttons');
    let childDiv;
    let image;

    // Add mobile phone button
    // const mobile = document.createElement('a');
    // mobile.href = 'tel:07780570708';
    // childDiv = document.createElement('div');
    // childDiv.classList.add('phone');
    // image = document.createElement('img');
    // image.classList.add('comms-image');
    // image.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3)';
    // image.alt = 'call or text 123 help me study';
    // image.src = 'https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/phone-icon_vfkqE-lLC.png';
    // childDiv.appendChild(image);
    // mobile.appendChild(childDiv);
    // contactButtons.appendChild(mobile);

    // Add email button
    const email = document.createElement('a');
    email.href = 'mailto:info@123helpmestudy.com';
    childDiv = document.createElement('div');
    childDiv.classList.add('email');
    image = document.createElement('img');
    image.classList.add('comms-image');
    image.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3)';
    image.style.backgroundColor = 'rgb(59, 59, 59)';
    image.alt = 'email 123 help me study';
    image.src = 'https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/email-icon_T97mDAvjR.PNG';
    childDiv.appendChild(image);
    email.appendChild(childDiv);
    contactButtons.appendChild(email);

    // Add live chat button
    const liveChat = document.createElement('a');
    liveChat.href = '#';
    liveChat.addEventListener('click', maximiseInstantMessengerBox);
    childDiv = document.createElement('div');
    childDiv.classList.add('instant-message');
    image = document.createElement('img');
    image.classList.add('comms-image');
    image.style.width = '50px';
    image.style.height = '50px';
    image.style.paddingTop = '8px';
    image.style.paddingBottom = '6px';
    image.style.paddingLeft = '10px';
    image.style.paddingRight = '10px';
    image.style.backgroundColor = 'rgb(255, 255, 255)'; // White
    image.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3)';
    image.alt = 'live chat 123 help me study';
    image.src = `${window.location.origin}/assets/images/live_chat.png`;
    childDiv.appendChild(image);
    liveChat.appendChild(childDiv);
    contactButtons.appendChild(liveChat);

    // chat box window
    const chatBoxWindow = document.createElement('div');
    chatBoxWindow.id = 'instant-message-box';
    chatBoxWindow.style.display = chatBoxDisplay;
    chatBoxWindow.style.height = chatBoxViewHeight;
    chatBoxWindow.style.width = chatBoxViewWidth;
    chatBoxWindow.style.position = 'fixed';
    chatBoxWindow.style.bottom = '5px';
    chatBoxWindow.style.right = '5px';
    chatBoxWindow.style.backgroundColor = 'rgb(197, 236, 249)';
    chatBoxWindow.style.zIndex = 999;
    chatBoxWindow.style.borderRadius = '2px';
    chatBoxWindow.style.padding = '10px';
    chatBoxWindow.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3)';

    //* Header div
    const liveChatHeaderBox = document.createElement('div');
    const liveChatHeader = document.createElement('h3');
    liveChatHeader.innerText = 'Live chat';
    liveChatHeaderBox.appendChild(liveChatHeader);
    //** Create close button for live chat header
    const liveChatHeaderCloseBtn = document.createElement('button');
    liveChatHeaderCloseBtn.type = 'button';
    liveChatHeaderCloseBtn.classList.add('close');
    liveChatHeaderCloseBtn.ariaLabel = 'Close';
    liveChatHeaderCloseBtn.addEventListener('click', minimiseInstantMessengerBox);
    const closeBtnImage = document.createElement('span');
    closeBtnImage.ariaHidden = 'true';
    closeBtnImage.style.position = 'absolute';
    closeBtnImage.style.top = '5px';
    closeBtnImage.style.right = '10px';
    closeBtnImage.style.fontSize = '30px';
    closeBtnImage.innerHTML = '&times';
    liveChatHeaderCloseBtn.appendChild(closeBtnImage);
    liveChatHeaderBox.appendChild(liveChatHeaderCloseBtn);

    chatBoxWindow.append(liveChatHeaderBox);

    // Instant messages box
    const instantMessagesBox = document.createElement('div');
    instantMessagesBox.id = 'instant-messages';
    instantMessagesBox.style.marginTop = '15px';
    instantMessagesBox.style.marginBottom = '20px';
    instantMessagesBox.style.height = '400px';
    instantMessagesBox.style.backgroundColor = 'rgb(255, 255, 255)';
    instantMessagesBox.style.position = 'relative';
    instantMessagesBox.style.overflow = 'auto';
    instantMessagesBox.className = 'border rounded';
    //* Chat bot hello box
    const chatBotHelloBox = document.createElement('div');
    chatBotHelloBox.id = 'bot-hello';
    chatBotHelloBox.className = 'm-3 mr-5 p-2 text-left border border-info light-blue-card';
    //** Chat bot text
    const chatBotText = document.createElement('p');
    chatBotText.classList.add('mb-0');
    chatBotText.innerText = 'Hello, can I help you to find a tutor today?';
    if (window.location.pathname.indexOf('payment') > -1) chatBotText.innerText = 'Hello, how can I help?';
    chatBotHelloBox.appendChild(chatBotText);
    instantMessagesBox.appendChild(chatBotHelloBox);

    chatBoxWindow.appendChild(instantMessagesBox);

    // Add response section to chatBoxWindow
    const responseSectionRow = document.createElement('div');
    responseSectionRow.classList.add('row');
    const responseSectionTextBox = document.createElement('div');
    // responseSectionTextBox.className = 'col pr-0';
    responseSectionTextBox.className = 'col';
    // responseSectionTextBox.style.width = '80%';
    //* Text area
    const responseTextarea = document.createElement('textarea');
    responseTextarea.id = 'live-chat-input';
    responseTextarea.classList.add('form-control');
    responseTextarea.rows = '4';
    responseTextarea.style.maxHeight = '110px';
    responseTextarea.style.width = '208%';
    responseTextarea.addEventListener('focus', (event) => {
        event.target.classList.remove('is-invalid');
    });
    responseSectionTextBox.appendChild(responseTextarea);
    responseSectionRow.appendChild(responseSectionTextBox);

    const responseSectionSubmitBtnBox = document.createElement('div');
    // responseSectionSubmitBtnBox.className = 'col col-lg-2 mr-2';
    responseSectionSubmitBtnBox.className = 'col';
    responseSectionSubmitBtnBox.style.paddingRight = '75px';
    responseSectionSubmitBtnBox.style.textAlign = 'right';
    //* Submit button
    const responseSubmitBtn = document.createElement('button');
    responseSubmitBtn.innerText = 'Send';
    responseSubmitBtn.className = 'btn btn-success';
    responseSubmitBtn.style.position = 'absolute';
    responseSubmitBtn.style.bottom = '0px';
    responseSubmitBtn.addEventListener('click', captureChatMessage);
    responseSectionSubmitBtnBox.appendChild(responseSubmitBtn);
    responseSectionRow.appendChild(responseSectionSubmitBtnBox);

    chatBoxWindow.append(responseSectionRow);

    // Final attach of chatBoxWindow to contactButtons section
    contactButtons.appendChild(chatBoxWindow);

    // Initiate chat fetch loop
    while (true) {
        if (chatWindowVisible) fetchConversation();
        await sleep(5000);
    }
}

export { setContactButtons, minimiseInstantMessengerBox };