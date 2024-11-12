//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    console.log("loadSkeleton run");
    firebase.auth().onAuthStateChanged(function (user) {
<<<<<<< HEAD:scripts/skeleton.js
        if (user) {
            // If the "user" variable is not null, then someone is logged in
=======
        if (user) {              
            console.log("loading post login nav and footer")     
		        // If the "user" variable is not null, then someone is logged in
>>>>>>> d99fdd1d1aa782d60c9a188901d1f62f82dd6a1d:public/js/skeleton.js
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