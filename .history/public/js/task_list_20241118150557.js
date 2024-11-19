var form = document.getElementById("formId"); 
form.addEventListener('submit', writeTasks); 

const exampleModal = document.getElementById('exampleModal'); 
if (exampleModal) { 
    exampleModal.addEventListener('show.bs.modal', event => { 
        const button = event.relatedTarget; 
        const recipient = button.getAttribute('data-bs-whatever'); 
        const modalTitle = exampleModal.querySelector(".modal-body input[id='title']"); 
        const modalCourse = exampleModal.querySelector(".modal-body input[id='course']"); 
        const modalCategory = exampleModal.querySelector(".modal-body select[id='category']"); 
        const modalDate = exampleModal.querySelector(".modal-body input[id='date']"); 
        const modalDescription = exampleModal.querySelector(".modal-body textarea[id='description']"); 
        if (recipient == "Add Task") { 
            modalTitle.value = ""; modalCourse.value = ""; modalCategory.value = "assignments"; modalDate.value = ""; modalDescription.value = ""; 
        } 
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
            tasksRef.add({ name: taskName, category: taskCategory, description: taskDescription, duedate: taskdueDate, status: false }); 
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

function getTasks() { 
    firebase.auth().onAuthStateChanged(function (user) { 
        if (user) { 
            db.collection("users").doc(user.uid) 
                .collection("tasks") 
                .orderBy("duedate") 
                .get() 
                .then(doclist => { 
                    doclist.forEach(doc => { 
                        currentTask = doc; 
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
    if (daysUntilDue > 3 && monthsUntilDue == 0 && yearsUntilDue == 0) { 
        pillBadgeColor = "text-bg-success"; 
    } else if (daysUntilDue >= 0 && daysUntilDue < 3 && monthsUntilDue == 0 && yearsUntilDue == 0) { 
        pillBadgeColor = "text-bg-warning"; 
    } else if (daysUntilDue < 0 && monthsUntilDue == 0 && yearsUntilDue == 0) { 
        pillBadgeColor = "text-bg-danger"; 
    } else { 
        pillBadgeColor = "bg-success"; 
    } 
    if (daysUntilDue == 0 && monthsUntilDue == 0 && yearsUntilDue == 0) { 
        pillBadgeColor += " border border-danger border-5"; 
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
            dueText = (monthsUntilDue >= 0 ? monthsUntilDue : -monthsUntilDue) + (monthsUntilDue == 1 ? " month out" : " months out"); 
        } 
    } else { 
        dueText = (yearsUntilDue >= 0 ? yearsUntilDue : -yearsUntilDue) + (yearsUntilDue == 1 ? " year out" : " years out"); 
    } 
    let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true); 
    newcard.querySelector('.card-name').innerHTML = pillBadgeElement; 
    newcard.querySelector('.card-description').innerHTML = desc; 
    newcard.querySelector('.card-due').innerHTML = dueText; 
    document.getElementById("mytasks-go-here").append(newcard); 
}

  // Attach event listener to the delete button
  document.querySelector('.btn-danger').addEventListener('click', function (event) {
    // Assuming each task has a unique identifier (data-id or similar)
    const taskId = event.target.getAttribute('data-id'); // This is an example, adjust as necessary
    const taskElement = document.getElementById(taskId); // Find the task element

    // Store the task element in the modal's delete button so we can access it on confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.addEventListener('click', function () {
      // Delete the task (remove from DOM or make an API call to delete from the server)
      taskElement.remove(); // Removes the task from the DOM
      
      // Close the modal after deletion
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.hide();
    });

    // You can also store other related information (like the task ID) if you need it for AJAX calls
  });
