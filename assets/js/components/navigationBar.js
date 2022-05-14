function setNavigationBar(base) {
    /* 
    Set navigation bar
    Requires: <div id="navigation-bar"></div>
    */
   const html = `
   <nav class="navbar navbar-expand-lg nav-bar-bg-colour navbar-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon" ></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item"> 
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/index.html" target="_parent"><i class="bi-house"></i> Home</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/information/about-us.html"><i class="bi-person"></i> About Us</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/information/tutors.html" target="_parent"><i class="bi-award"></i> Tutors</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/information/contact-us.html" target="_parent"><i class="bi-chat-right-text"></i> Contact Us</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                <!--
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="https://www.facebook.com/123helpmestudy" target="_blank"><i class="bi-facebook"></i> Facebook</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                -->
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/information/sign-up.html" target="_parent"><i class="bi-person-plus"></i> Sign Up</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
                <li class="nav-item">
                    <span style="display: block;" class="nav-bar-menu-item-ext">
                        <a class="nav-bar-menu-item font-weight-bold px-3" href="`+base+`/information/login.html"><i class="bi-box-arrow-right"></i> Login</a>
                    </span>
                    <span style="display: block;" class="nav-underline"></span>
                </li>
            </ul>
        </div>
    </nav>
   `;
   document.getElementById('navigation-bar').innerHTML = html;
}

export { setNavigationBar };