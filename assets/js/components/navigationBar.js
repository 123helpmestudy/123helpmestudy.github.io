import { minimiseInstantMessengerBox } from './contactButtons.js';

const navItems = [
  {
    href: `${window.location.origin}/index.html`,
    target: 'parent',
    text: '<i class="bi-house"></i> Home',
  },
  {
    href: `${window.location.origin}/information/about-us.html`,
    target: 'parent',
    text: '<i class="bi-person"></i> About Us',
  },
  {
    href: `${window.location.origin}/information/tutors.html`,
    target: 'parent',
    text: '<i class="bi-award"></i> Tutors',
  },
  {
    href: `${window.location.origin}/information/contact-us.html`,
    target: 'parent',
    text: '<i class="bi-chat-right-text"></i> Contact Us',
  },
  // {
  //   href: `https://www.facebook.com/123helpmestudy`,
  //   target: 'blank',
  //   text: '<i class="bi-facebook"></i> Facebook',
  // },
  {
    href: `${window.location.origin}/information/sign-up.html`,
    target: 'parent',
    text: '<i class="bi-person-plus"></i> Sign Up',
  },
  {
    href: `${window.location.origin}/information/login.html`,
    target: 'parent',
    text: '<i class="bi-box-arrow-right"></i> Login',
  },
];


function setNavigationBar() {
  // Requires a div on the page with id: 'navigation-bar'
  const navBarSection = document.getElementById('navigation-bar');
  // Navigation element
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg nav-bar-bg-colour navbar-dark';

  // Collapsible nav button for smaller devices
  const navCollapseBtn = document.createElement('button');
  navCollapseBtn.className = 'navbar-toggler';
  navCollapseBtn.type = 'button';
  navCollapseBtn.dataset.toggle = 'collapse';
  navCollapseBtn.dataset.target = '#navbarSupportedContent';
  navCollapseBtn.ariaControls = 'navbarSupportedContent';
  navCollapseBtn.ariaExpanded = 'false';
  navCollapseBtn.ariaLabel = 'Toggle navigation';
  navCollapseBtn.addEventListener('click', () => {
    minimiseInstantMessengerBox();
  });

  // Add toggle icon in span to button
  const btnIcon = document.createElement('span');
  btnIcon.classList.add('navbar-toggler-icon');
  // Attach icon to button
  navCollapseBtn.appendChild(btnIcon);
  // Attach button
  nav.appendChild(navCollapseBtn);

  // Add collapsible section
  const collaspeSection = document.createElement('div');
  collaspeSection.className = 'collapse navbar-collapse';
  collaspeSection.id = 'navbarSupportedContent';
  // Add unordered list section to collapsible
  const ul = document.createElement('ul');
  ul.className = 'navbar-nav mr-auto';
  
  // Iterate over nav items and add them to ul
  for (let i = 0; i < navItems.length; i++) {
    let li = document.createElement('li');
    li.classList.add('nav-item');
    // Span for nav item
    let liSpan = document.createElement('span');
    liSpan.style.display = 'block';
    liSpan.classList.add('nav-bar-menu-item-ext');
    // Add anchor to span
    let anchor = document.createElement('a');
    anchor.className = 'nav-bar-menu-item font-weight-bold px-3';
    // Nav specific items from above list
    anchor.href = navItems[i].href;
    anchor.target = `_${navItems[i].target}`;
    anchor.innerHTML = navItems[i].text;
    // Attacch anchor to span
    liSpan.appendChild(anchor);
    // Attach span to li
    li.appendChild(liSpan);
    // Add underline span
    let underline = document.createElement('span');
    underline.style.display = 'block';
    underline.classList.add('nav-underline');
    // Attach underline
    li.appendChild(underline);
    // Attach list item to unordered list
    ul.appendChild(li);
  }

  // Attach ul
  collaspeSection.appendChild(ul);
  // Attach collapsible section to nav
  nav.appendChild(collaspeSection);

  // Add nav to nav bar section
  navBarSection.appendChild(nav);
}

export { setNavigationBar };