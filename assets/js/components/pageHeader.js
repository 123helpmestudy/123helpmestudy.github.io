
function setPageHeader() {
    /* 
    Set page header
    Requires: <div id="page-header"></div>
    */
    const html = `
    <div class="card border-0">
        <div class="card-body text-center text-white cust-header-background">
            <h1 class="font-weight-bold">123 Help Me Study</h1>
        </div>
    </div>
    `;
    document.getElementById('page-header').innerHTML = html;
}

export { setPageHeader };