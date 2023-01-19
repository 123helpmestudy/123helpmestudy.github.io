/**
 * This component defines the FAQ modal that can appear on both desktop and mobile devices over the page
 */

import { sleep } from '/assets/js/components/utils.js';

const body = document.querySelector('body');
const showFaqBtn = document.getElementById('faq-button');

let showFaq = true;

const toggleFaq = async () => {
  showFaq = !showFaq;
  const faqModal = document.getElementById('faq-modal');
  const faqContainer = document.getElementById('faq-container');
  if (showFaq) {
    faqModal.style.display = 'block';
    for(let i = 0; i <=50; i++) {
      faqContainer.style.width = `${i}%`;
      await sleep(2);
    }
  } else {
    for(let i = 50; i > 0; i--) {
      faqContainer.style.width = `${i}%`;
      await sleep(2);
    }
    faqModal.style.display = 'none';
  }
};

const toggleFullscreen = async (el) => {
  const faqContainer = document.getElementById('faq-container');
  if (el.className.indexOf('bi-arrows-angle-expand') > -1) {
    for(let i = 50; i <= 100; i++) {
      faqContainer.style.width = `${i}%`;
      await sleep(2);
    }
    el.classList.remove('bi-arrows-angle-expand');
    el.classList.add('bi-arrows-angle-contract');
  } else {
    for(let i = 100; i >=50; i--) {
      faqContainer.style.width = `${i}%`;
      await sleep(2);
    }
    el.classList.remove('bi-arrows-angle-contract');
    el.classList.add('bi-arrows-angle-expand');
  }
};

export const setFaqModal = ({ show }) => {
  showFaq = show;
  // Faq modal overlay
  const faqModal = document.createElement('div');
  faqModal.style.position = 'absolute';
  faqModal.style.width = '100%';
  faqModal.style.height = '100%';
  faqModal.style.top = 0;
  faqModal.style.left = 0;
  faqModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  faqModal.style.zIndex = 20;
  faqModal.style.display = showFaq ? 'block' : 'none';
  faqModal.id = 'faq-modal';
  body.appendChild(faqModal);

  // Define the container inside of the modal
  const faqContainer = document.createElement('div');
  faqContainer.style.position = 'absolute';
  faqContainer.style.width = !showFaq ? '0%' : '50%';
  faqContainer.style.height = '100%';
  faqContainer.style.top = 0;
  faqContainer.style.right = 0;
  faqContainer.style.backgroundColor = 'rgba(255,255,255,1)';
  faqContainer.style.zIndex = 25;
  faqContainer.id = 'faq-container';
  faqModal.appendChild(faqContainer);

  // Define the close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.classList.add('close');
  closeBtn.style.position = 'relative';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.addEventListener('click', toggleFaq);
  faqContainer.appendChild(closeBtn);
  const closeSpan = document.createElement('span');
  closeSpan.ariaHidden = true;
  closeSpan.innerHTML = '&times;';
  closeBtn.appendChild(closeSpan);

  // Define expand button
  const expandBtnContainer = document.createElement('div');
  expandBtnContainer.style.top = '10px';
  expandBtnContainer.style.left = '25px';
  expandBtnContainer.style.width = '1rem';
  expandBtnContainer.style.transform = 'rotate(90deg)';
  expandBtnContainer.style.position = 'relative';
  faqContainer.appendChild(expandBtnContainer);
  const expandBtn = document.createElement('i');
  expandBtn.style.fontSize = '1.25rem';
  expandBtn.style.color = 'rgba(100,100,100,1)';
  expandBtn.classList.add('hover-pointer');
  expandBtn.classList.add('bi-arrows-angle-expand');
  expandBtn.addEventListener('click', () => {
    toggleFullscreen(expandBtn);
  });
  expandBtnContainer.appendChild(expandBtn);

  // Add heading
  const faqHeading = document.createElement('h2');
  faqHeading.innerText = `FAQ's`;
  faqHeading.style.marginLeft = 'auto';
  faqHeading.style.marginRight = 'auto';
  faqHeading.style.width = '25%';
  faqHeading.style.marginTop = '0rem';
  faqHeading.style.marginBottom = '2rem';
  faqHeading.style.textAlign = 'center';
  faqHeading.style.fontSize = '2.5rem';
  faqContainer.appendChild(faqHeading);

  // Add topics
  const topicsContainer = document.createElement('div');
  topicsContainer.style.overflowY = 'scroll';
  topicsContainer.style.height = '80%';
  faqContainer.appendChild(topicsContainer);
  for (let i = 0; i < topic.length; i++) {

    let topicContainer = document.createElement('div');
    topicContainer.style.marginLeft = '1.5rem';
    topicContainer.style.marginRight = '1.5rem';
    topicsContainer.appendChild(topicContainer);
    let topicHeaderContainer = document.createElement('div');
    topicHeaderContainer.classList.add('row');
    topicHeaderContainer.classList.add('hover-pointer');
    topicContainer.appendChild(topicHeaderContainer);
    let topicHeaderCaret = document.createElement('i');
    topicHeaderCaret.classList.add('bi-caret-down-fill');
    topicHeaderContainer.appendChild(topicHeaderCaret);
    let topicHeader = document.createElement('h3');
    topicHeader.style.fontSize = '1.2rem';
    topicHeader.style.padding = '1px 10px';
    topicHeader.innerText = topic[i].header;
    topicHeaderContainer.appendChild(topicHeader);

    let topicParagraphContainer = document.createElement('div');
    // topicParagraphContainer.style.display = 'none';
    topicContainer.appendChild(topicParagraphContainer);
    topic[i].text.forEach(text => {
      let topicEl = document.createElement(text.element);
      if (text.element === 'p') {
        topicEl.innerText = text.value;
        topicEl.style.textAlign = 'justify';
        topicEl.style.marginBottom = '0';
        topicEl.style.marginTop = '1rem';
      } else if (text.element === 'i') {
        topicEl.innerText = text.value;
        topicEl.style.textAlign = 'justify';
      } else if (text.element === 'h4') {
        topicEl.innerText = text.value;
        topicEl.style.margin = '1rem 0';
        topicEl.style.fontSize = '1.1rem';
        topicEl.style.textDecoration = 'underline';
      } else if (text.element === 'img') {
        topicEl.src = text.value;
        topicEl.style.width = '100%';
      } else {
        console.error(`You are trying to render an element that hasn't been registered`);
        console.error(text);
      }
      topicParagraphContainer.appendChild(topicEl);
    });

    topicHeaderContainer.addEventListener('click', () => {
      if (topicHeaderCaret.className.indexOf('bi-caret-right') > -1) {
        topicHeaderCaret.classList.remove('bi-caret-right');
        topicHeaderCaret.classList.add('bi-caret-down-fill');
        topicParagraphContainer.style.display = 'block';
      } else {
        topicHeaderCaret.classList.remove('bi-caret-down-fill');
        topicHeaderCaret.classList.add('bi-caret-right');
        topicParagraphContainer.style.display = 'none';
      }
    });

  }

  // Add event listener to show faq button
  showFaqBtn.addEventListener('click', toggleFaq);
};

