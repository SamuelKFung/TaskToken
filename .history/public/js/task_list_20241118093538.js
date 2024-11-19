
// This variable will hold the task ID to be deleted
let taskToDeleteId = null;

// Function to set the task ID when delete is clicked
function setTaskToDelete(taskId) {
    taskToDeleteId = taskId;
}

// Function to delete task from Firestore and DOM
function deleteTask() {
    if (!taskToDeleteId) {
        console.error("No task ID found.");
        return;
    }

    // Get Firestore reference to the specific user's task document
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const taskRef = db.collection("users").doc(user.uid).collection("tasks").doc(taskToDeleteId);

            // Delete the task from Firestore
            taskRef.delete()
                .then(() => {
                    console.log("Task successfully deleted from Firestore!");

                    // Now, remove the task from the DOM
                    const taskElement = document.getElementById(taskToDeleteId);
                    if (taskElement) {
                        taskElement.remove(); // Remove the task card from the DOM
                    }

                    // Close the modal after deletion
                    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                    deleteModal.hide();
                })
                .catch((error) => {
                    console.error("Error deleting task: ", error);
                });
        } else {
            console.log("No user logged in");
        }
    });
}

// Add event listener for the delete button in the modal
document.querySelector("#deleteModal .btn-danger").addEventListener('click', deleteTask);

// Fetch tasks from Firestore and render them
function getTasks() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .collection("tasks") //subcollection
                .orderBy("duedate")
                .get()
                .then(doclist => {
                    doclist.forEach(doc => {
                        const currentTask = doc;
                        console.log(currentTask); //unpack and see all the attributes
                        generateTaskCard(currentTask.data(), doc.id); // Pass doc.id for Firestore task ID
                    });
                })
        } else {
            console.log("No user logged in");
        }
    })
}

// Call this function when the page loads
getTasks();

// Function to generate the task card and display it in the DOM
function generateTaskCard(task, taskId) {
    // Get the task template
    const template = document.getElementById('taskCardTemplate');
    const taskCard = template.content.cloneNode(true);
    
    // Assign the ID to the task card (to remove it later)
    const taskItem = taskCard.querySelector('.accordion-item');
    taskItem.id = taskId;

    // Set the task title in the card
    taskCard.querySelector('.card-name').textContent = task.name;

    // Set the task description in the card
    taskCard.querySelector('.card-description').textContent = task.description;

    // Set the task category and due date (Optional based on your data)
    taskCard.querySelector('.category').textContent = task.category;
    taskCard.querySelector('.due-date').textContent = task.duedate;

    // Get the delete button and pass the Firestore document ID to it
    const deleteButton = taskCard.querySelector('.btn-danger');
    deleteButton.setAttribute('data-id', taskId);
    deleteButton.setAttribute('onclick', `setTaskToDelete('${taskId}')`);

    // Append the card to the list of tasks
    document.getElementById('mytasks-go-here').appendChild(taskCard);
}

// Takes all values from add task modal and stores it in firestore
function writeTasks(event) {
    event.preventDefault();

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const tasksRef = db.collection("users").doc(user.uid).collection("tasks");

            const taskName = document.getElementById('title').value;
            const taskCategory = document.getElementById('category').value;
            const taskDescription = document.getElementById('description').value;
            const taskdueDate = document.getElementById('date').value;

            tasksRef.add({
                name: taskName,
                category: taskCategory,
                description: taskDescription,
                duedate: taskdueDate,
                status: false
            }).then(() => {
                console.log("Task added!");

                // Close the modal after adding the task
                const myModalEl = document.getElementById('exampleModal');
                const modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

                // Refresh task list
                document.getElementById('mytasks-go-here').innerHTML = "";
                getTasks();
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Dynamically change modals based on which button is pressed
const exampleModal = document.getElementById('exampleModal');

if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;

        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever');
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

        // Update the modal's content.
        const modalTitleContent = exampleModal.querySelector('.modal-title');
        modalTitleContent.textContent = recipient;
    });
}

// Listens to submit button for adding task
var form = document.getElementById("formId");
form.addEventListener('submit', writeTasks);

// Function to fetch and render tasks
function fetchAndRenderTasks() {
    const db = firebase.firestore();
    db.collection('tasks').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const task = doc.data();
            task.id = doc.id;  // Store Firestore document ID
            generateTaskCard(task, doc.id);
        });
    });
}

// Fetch tasks when page loads
fetchAndRenderTasks();
