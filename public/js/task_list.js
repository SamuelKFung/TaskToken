// Get the form element by its ID
var form = document.getElementById("formId");

// Global variable pointing to the current user's Firestore document
var currentUser;

// Global variable to reference modal fields
var modalTitle;
var modalCourse;
var modalCategory;
var modalDate;
var modalDescription;

// Get the modal element by its ID
const exampleModal = document.getElementById('exampleModal');

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            insertNameFromFirestore();
            getTasks();
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "app/html/login.html";
        }
    });
}
doAll();

// Check if the modal exists on the page
if (exampleModal) {
    // Add event listener for when the modal is shown
    exampleModal.addEventListener('show.bs.modal', event => {
        // Get the button that triggered the modal
        const button = event.relatedTarget;
        // Get the value of the 'data-bs-whatever' attribute of the button (e.g., "Add Task")
        const recipient = button.getAttribute('data-bs-whatever');

        // Get the modal input and textarea elements for task details
        modalTitle = exampleModal.querySelector(".modal-body input[id='title']");
        modalCourse = exampleModal.querySelector(".modal-body input[id='course']");
        modalCategory = exampleModal.querySelector(".modal-body select[id='category']");
        modalDate = exampleModal.querySelector(".modal-body input[id='date']");
        modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']");

        // If category is miscellaneous then disable course input field
        modalCategory.addEventListener("change", () => {
            if (modalCategory.value == "Miscellaneous") {
                modalCourse.disabled = true;
                modalCourse.value = "";
            } else {
                modalCourse.disabled = false;
            }
        })

        // If the recipient is "Add Task", reset the form fields to empty and add listener on submit
        if (recipient == "Add Task") {
            modalTitle.value = "";
            modalCourse.value = "";
            modalCategory.value = "Assignment";
            modalDate.value = "";
            modalDescription.value = "";
            form.addEventListener('submit', writeTasks);
        }

        // Set the modal title to match the recipient (e.g., "Add Task")
        const modalTitleContent = exampleModal.querySelector('.modal-title');
        modalTitleContent.textContent = recipient;
    })
    // Clear event listener to avoid adding and editing happening from one submit
    exampleModal.addEventListener('hide.bs.modal', () => {
        form.removeEventListener('submit', writeTasks);
    })
}

