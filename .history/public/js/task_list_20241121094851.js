// Get the form element by its ID
var form = document.getElementById("formId");

// Add an event listener for the form submission to call writeTasks function
form.addEventListener('submit', writeTasks);

// Get the modal element by its ID
const exampleModal = document.getElementById('exampleModal');

// Check if the modal exists on the page
if (exampleModal) {
    // Add event listener for when the modal is shown
    exampleModal.addEventListener('show.bs.modal', event => {
        // Get the button that triggered the modal
        const button = event.relatedTarget;

        // Get the value of the 'data-bs-whatever' attribute of the button (e.g., "Add Task")
        const recipient = button.getAttribute('data-bs-whatever');

        // Get the modal input and textarea elements for task details
        const modalTitle = exampleModal.querySelector(".modal-body input[id='title']");
        const modalCourse = exampleModal.querySelector(".modal-body input[id='course']");
        const modalCategory = exampleModal.querySelector(".modal-body select[id='category']");
        const modalDate = exampleModal.querySelector(".modal-body input[id='date']");
        const modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']");

        // If category is miscellaneous then disable course input field
        modalCategory.addEventListener("change", () => {
            if (modalCategory.value == "Miscellaneous") {
                modalCourse.disabled = true;
                modalCourse.value = "";
            } else {
                modalCourse.disabled = false;
            }
        })

        // If the recipient is "Add Task", reset the form fields to empty
        if (recipient == "Add Task") {
            modalTitle.value = "";
            modalCourse.value = "";
            modalCategory.value = "Assignment";
            modalDate.value = "";
            modalDescription.value = "";
        }

        // Set the modal title to match the recipient (e.g., "Add Task")
        const modalTitleContent = exampleModal.querySelector('.modal-title');
        modalTitleContent.textContent = recipient;
    })
}

// Function to get and display tasks from Firestore in real-time
function getTasks() {
    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Set up the real-time listener for the tasks collection
            db.collection("users").doc(user.uid)
                .collection("tasks")
                .orderBy("duedate")
                .onSnapshot((querySnapshot) => {
                    // Clear the task list before re-rendering
                    document.getElementById('mytasks-go-here').innerHTML = "";

                    // Loop through the updated task documents
                    querySnapshot.forEach((doc) => {
                        // Call the function to display each task
                        displayMytaskCard(doc);
                    });
                });
        } else {
            console.log("No user logged in");
        }
    });
}

// Initial call to get and display tasks when the page loads
getTasks();

var count = 1;

// Function to display a task card in the UI
function displayMytaskCard(doc) {
    var name = doc.data().name;
    var desc = doc.data().description;
    let due = new Date(doc.data().duedate);
    let today = new Date();

    let yearsUntilDue = due.getYear() - today.getYear();
    let monthsUntilDue = due.getMonth() - today.getMonth();
    let daysUntilDue = due.getDate() - today.getDate();

    var category = doc.data().category;
    var status = doc.data().status ? "Open" : "Close";

    let accordianBtn = document.getElementById("toggleBtn");
    if (accordianBtn) {
        accordianBtn.setAttribute("aria-controls", "collapse" + count);
        accordianBtn.setAttribute("data-bs-target", "#collapse" + count);
        accordianBtn.removeAttribute("id");
    }

    let collapseID = document.getElementById("collapseOne");
    if (collapseID) {
        collapseID.id = "collapse" + count++;
    }

    let pillBadgeColor; 
    if ((daysUntilDue >= 3 && monthsUntilDue == 0 && yearsUntilDue == 0) || (monthsUntilDue > 0) || (yearsUntilDue > 0)) { 
        pillBadgeColor = "text-bg-success"; 
    } else if (daysUntilDue >= 0 && daysUntilDue < 3 && monthsUntilDue == 0 && yearsUntilDue == 0) { 
        pillBadgeColor = "text-bg-warning"; 
    } else if (daysUntilDue < 0 || monthsUntilDue < 0 || yearsUntilDue < 0) { 
        pillBadgeColor = "text-bg-danger"; 
    } else { 
        pillBadgeColor = "bg-primary"; 
    } 

    if (daysUntilDue == 0 && monthsUntilDue == 0 && yearsUntilDue == 0) {
        pillBadgeColor += " border border-danger border-5";
    }

    let pillBadgeElement = name + "<span class=\"badge rounded-pill card-due fs-5 mx-4 mt-auto mb-auto " + pillBadgeColor + "\">" + daysUntilDue + " days</span>";

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
    // Clone the task card template and populate it with the task data
    let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
    newcard.querySelector('.card-name').innerHTML = pillBadgeElement;
    newcard.querySelector('.card-description').innerHTML = desc;
    newcard.querySelector('.card-due').innerHTML = dueText;

    // Add edit button event listener
    let editButton = newcard.querySelector('.btn-secondary'); // Assuming you have an edit button in your template
    editButton.addEventListener('click', function () {
        editTask(doc); // Pass the entire document snapshot to the editTask function
    });

    let deleteButton = newcard.querySelector('.btn-danger'); // Assuming your button in the template has the class 'btn-danger'
    deleteButton.addEventListener('click', function () {
        deleteTask(doc.id); // Pass the task ID to delete the task
    });

    // Append the new card to the tasks container
    document.getElementById("mytasks-go-here").append(newcard);
}

