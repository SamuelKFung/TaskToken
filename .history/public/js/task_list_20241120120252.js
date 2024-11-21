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

// Function to get and display tasks from Firestore
function getTasks() {
    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Query the user's tasks collection, ordered by due date
            db.collection("users").doc(user.uid)
                .collection("tasks")
                .orderBy("duedate")
                .get()
                .then(doclist => {
                    doclist.forEach(doc => {
                        currentTask = doc;
                        // Call the function to display each task
                        displayMytaskCard(currentTask);
                    })
                })
        } else {
            console.log("No user logged in");
        }
    })
}

// Initial call to get and display tasks when the page loads
getTasks();

var count = 1;

// Function to display a task card in the UI
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
        // for debugging purposes. this colour should never display if the above code is correct.
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
    
    // Get the container that holds the pill (this is where we apply flexbox)
    let pillContainer = newcard.querySelector('.card-name');

    // Set up flexbox styles for pill container
    pillContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');
    pillContainer.innerHTML = pillBadgeElement;

    newcard.querySelector('.card-description').innerHTML = desc;
    newcard.querySelector('.card-due').innerHTML = dueText;

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

// Function to handle task submission
function writeTasks(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get a reference to the tasks collection in Firestore
            var tasksRef = db.collection("users").doc(user.uid).collection("tasks");
            console.log(user.uid)
            // Get the values entered by the user in the modal
            var taskName = document.getElementById('title').value;
            var taskCourse = document.getElementById('course').value;
            var taskCategory = document.getElementById('category').value;
            var taskDescription = document.getElementById('description').value;
            var taskdueDate = document.getElementById('date').value;

            // Add a new task to Firestore with the provided details
            tasksRef.add({
                name: taskName,
                course: taskCourse,
                category: taskCategory,
                description: taskDescription,
                duedate: taskdueDate,
                status: false // Task is initially set to "not completed"
            });
            console.log("Task added!");
            alert("Task successfully added!");

            // Hide the modal after submission
            var myModalEl = document.getElementById('exampleModal');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
        } else {
            console.log("No user is signed in");
        }
    });

    // Clear the task list and reload it
    document.getElementById('mytasks-go-here').innerHTML = "";
    getTasks();
}

// Listen for the 'Edit Task' button click
document.addEventListener('click', function(event) {
    // Check if the clicked element has the 'edit-task-btn' class
    if (event.target.classList.contains('edit-task-btn')) {
        const taskCard = event.target.closest('.accordion-item'); // Get the closest task card
        const taskId = taskCard.getAttribute('data-id'); // Get the task's unique ID

        // Fetch task data from Firebase or from the stored array (based on your app's structure)
        const taskData = getTaskDataById(taskId); // Placeholder function

        // Pre-fill the modal form with the task data
        document.getElementById('title').value = taskData.title;
        document.getElementById('category').value = taskData.category;
        document.getElementById('course').value = taskData.course;
        document.getElementById('date').value = taskData.dueDate;
        document.getElementById('description').value = taskData.description;

        // Update the form's submit action to handle task updates (not create a new task)
        const form = document.getElementById('formId');
        form.onsubmit = function(event) {
            event.preventDefault();
            updateTask(taskId);
        };
    }
});

// Placeholder function to get task data from Firebase or storage
function getTaskDataById(taskId) {
    // Implement fetching task data using taskId from Firebase or your local storage
    // Example return object:
    return {
        title: "Sprint #4 Agile Planning",
        category: "Project",
        course: "COMP 1800",
        dueDate: "2024-12-01T09:00",
        description: "Plan the agile sprint for the project."
    };
}

// Function to handle updating the task in Firebase or your storage
function updateTask(taskId) {
    // Get updated values from the modal form
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const course = document.getElementById('course').value;
    const dueDate = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Update the task in Firebase or your local storage
    const taskRef = firebase.firestore().collection('tasks').doc(taskId);
    taskRef.update({
        title,
        category,
        course,
        dueDate,
        description
    }).then(function() {
        console.log("Task updated successfully!");
        // Close the modal after updating
        $('#exampleModal').modal('hide');
    }).catch(function(error) {
        console.error("Error updating task: ", error);
    });
}
