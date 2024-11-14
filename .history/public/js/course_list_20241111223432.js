// Dynamically change modals based on which button is pressed 
const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')
        const modalTitle = exampleModal.querySelector(".modal-body input[id='title']");
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.
        if (recipient == "Add Task") {
            modalTitle.value = "";
        }
        /*
        if (recipient == "Edit Task") {
            modalTitle.value = document.getElementById('task-name-goes-here').innerHTML;
            modalDate.value = document.getElementById('due-date-goes-here').innerHTML;
            modalDescription.value = document.getElementById('description-goes-here').innerHTML;
        }*/
        // Update the modal's content.
        const modalTitleContent = exampleModal.querySelector('.modal-title');
        modalTitleContent.textContent = recipient;
    })
}

var currentUser;               //points to the document of the user who is logged in
function populateCourseInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            let courseName = userDoc.data().course_name;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                            }
                            if (userSchool != null) {
                                document.getElementById("schoolInput").value = userSchool;
                            }
                            if (userCity != null) {
                                document.getElementById("cityInput").value = userCity;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateCourseInfo();

//a) get user entered values
courseName = document.getElementById('course_name').value;