// Function to delete a task from Firestore
function deleteTask(taskId) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var taskRef = db.collection("users").doc(user.uid).collection("tasks").doc(taskId);
            taskRef.delete().then(() => {
                console.log("Task deleted!");
                alert("Task successfully deleted!");
                // Reload the task list to reflect the deletion
                document.getElementById('mytasks-go-here').innerHTML = "";
                getTasks();
            }).catch((error) => {
                console.error("Error deleting task: ", error);
            });
        } else {
            console.log("No user logged in");
        }
    });
}

// Function to handle task editing
function editTask(doc) {
    // Get the modal elements
    const exampleModal = document.getElementById('exampleModal');
    const modalTitle = exampleModal.querySelector(".modal-body input[id='title']");
    const modalCourse = exampleModal.querySelector(".modal-body input[id='course']");
    const modalCategory = exampleModal.querySelector(".modal-body select[id='category']");
    const modalDate = exampleModal.querySelector(".modal-body input[id='date']");
    const modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']");

    // Pre-fill the modal with the current task data
    modalTitle.value = doc.data().name;
    modalCourse.value = doc.data().course;
    modalCategory.value = doc.data().category;
    modalDate.value = doc.data().duedate;
    modalDescription.value = doc.data().description;

    // Change the modal title to "Edit Task"
    const modalTitleContent = exampleModal.querySelector('.modal-title');
    modalTitleContent.textContent = "Edit Task";

    // Store the task ID for later use
    exampleModal.setAttribute('data-task-id', doc.id);
}

// Function to handle form submission (editing the task)
function writeTasks(event) {
    event.preventDefault();

    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get the task ID from the modal's data attribute
            const taskId = document.getElementById('exampleModal').getAttribute('data-task-id');

            if (!taskId) {
                console.error("No task ID found");
                return;
            }

            // Get a reference to the tasks collection in Firestore
            var tasksRef = db.collection("users").doc(user.uid).collection("tasks");

            // Get the values entered by the user in the modal
            var taskName = document.getElementById('title').value;
            var taskCourse = document.getElementById('course').value;
            var taskCategory = document.getElementById('category').value;
            var taskDescription = document.getElementById('description').value;
            var taskdueDate = document.getElementById('date').value;

            // Update the task in Firestore
            tasksRef.doc(taskId).update({
                name: taskName,
                course: taskCourse,
                category: taskCategory,
                description: taskDescription,
                duedate: taskdueDate
            }).then(() => {
                console.log("Task updated!");
                alert("Task successfully updated!");

                // Hide the modal after submission
                var myModalEl = document.getElementById('exampleModal');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();
            }).catch((error) => {
                console.error("Error updating task: ", error);
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

    // Find the task card using the taskId
    let taskCard = document.querySelector(`#task-${taskId}`);
    if (taskCard) {
        // Update the task card with the new data
        taskCard.querySelector('.card-name').innerHTML = taskName + "<span class='badge rounded-pill card-due fs-5 mx-4 mt-auto mb-auto text-bg-success'>" + taskdueDate + "</span>"; // Update due date badge
        taskCard.querySelector('.card-description').innerHTML = taskDescription;
        taskCard.querySelector('.card-due').innerHTML = "Due: " + taskdueDate; // Example of updating due date text
        taskCard.querySelector('.card-category').innerHTML = taskCategory; // Update category if needed
    }

    // Clear the task list and reload it
    document.getElementById('mytasks-go-here').innerHTML = "";
    getTasks();
}