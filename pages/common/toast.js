/**
 * Used to create notification on the page
 */

const body = document.querySelector('body');

const toastItemExample = {
  name: '',
  duration: 10, // seconds
  header: '',
  text: '',
  type: 'success' | 'error' | 'info',
};
let toastList = [];

const toasts = (toast) => {
  if (toast.type !== 'error') return;
  if (toastList.length < 25) toastList = [...toastList, toast];
  // Clear toasts
  clearVisibleToasts();
  // Render toasts again
  toastList.forEach((toast, idx) => displayToast(idx, toast));
};


const displayToast = (idx, { name, duration, header, text, type }) => {
  const toastContainer = document.createElement('div');
  toastContainer.style.width = '300px';
  toastContainer.style.height = '85px';
  let toastBackgroundColour = '#28a745';
  let toastBoxShadow = '0 0 0 0.2rem #28a74575';
  if (type === 'success') {
    toastBackgroundColour = '#28a745';
    toastBoxShadow = '0 0 0 0.2rem #28a74575';
  }
  if (type === 'error') {
    toastBackgroundColour = '#dc3545';
    toastBoxShadow = '0 0 0 0.2rem #dc354575';
  }
  if (type === 'info') {
    toastBackgroundColour = '#0d6efd';
    toastBoxShadow = '0 0 0 0.2rem #0d6efd75';
  }
  toastContainer.style.backgroundColor = toastBackgroundColour;
  toastContainer.style.boxShadow = toastBoxShadow;
  toastContainer.style.position = 'absolute';
  toastContainer.style.top = `${(idx + 1) * 115 - 30}px`;
  toastContainer.style.right = '1rem';
  toastContainer.style.borderRadius = '0.25rem';
  toastContainer.id = `toast-${idx}`;
  toastContainer.addEventListener('click', () => {
    destroyToast(idx);
  });
  body.appendChild(toastContainer);
  // Toast timer
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('progress');
  progressContainer.style.borderRadius = '0.25rem 0.25rem 0 0';
  progressContainer.style.height = '0.25rem';
  toastContainer.appendChild(progressContainer);
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  let progressType = 'bg-success';
  if (type === 'success') progressType = 'bg-success';
  if (type === 'error') progressType = 'bg-danger';
  if (type === 'info') progressType = 'bg-primary';
  progressBar.classList.add(progressType);
  progressBar.role = 'progressbar';
  progressBar.style.width = `${100}%`;
  progressBar.ariaValueNow = `${100}`;
  progressBar.ariaValueMin = '0';
  progressBar.ariaValueMax = '100';
  progressContainer.appendChild(progressBar);
  manageToastTimer(idx, progressBar);
  // Toast heading

  // Toast text
  const toastText = document.createElement('p');
  toastText.innerText = text;
  toastText.style.margin = 0;
  toastText.style.color = 'rgb(255,255,255)';
  toastText.style.margin = '10px 15px';
  toastContainer.appendChild(toastText);
};


const destroyToast = (id) => {
  toastList = toastList.filter(toast => toast !== toastList[id])
  // Clear toasts
  clearVisibleToasts();
  // Render toasts again
  toastList.forEach((toast, idx) => displayToast(idx, toast));
};

const clearVisibleToasts = () => {
  for (let i = 0; i < 25; i++) {
    const toast = document.getElementById(`toast-${i}`);
    if(toast) toast.remove();
  }
};

const manageToastTimer = (id, progressBar) => {
  let percentage = parseInt(progressBar.style.width.replace('%', ''));
  if (percentage === 100) handleToastTimer(id, progressBar);
};

const handleToastTimer = (id, progressBar) => {
  let percentage = parseInt(progressBar.style.width.replace('%', ''));
  percentage--;
  progressBar.style.width = `${percentage}%`;
  setTimeout(() => {
    if (percentage > 0) {
      handleToastTimer(id, progressBar);
    } else {
      destroyToast(id);
    }
  }, 100);
};


export default toasts;