const topic = [
  {
    header: 'Where is my verification email?',
    text: [
      {
        element: 'p',
        value: 'It can sometimes take up to 15 minutes to receive your verification email, however in the event you do not find your verification email we recommend you message us using the live chat functionality on this page. Below you will find information relating to finding emails, we send to your Gmail or Microsoft account, that do not land in your normal inbox. We also recommend you follow a similar approach for other email providers.',
      },
      {
        element: 'h4',
        value: 'I have a Gmail account',
      },
      {
        element: 'p',
        value: 'If you have a Gmail account your email might not have ended up in your inbox! Below we will suggest two potential locations where your verification email might have ended up.',
      },
      {
        element: 'p',
        value: 'In the promotions folder:',
      },
      {
        element: 'img',
        value: '/assets/images/faq/gmail-promotions-red-box.png',
      },
      {
        element: 'i',
        value: 'Click on the "Promotions" tab at the top of the page. If the email is in this folder then open it up and proceed as normal. You can move the email to your primary inbox or mark it as "not promotion" so that future emails go into your main inbox.',
      },
      {
        element: 'p',
        value: 'In the spam folder:',
      },
      {
        element: 'img',
        value: '/assets/images/faq/gmail-spam-red-box.png',
      },
      {
        element: 'i',
        value: 'Click on the "Spam" folder button. You should see your email there. Once you have clicked on the email you should be able to mark it "as not junk / spam", as shown in the below image.',
      },
      {
        element: 'img',
        value: '/assets/images/faq/gmail-spam-2-red-box.png',
      },
      {
        element: 'h4',
        value: 'I have a Microsoft account',
      },
      {
        element: 'p',
        value: 'If you have a Microsoft account your email might not have ended up in your inbox! In this case your verification email is most likely in the spam folder.',
      },
      {
        element: 'img',
        value: '/assets/images/faq/hotmail-spam-red-box.png',
      },
      {
        element: 'i',
        value: 'Click on the "spam" folder button. Once you are in the spam folder, you can click on the verification email we sent you.',
      },
      {
        element: 'p',
        value: 'We recommend that you mark the email as "not junk" using the button, as indicated in the below image.',
      },
      {
        element: 'img',
        value: '/assets/images/faq/hotmail-spam-report-not-junk-red-box.png',
      },
      {
        element: 'i',
        value: 'You can then also add "info@123helpmestudy.com" to your "Safe Senders" list.',
      },
      {
        element: 'img',
        value: '/assets/images/faq/hotmail-spam-report-not-junk-2-red-box.png',
      },
    ],
  },
];