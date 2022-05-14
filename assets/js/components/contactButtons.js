import { sleep } from './../components/utils.js';


async function maximiseInstantMessengerBox() {
    console.log('Clicked!');
    let instantMessageBox = document.getElementById('instant-message-box')
    instantMessageBox.style.display = 'block';
    let currentHeight = parseInt(instantMessageBox.style.height.toString().replace('px', ''));
    let currentWidth = parseInt(instantMessageBox.style.width.toString().replace('px', ''));
    while (currentHeight < 600 || currentWidth < 500) {
        currentHeight = currentHeight + 10;
        currentWidth = currentWidth + 10;
        instantMessageBox.style.height = `${currentHeight}px`;
        instantMessageBox.style.width = `${currentWidth}px`;
        await sleep(5);
    }
}

async function minimiseInstantMessengerBox() {
    let instantMessageBox = document.getElementById('instant-message-box');
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
}

async function setContactButtons(base) {
    /*
     TODO:
     Add slack
     https://join.slack.com/t/123helpmestudy/shared_invite/zt-qu1qc57r-YvbbiOGxrp5bpiKOUUJGfw
 
     Add messaging button
    */

    const contactButtons = document.getElementById('contact-buttons');

    // Add mobile phone button
    const mobile = document.createElement('a');
    mobile.href = 'tel:07780570708';
    let childDiv = document.createElement('div');
    childDiv.classList.add('phone');
    let image = document.createElement('img');
    image.classList.add(['comms-image']);
    image.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3)';
    image.alt = 'call or text 123 help me study';
    image.src = 'https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/phone-icon_vfkqE-lLC.png';
    childDiv.appendChild(image);
    mobile.appendChild(childDiv);
    contactButtons.appendChild(mobile);

    // let html = `
    // <a href="tel:07780570708">
    //     <div class="phone">
    //         <img class="comms-image" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);" alt="call or text 123 help me study" src="https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/phone-icon_vfkqE-lLC.png">
    //     </div>
    // </a>
    // <!--<a href="${base}/information/contact-us.html" target="_parent">
    //     <div class="email">
    //         <img class="comms-image" style="background-color: rgb(59, 59, 59); box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);" alt="email 123 help me study" src="https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/email-icon_T97mDAvjR.PNG">
    //     </div>
    // </a>-->
    // <a href="mailto: info@123helpmestudy.com" target="_parent">
    //     <div class="email">
    //         <img class="comms-image" style="background-color: rgb(59, 59, 59); box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);" alt="email 123 help me study" src="https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/email-icon_T97mDAvjR.PNG">
    //     </div>
    // </a>
    // <a id="maximiseInstantMessengerBox" href="#">
    //     <div class="instant-message">
    //         <img
    //             class="comms-image"
    //             style="
    //                 width: 50px;
    //                 height: 50px;
    //                 padding-top: 8px;
    //                 padding-bottom: 6px;
    //                 padding-left: 10px;
    //                 padding-right: 10px;
    //                 background-color: white;
    //                 box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
    //             "
    //             alt="123 help me study Live Chat"
    //             src="${base}/assets/images/live_chat.png">
    //     </div>
    // </a>
    // `;
    // document.getElementById('contact-buttons').innerHTML = html;
    
    // console.log(
    //     document.getElementById('maximiseInstantMessengerBox').onclick
    // );
    // document.getElementById('maximiseInstantMessengerBox').onclick = maximiseInstantMessengerBox;
    // console.log(
    //     document.getElementById('maximiseInstantMessengerBox').onclick
    // );
    // let messengerButtons = document.querySelectorAll('#maximiseInstantMessengerBox');
    // while (messengerButtons.length == 0) {
    //     messengerButtons = document.querySelectorAll('#maximiseInstantMessengerBox');
    //     await sleep(10);
    // }
    // for (let i = 0; i < messengerButtons.length; i++) {
    //     messengerButtons[i].addEventListener(
    //         'click', function() {alert('Lol');}
    //     );
    // }
    // messengerButtons = document.querySelectorAll('#maximiseInstantMessengerBox');
    // console.log(messengerButtons);
    // while (messengerButtons.length == 0) {
    //     messengerButtons = document.querySelectorAll('#maximiseInstantMessengerBox');
    //     console.log(messengerButtons);
    //     await sleep(10);
    // }

 
    // TODO Change the below: display; height; width
    // html = `
    // <div
    //     id="instant-message-box"
    //     style="
    //         display: none;
    //         position: fixed;
    //         bottom: 10px;
    //         right: 10px;
    //         background-color: rgb(197, 236, 249);
    //         height: 0px;
    //         width: 0px;
    //         z-index: 999;
    //         border-radius: 2px;
    //         padding: 10px;
    //         box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
    //     "
    // >
    //     <div>
    //         <h3>Live Chat</h3>
    //         <button
    //             type="button"
    //             class="close"
    //             aria-label="Close"
    //             onclick="minimiseInstantMessengerBox();"
    //         >
    //             <span
    //                 aria-hidden="true"
    //                 style="
    //                     position: absolute;
    //                     top: 5px;
    //                     right: 10px;
    //                     font-size: 30px;
    //                 "
    //             >
    //                 &times;
    //             </span>
    //         </button>
    //     </div>
    //     <div
    //         id="instant-messages"
    //         style="
    //             margin-top: 15px;
    //             margin-bottom: 20px;
    //             height: 400px;
    //             background-color: rgb(255, 255, 255);
    //             position: relative;
    //             overflow: auto;
    //         "
    //         class="border rounded"
    //     >
    //         <div
    //             id="bot-hello"
    //             class="m-3 mr-5 p-2 text-left border border-info light-blue-card"
    //             style=""
    //         >
    //             <p class="mb-0">
    //                 Hello, can I help you to find a tutor today?
    //             </p>
    //         </div>
    //     </div>
    //     <div
    //         class="row"
    //         style="
    //         "
    //     >
    //         <div class="col pr-0">
    //             <textarea
    //                 id="live-chat-input"
    //                 class="form-control"
    //                 rows="4"
    //                 style="max-height: 110px;"
    //                 onfocus="clearIsInvalid();"
    //             ></textarea>
    //         </div>
    //         <div class="col col-lg-2 mr-2">
    //             <button
    //                 onclick="captureChatMessage();"
    //                 class="btn btn-success"
    //                 style="
    //                     position: absolute;
    //                     bottom: 0;
    //                 "
    //             >
    //                 Send
    //             </button>
    //         </div>
    //     </div>
    // </div>
    // `;
    // document.getElementById('contact-buttons').innerHTML = (
    //     document.getElementById('contact-buttons').innerHTML
    //     + html
    // );
}

export { setContactButtons };