// Get the form element by its ID
var form = document.getElementById("formId");

// Add an event listener for the form submission to call writeTasks function
form.addEventListener('submit', writeTasks);

// Get the modal element by its ID
const exampleModal = document.getElementById('exampleModal');

let taskIdToEdit = null; // Variable to hold the taskId being edited

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

        // Check if the modal is being opened for adding a new task or editing an existing task
        if (recipient === "Add Task") {
            // Reset the form fields when adding a new task
            modalTitle.value = "";
            modalCourse.value = "";
            modalCategory.value = "Assignment"; // Default category
            modalDate.value = "";
            modalDescription.value = "";
            taskIdToEdit = null; // Reset the task ID for new tasks
        } else if (recipient === "Edit Task") {
            // Fetch the task data from Firestore when editing an existing task
            const taskId = button.getAttribute('data-task-id'); // Get the taskId to edit
            taskIdToEdit = taskId;

            // Fetch the task data from Firestore
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
                .collection("tasks").doc(taskId).get().then(doc => {
                    const taskData = doc.data();
                    modalTitle.value = taskData.name;
                    modalCourse.value = taskData.course;
                    modalCategory.value = taskData.category;
                    modalDate.value = taskData.duedate;
                    modalDescription.value = taskData.description;
                });
        }
        // Set modal title dynamically based on action (Add/Edit)
        const modalTitleContent = exampleModal.querySelector('.modal-title');
        modalTitleContent.textContent = recipient;
    });
}

// Write task to Firestore (Add or Edit)
function writeTasks(event) {
    event.preventDefault();

    // Get the form values
    const taskName = document.getElementById('title').value;
    const taskCourse = document.getElementById('course').value;
    const taskCategory = document.getElementById('category').value;
    const taskDescription = document.getElementById('description').value;
    const taskDueDate = document.getElementById('date').value;

    // Check if taskIdToEdit is set, meaning we are editing an existing task
    if (taskIdToEdit) {
        // Update existing task in Firestore
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
            .collection("tasks").doc(taskIdToEdit).update({
                name: taskName,
                course: taskCourse,
                category: taskCategory,
                description: taskDescription,
                duedate: taskDueDate
            }).then(() => {
                alert("Task updated successfully!");
                closeModal();
                loadTasks(); // Refresh tasks list
            }).catch((error) => {
                console.error("Error updating task: ", error);
            });
    } else {
        // Add new task to Firestore
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
            .collection("tasks").add({
                name: taskName,
                course: taskCourse,
                category: taskCategory,
                description: taskDescription,
                duedate: taskDueDate,
                status: false
            }).then(() => {
                alert("Task added successfully!");
                closeModal();
                loadTasks(); // Refresh tasks list
            }).catch((error) => {
                console.error("Error adding task: ", error);
            });
    }
}

// Close the modal and reset taskIdToEdit
function closeModal() {
    const myModalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    taskIdToEdit = null; // Reset task ID after closing the modal
}

// Function to fetch and display tasks
function loadTasks() {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        .collection("tasks").get().then(snapshot => {
            document.getElementById("mytasks-go-here").innerHTML = ""; // Clear current tasks
            snapshot.forEach(doc => {
                displayTask(doc);
            });
        }).catch((error) => {
            console.error("Error loading tasks: ", error);
        });
}

// Function to display a task card
function displayTask(doc) {
    const taskId = doc.id;
    const taskData = doc.data();
    const name = taskData.name;
    const description = taskData.description;
    const dueDate = new Date(taskData.duedate);
    let newCard = document.getElementById("taskCardTemplate").content.cloneNode(true);
    newCard.querySelector('.card-name').innerHTML = name;
    newCard.querySelector('.card-description').innerHTML = description;
    newCard.querySelector('.card-due').innerHTML = dueDate.toDateString();

    const editButton = newCard.querySelector('.btn-secondary');
    editButton.setAttribute('data-bs-whatever', 'Edit Task');
    editButton.setAttribute('data-task-id', taskId);

    document.getElementById("mytasks-go-here").append(newCard);
}

loadTasks();
