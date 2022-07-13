
function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function hasUniqueId() {
  let unique = localStorage.getItem('123helpmestudy-unique');
  let now = new Date();
  if (unique == null) {
    localStorage.setItem(
      '123helpmestudy-unique',
      btoa(now)
    );
  }
}

function resetError() {
  if (document.getElementById('error-card') != null) {
    document.getElementById('error-card').style.display = 'none';    
  }
}

/**
 * Provides a way to reset the request a callback form
 * After user has not filled out the required fields
 */
 function resetInvalidInput() {
  const id = this.id;
  resetError();
  document.getElementById(id).classList.remove('is-invalid');
}

function validateTarget(id) {
  const target = document.getElementById(id);
  const targetLength = target.value.length;
  if (targetLength == 0) {
    target.classList.add('is-invalid');
    return true;
  }
  return false;
}

// Allows the user to toggle between online and face-to-face sessions
const tutorSubjectToggle = () => {
  const lessonLocation = document.getElementById('lessonLocation');
  const postCode = document.getElementById('postZipCode');
  const onlineBtn = document.getElementById('checkOnline');
  const face2FaceBtn = document.getElementById('checkFace2Face');
  let onlineLessons = (onlineBtn.className.indexOf('bg-primary') > -1) ? true : false;
  if (!onlineLessons) {
    lessonLocation.value = 'online';
    postCode.style.display = 'none';
    face2FaceBtn.className = "col btn m-0";
    addActiveClasses(onlineBtn);
    onlineLessons = true;
  } else {
    lessonLocation.value = 'face-to-face';
    postCode.style.display = 'block';
    onlineBtn.className = "col btn m-0";
    addActiveClasses(face2FaceBtn);
    onlineLessons = false;
  }
};

const addActiveClasses = (btn) => {
  const classNames = [
    'col',
    'btn',
    'm-0',
    'bg-primary',
    'font-weight-bold',
    'text-white'
  ];
  for (let i = 0; i < classNames.length; i++) {
    btn.classList.add(classNames[i]);
  }
};

export {
  sleep,
  hasUniqueId,
  resetError,
  resetInvalidInput,
  validateTarget,
  tutorSubjectToggle
};