
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

export { sleep, hasUniqueId };