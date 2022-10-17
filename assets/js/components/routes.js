
const home = () => {
  window.location.assign(window.location.origin);
};

const contactUs = (subject) => {
  window.location.assign(
    `${window.location.origin}/information/contact-us.html?subject=${subject}`
  );
}

const bookingCalendar = (subject, username, duration, code) => {
  if (!duration) duration = 60;
  window.location.assign(
    `${window.location.origin}/application/user/booking-calendar.html?username=${username}&subject=${subject}&dur=${duration}&code=${code}`
  );
};

export {
  home,
  contactUs,
  bookingCalendar,
};