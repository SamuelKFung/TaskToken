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
