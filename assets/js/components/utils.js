
function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function hasUniqueId() {
  var unique = localStorage.getItem('123helpmestudy-unique');
  var now = new Date();
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

function validateTarget(id) {
  const target = document.getElementById(id);
  const targetLength = target.value.length;
  if (targetLength == 0) {
    target.classList.add('is-invalid');
    return true;
  }
  return false;
}

export {
  sleep,
  hasUniqueId,
  resetError,
  validateTarget
};