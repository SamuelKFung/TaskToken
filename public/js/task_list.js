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

function getTasks(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user){
            console.log(user.uid)
            db.collection("users").doc(user.uid)
            .collection("tasks") //subcollection
            .get()
            .then(doclist=>{
                doclist.forEach(doc=>{
                    console.log (doc.data());   //unpack and see all the attributes
                    //document.getElementById("tasks-go-here").innerHTML += "<p> " + doc.data().title + " </p>"
                }
                )
            })
        } else{
            console.log("No user logged in");
        }
    })
}
getTasks();
/*
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
                            console.log("item is: " + item)
                            db.collection("posts")
                                .doc(item)
                                .get()
                                .then(doc => {
                                    console.log("this is the doc = " + doc.data().name)
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
            var name = doc.data().name; // get value of the "name" key
            var desc = doc.data().description; 
            var due = doc.data().date; 
            //clone the new card
            let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
            //populate with title, image
            newcard.querySelector('.card-name').innerHTML = name;
            //newcard.querySelector('.card-image').src = image;
            newcard.querySelector('.card-description').innerHTML = desc;
            newcard.querySelector('.card-due').innerHTML = date;
            //append to the posts
            document.getElementById("mytasks-go-here").append(newcard);
}

function savePost() {
    alert ("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            var name = document.getElementById("name").value;
            var date = document.getElementById("date").value;
            var desc = document.getElementById("description").value;
            db.collection("posts").add({
                owner: user.uid,
                name: name,
                date: date,
                description: desc,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp() //current system time
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                savePostIDforUser(doc.id);
            })
        } else {
            // No user is signed in.
                          console.log("Error, no user signed in");
        }
    });
}   

//--------------------------------------------
//saves the post ID for the user, in an array
//--------------------------------------------
function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
          console.log("user id is: " + user.uid);
          console.log("postdoc id is: " + postDocID);
          db.collection("users").doc(user.uid).update({
                myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
          })
          .then(() =>{
                console.log("5. Saved to user's document!");
                                alert ("Post is complete!");
                //window.location.href = "showposts.html";
           })
           .catch((error) => {
                console.error("Error writing document: ", error);
           });
    })
}*/