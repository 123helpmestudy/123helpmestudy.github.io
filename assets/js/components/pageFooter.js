
function setPageFooter() {
    /* 
    Set page footer
    Requires: <div id="page-footer"></div>
    */
    const html = `
    <div class="container-fluid bg-dark p-4">
        <p class="text-light">Established in August 2019</p>
        <p class="text-light">Trading as <i>"123 Help Me Study"</i></p>
        <a class="text-light" href="${window.location.origin}/information/privacy-policy.html" target="_parent"><p>Privacy Policy</p></a>
        <a class="text-light" href="${window.location.origin}/information/terms-and-conditions.html" target="_parent"><p>Terms &amp; Conditions</p></a>
        <a class="text-light" href="${window.location.origin}/information/site-map.html" target="_parent"><p>Site Map</p></a>
        <div class="text-center">
            <a class="strip-link" href="https://www.facebook.com/123helpmestudy" target="_blank" alt="facebook link">
                <img class=" social-media-icon-footer" src="${window.location.origin}/assets/images/facebook.png"/>
            </a>
            <a class="strip-link" href="https://www.instagram.com/123helpmestudy" target="_blank" alt="instagram link">
                <img class="social-media-icon-footer" src="${window.location.origin}/assets/images/instagram.png"/>
            </a>
        </div>           
    </div>
    `;
    document.getElementById('page-footer').innerHTML = html;
}

export { setPageFooter };