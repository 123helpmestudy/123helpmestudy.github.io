
export function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function hasUniqueId() {
  let unique = localStorage.getItem('123helpmestudy-unique');
  let now = new Date();
  if (unique == null) {
    localStorage.setItem(
      '123helpmestudy-unique',
      btoa(now)
    );
  }
}

export function resetError() {
  const errorCard = document.getElementById('error-card');
  if (errorCard) errorCard.style.display = 'none';
}

/** 
 * Reset Invalid Input
 * 
 * Provides a way to reset the request a callback form
 * After user has not filled out the required fields
 */
export function resetInvalidInput() {
  const id = this.id;
  resetError();
  document.getElementById(id).classList.remove('is-invalid');
}

export function validateTarget(id) {
  const target = document.getElementById(id);
  const targetLength = target.value.length;
  if (targetLength == 0) {
    target.classList.add('is-invalid');
    return true;
  }
  return false;
}

/**
 *  Allows the user to toggle between online and face-to-face sessions
 */
export const tutorSubjectToggle = () => {
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

export const addActiveClasses = (btn) => {
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

export const messageCounter = (input_id, output_id) => {
  const input = document.getElementById(input_id);
  input.addEventListener("keyup", (event) => {
      let stringLength = input.value.length;
      if (stringLength > 500) {
          document.getElementById(output_id).style.color = 'rgb(255, 0, 0)';
      } else {
          document.getElementById(output_id).style.color = 'rgb(0, 0, 0)';
      }
      document.getElementById(output_id).innerHTML = (
        stringLength.toString() + ' / 500'
      );
  });
};

export const setFile = (attribute, label, inputId, tickId) => {
  const newFile = document.getElementById(inputId).files;
  const output = document.getElementById(attribute);
  const fileLabel = document.getElementById(label);
  const tick = document.getElementById(tickId);
  if (newFile.length === 0) return;
  if (tickId) tick.style.display = 'inline';
  fileLabel.innerText = newFile[0].name;
  const fileToRead = newFile[0];
  const fileReader = new FileReader();
  fileReader.addEventListener('load', (event) => {
    const base64 = event.target.result;
    output.innerText = base64;
  });
  fileReader.readAsDataURL(fileToRead);
};

