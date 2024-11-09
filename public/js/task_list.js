// Dynamically change modals based on which button is pressed 
const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')
        const modalTitle = exampleModal.querySelector(".modal-body input[id='title']");
        const modalDate = exampleModal.querySelector(".modal-body input[id='date']");
        const modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']");
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.
        if (recipient == "Add Task") {
            modalTitle.value = "";
            modalDate.value = "";
            modalDescription.value = "";
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

//-------------------------------------------------
// this function shows finds out who is logged in,
// reads the "myposts" field (an array) for that user, 
// reads the details for each item in the array
// and displays a card for each item. 
//------------------------------------------------
function showMyTasks() {
      firebase.auth().onAuthStateChanged(user => {
            console.log("user is: " + user.uid);
            db.collection("users").doc(user.uid)
                    .get()
                    .then(doc => {
                        myposts = doc.data().myposts; //get array of my posts
                        console.log(myposts);
                        myposts.forEach(item => {
                            db.collection("posts")
                                .doc(item)
                                .get()
                                .then(doc => {
                                    displayMytaskCard(doc);
                                })
                        })
                    })
      })
}
showMyTasks();

//------------------------------------------------------------
// this function displays ONE card, with information
// from the post document extracted (name, description, image)
//------------------------------------------------------------
function displayMytaskCard(doc) {
            var title = doc.data().name; // get value of the "name" key
            var desc = doc.data().description; //gets the length field
            var image = doc.data().image; //the field that contains the URL 

            //clone the new card
            let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
            //populate with title, image
            newcard.querySelector('.card-title').innerHTML = title;
            //newcard.querySelector('.card-image').src = image;
            //newcard.querySelector('.card-description').innerHTML = desc;
            //append to the posts
            document.getElementById("mytasks-go-here").append(newcard);
}