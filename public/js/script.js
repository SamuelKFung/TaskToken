//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("logging out user");
        window.location.href = "/";
    }).catch((error) => {
        console.log("error logging out");
      });
}