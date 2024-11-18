// Listens for form submission to add tasks
document.getElementById("formId").addEventListener('submit', writeTasks);

// Dynamically update modal based on button clicked
const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute('data-bs-whatever');
        const modal = exampleModal.querySelector(".modal-body");
        const fields = ['title', 'course', 'category', 'date', 'description'];

        if (recipient === "Add Task") {
            fields.forEach(field => modal.querySelector(`#${field}`).value = (field === 'category' ? 'assignments' : ''));
        }

        exampleModal.querySelector('.modal-title').textContent = recipient;
    });
}

// Handles task submission and stores it in Firestore
function writeTasks(event) {
    event.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const tasksRef = db.collection("users").doc(user.uid).collection("tasks");
            const taskData = ['title', 'category', 'description', 'date'].reduce((data, field) => {
                data[field] = document.getElementById(field).value;
                return data;
            }, { status: false });

            tasksRef.add(taskData).then(() => {
                console.log("Task added!");
                bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
                getTasks();
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Reads tasks from Firestore
function getTasks() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("tasks").orderBy("duedate")
                .get().then(doclist => doclist.forEach(doc => displayTaskCard(doc)));
        }
    });
}

// Displays a task card
function displayTaskCard(doc) {
    const { name, description, category, duedate, status } = doc.data();
    const due = new Date(duedate);
    const today = new Date();
    const daysUntilDue = Math.floor((due - today) / (1000 * 3600 * 24));
    const pillBadgeColor = daysUntilDue > 3 ? "text-bg-success" : (daysUntilDue >= 0 ? "text-bg-warning" : "text-bg-danger");
    const dueText = daysUntilDue === 0 ? "Due today!" : `${Math.abs(daysUntilDue)} ${daysUntilDue > 0 ? 'days out' : 'days late'}`;

    const card = document.getElementById("taskCardTemplate").content.cloneNode(true);
    card.querySelector('.card-name').innerHTML = `${name}<span class="badge rounded-pill card-due fs-5 ${pillBadgeColor} mx-4">${dueText}</span>`;
    card.querySelector('.card-description').textContent = description;
    card.querySelector('.card-due').textContent = dueText;

    document.getElementById("mytasks-go-here").append(card);
}

// Initialize task display on load
getTasks();
