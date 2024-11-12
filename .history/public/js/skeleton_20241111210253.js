//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    console.log("loadSkeleton run");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./nav_after_login'));
            console.log($('#footerPlaceholder').load('./footer_after_login'));
        } else {
            console.log("loading pre login nav and footer");
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./nav_before_login'));
            console.log($('#footerPlaceholder').load('./footer_before_login'));
        }
    });
}
loadSkeleton(); //invoke the function