// Function to get and display tasks from Firestore in real-time
function getTasks() {
    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUser = db.collection("users").doc(user.id);
            // Query the user's tasks collection, ordered by due date
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

var count = 1;

// Function to display a task card in the UI
function displayMytaskCard(doc) {
    var name = doc.data().name;
    var desc = doc.data().description;
    let due = new Date(doc.data().duedate);
    let today = new Date();

    // Current time (Unix)
    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Calculates due date and time (Unix)
    const dueUnixTime = Math.floor(due.getTime() / 1000);
    const secondsInDay = 86400;

    // Calculate the difference in seconds
    const timeDifference = dueUnixTime - currentUnixTime;
    console.log("Time Difference (in seconds):", timeDifference); // Debugging log

    const daysUntilDue = Math.floor(timeDifference / secondsInDay);
    console.log("Days Until Due:", daysUntilDue); // Debugging log

    // Calculate the difference in months and years (approximate)
    const daysInYear = 365.25;
    const daysInMonth = 30.44;

    const monthsUntilDue = Math.round((daysUntilDue % daysInYear) / daysInMonth);
    console.log("Months Until Due:", monthsUntilDue); // Debugging log
    const yearsUntilDue = Math.round(daysUntilDue / daysInYear);
    console.log("Years Until Due:", yearsUntilDue); // Debugging log

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
    if ((daysUntilDue >= 3 && monthsUntilDue == 0 && yearsUntilDue == 0) || (monthsUntilDue > 0 && yearsUntilDue >= 0) || (yearsUntilDue > 0)) { 
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

    // Calculate dueText based on whether the task is overdue, due today, or in the future
    let dueText;
    if (daysUntilDue === 0) {
        // Case where task is due today
        dueText = "Due today!";
    } else if (daysUntilDue > 0) {
        // Case where task is not due yet
        if (Math.abs(yearsUntilDue) < 1) {
            if (Math.abs(monthsUntilDue) < 1) {
                // Show days
                dueText = daysUntilDue + (daysUntilDue === 1 ? " day until due" : " days until due");
            } else {
                // Show months
                dueText = monthsUntilDue + (monthsUntilDue === 1 ? " month until due" : " months until due");
            }
        } else {
            // Show years
            dueText = yearsUntilDue + (yearsUntilDue === 1 ? " year until due" : " years until due");
        }
    } else {
        // Case where task is overdue
        if (daysUntilDue > -daysInYear) {
            if (daysUntilDue > -daysInMonth) {
                // Show days overdue
                dueText = Math.abs(daysUntilDue) + (Math.abs(daysUntilDue) === 1 ? " day overdue" : " days overdue");
            } else {
                // Show months overdue
                dueText = Math.abs(monthsUntilDue) + (Math.abs(monthsUntilDue) === 1 ? " month overdue" : " months overdue");
            }
        } else {
            // Show years overdue
            dueText = Math.abs(yearsUntilDue) + (Math.abs(yearsUntilDue) === 1 ? " year overdue" : " years overdue");
        }
    }
    
    // Clone the task card template and populate it with the task data
    let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
    newcard.querySelector('.card-name').innerHTML = pillBadgeElement;
    newcard.querySelector('.card-description').innerHTML = desc;
    newcard.querySelector('.card-due').innerHTML = dueText;

    // Add edit button and event listener to each card 
    let editButton = newcard.querySelector('#editTask'); 
    editButton.addEventListener('click', function () {
        // Pass the entire document snapshot to the editTask function
        editTasks(doc.id); 
    });

    // Add delete button and event listener to each card
    let deleteButton = newcard.querySelector('#deleteTask'); 
    deleteButton.addEventListener('click', function () {
         // Pass the task ID to delete the task
        deleteTask(doc.id);
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
                alert("Task successfully deleted!");
                getTasks();
            }).catch((error) => {
                console.error("Error deleting task: ", error);
            });
        } else {
            console.log("No user logged in");
        }
    });
}

// Function to writing tasks data to Firestore
function writeTasks(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get a reference to the tasks collection in Firestore
            var tasksRef = db.collection("users").doc(user.uid).collection("tasks");

            // Get the values entered by the user in the modal
            var taskName = document.getElementById('title').value;
            var taskCourse = document.getElementById('course').value;
            var taskCategory = document.getElementById('category').value;
            var taskDescription = document.getElementById('description').value;
            var taskdueDate = document.getElementById('date').value;

            // Add the task in Firestore
            tasksRef.add({
                name: taskName,
                course: taskCourse,
                category: taskCategory,
                description: taskDescription,
                duedate: taskdueDate
            }).then(() => {
                console.log("Task added!");
                // Hide the modal after submission
                var myModalEl = document.getElementById('exampleModal');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();
                getTasks();
            }).catch((error) => {
                console.error("Error updating task: ", error);
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Function to handle editing task
function editTasks(taskId) {
    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get a reference to the specific task that needs to be updated
            var taskRef = db.collection("users").doc(user.uid).collection("tasks").doc(taskId);
            taskRef.get().then(userDoc => {
                // Update modal fields according to the specific task properties
                modalTitle.value = userDoc.data().name;
                modalCourse.value = userDoc.data().course;
                modalCategory.value = userDoc.data().category;
                modalDescription.value = userDoc.data().description;
                modalDate.value = userDoc.data().duedate;
            })
            
            // Add listener for submission when editting task 
            form.addEventListener('submit', function updateTask(event) {
                // Prevent page refresh
                event.preventDefault();
                // Update Firestore values according to modal inputs
                taskRef.update({
                    name: modalTitle.value,
                    category: modalCategory.value,
                    course: modalCourse.value,
                    description: modalDescription.value,
                    duedate: modalDate.value
                }).then(() => {
                    // Remove edit submit to prevent triggering with add submit 
                    form.removeEventListener('submit', updateTask);
                    // Hide the modal after submission
                    var myModalEl = document.getElementById('exampleModal');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                    getTasks();
                })  
            })
        } else {
            console.log("No user is signed in");
        }
    });
}

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //Get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        document.getElementById("name-goes-here").innerText = "Welcome " + user_Name;
    })
}
