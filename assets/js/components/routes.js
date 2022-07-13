
const home = () => {
  window.location.assign(window.location.origin);
};

const contactUs = () => {
  window.location.assign(
    `${window.location.origin}/information/contact-us.html?subject=Subject not listed`
  );
}

export {
  home,
  contactUs
};