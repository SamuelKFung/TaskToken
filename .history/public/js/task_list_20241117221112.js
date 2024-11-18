// Listens to submit button for adding task
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
        const modalCourse = exampleModal.querySelector(".modal-body input[id='course']");
        const modalCategory = exampleModal.querySelector(".modal-body select[id='category']");
        const modalDate = exampleModal.querySelector(".modal-body input[id='date']");
        const modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']");
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.
        if (recipient == "Add Task") {
            modalTitle.value = "";
            modalCourse.value = "";
            modalCategory.value = "assignments";
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

// Takes all values from add task modal and stores it in firestore
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

// Reads tasks data from firestore
function getTasks() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid)
            db.collection("users").doc(user.uid)
                .collection("tasks") //subcollection
                .orderBy("duedate")
                .get()
                .then(doclist => {
                    doclist.forEach(doc => {
                        currentTask = doc;
                        console.log(currentTask);   //unpack and see all the attributes
                        displayMytaskCard(currentTask);
                    })
                })
        } else {
            console.log("No user logged in");
        }
    })
}
getTasks();
var count = 1;
//------------------------------------------------------------
// this function displays ONE card, with information
// from the post document extracted (name, description, image)
//------------------------------------------------------------
function displayMytaskCard(doc) {
    var name = doc.data().name; // get value of the "name" key
    var desc = doc.data().description;
    let due = new Date(doc.data().duedate);
    let today = new Date();
    let yearsUntilDue = due.getYear() - today.getYear()
    let monthsUntilDue = due.getMonth() - today.getMonth();
    let daysUntilDue = due.getDate() - today.getDate();
    console.log(daysUntilDue)
    var category = doc.data().category;
    var status = doc.data().status ? "Open" : "Close";

    // Changing the attributes of the button so that it only closes one and not all
    let accordianBtn = document.getElementById("toggleBtn");
    if (accordianBtn) {
        accordianBtn.setAttribute("aria-controls", "collapse" + count);
        accordianBtn.setAttribute("data-bs-target", "#collapse" + count);
        accordianBtn.removeAttribute("id");
    }

    // https://www.geeksforgeeks.org/how-to-change-the-id-of-element-using-javascript/
    let collapseID = document.getElementById("collapseOne")
    console.log(collapseID)
    if (collapseID) {
        collapseID.id = "collapse" + count++;
    }

    let pillBadgeColor;
    if (daysUntilDue > 3 && monthsUntilDue == 0 && yearsUntilDue == 0) {
        pillBadgeColor = "text-bg-success";
    } else if (daysUntilDue >= 0 && daysUntilDue < 3 && monthsUntilDue == 0 && yearsUntilDue == 0) {
        pillBadgeColor = "text-bg-warning";
    } else if (daysUntilDue < 0 && monthsUntilDue == 0 && yearsUntilDue == 0) {
        pillBadgeColor = "text-bg-danger";
    } else {
        pillBadgeColor = "bg-success"
    }
    if (daysUntilDue == 0 && monthsUntilDue == 0 && yearsUntilDue == 0) {
        pillBadgeColor += " border border-danger";
    }

    let pillBadgeElement = name + "<span class=\"badge rounded-pill card-due fs-5 mx-4 mt-auto mb-auto " + pillBadgeColor + "\">14</span>";

    let dueText;

    if (Math.abs(yearsUntilDue) < 1) {
        if (Math.abs(monthsUntilDue) < 1) {
            if (daysUntilDue > 0) {
                dueText = daysUntilDue + (daysUntilDue == 1 ? " day out" : " days out");
            } else if (daysUntilDue < 0) {
                dueText = -daysUntilDue + (daysUntilDue == -1 ? " day late" : " days late");
            } else {
                dueText = "Due today!";
            }
        } else {
            if (monthsUntilDue >= 0) {
                dueText = monthsUntilDue + (monthsUntilDue == 1 ? " month out" : " months out");
            } else {
                dueText = -monthsUntilDue + (monthsUntilDue == -1 ? " month late" : " months late");
            }
        }
    } else {
        if (yearsUntilDue >= 0) {
            dueText = yearsUntilDue + (yearsUntilDue == 1 ? " year out" : " years out");
        } else {
            dueText = -yearsUntilDue + (yearsUntilDue == -1 ? " year late" : " years late");
        }
    }

    //clone the new card
    let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
    //populate with title, image

    newcard.querySelector('.card-name').innerHTML = pillBadgeElement;
    //newcard.querySelector('.card-status').innerHTML = status;
    //newcard.querySelector('.card-category').innerHTML = category;
    newcard.querySelector('.card-description').innerHTML = desc;
    newcard.querySelector('.card-due').innerHTML = dueText;
    //append to the posts
    document.getElementById("mytasks-go-here").append(newcard);
}
