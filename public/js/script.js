//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
      });
}