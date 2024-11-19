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
        
        // If the recipient is "Add Task", reset the form fields to empty
        if (recipient == "Add Task") { 
            modalTitle.value = ""; 
            modalCourse.value = ""; 
            modalCategory.value = "assignments"; 
            modalDate.value = ""; 
            modalDescription.value = ""; 
        } 
        
        // Set the modal title to match the recipient (e.g., "Add Task")
        const modalTitleContent = exampleModal.querySelector('.modal-title'); 
        modalTitleContent.textContent = recipient; 
    }) 
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
            
            // Get the values entered by the user in the modal
            var taskName = document.getElementById('title').value; 
            var taskCategory = document.getElementById('category').value; 
            var taskDescription = document.getElementById('description').value; 
            var taskdueDate = document.getElementById('date').value; 
            
            // Add a new task to Firestore with the provided details
            tasksRef.add({ 
                name: taskName, 
                category: taskCategory, 
                description: taskDescription, 
                duedate: taskdueDate, 
                status: false // Task is initially set to "not completed"
            }); 
            console.log("Task added!"); 
            
            // Hide the modal after submission
            var myModalEl = document.getElementById('exampleModal'); 
            var modal = bootstrap.Modal.getInstance(myModalEl) 
            modal.hide(); 
        } else { 
            console.log("No user is signed in"); 
        } 
    }); 
    
    // Clear the task list and reload it
    document.getElementById('mytasks-go-here').innerHTML = ""; 
    getTasks(); 
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

