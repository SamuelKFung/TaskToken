var form = document.getElementById("formId");
form.addEventListener('submit', writeTasks);
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

function writeTasks(event) {
    event.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var tasksRef = db.collection("users").doc(user.uid).collection("tasks");
            var taskName = document.getElementById('title').value;
            var taskCategory = document.getElementById('category').value;
            var taskDescription = document.getElementById('description').value;
            var taskdueDate = document.getElementById('date').value;
            tasksRef.add({
                name: taskName,
                category: taskCategory,
                description: taskDescription,
                duedate: taskdueDate,
                status: false
            });
            console.log("Task added!");
            var myModalEl = document.getElementById('exampleModal');
            var modal = bootstrap.Modal.getInstance(myModalEl)
            modal.hide();
        } else {
            console.log("No user is signed in");
        }
    });
    document.getElementById('mytasks-go-here').innerHTML = "";
    getTasks();
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
                    currentTask = doc;
                    console.log (currentTask);   //unpack and see all the attributes
                    displayMytaskCard(currentTask);
                })
            })
        } else {
            console.log("No user logged in");
        }
    })
}
getTasks();

//------------------------------------------------------------
// this function displays ONE card, with information
// from the post document extracted (name, description, image)
//------------------------------------------------------------
function displayMytaskCard(doc) {
            var name = doc.data().name; // get value of the "name" key
            var desc = doc.data().description; 
            var due = doc.data().duedate; 
            var category = doc.data().category;
            var status = doc.data().status ? "Open":"Close";
            //clone the new card
            let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
            //populate with title, image
            newcard.querySelector('.card-name').innerHTML = name;
            newcard.querySelector('.card-status').innerHTML = status;
            newcard.querySelector('.card-category').innerHTML = category;
            newcard.querySelector('.card-description').innerHTML = desc;
            newcard.querySelector('.card-due').innerHTML = due;
            //append to the posts
            document.getElementById("mytasks-go-here").append(newcard);
}
