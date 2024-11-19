// Global variable for calendar to use in all functions.
let calendar;

// Renders calendar from FullCalendar JS library
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    // Sets defaults for calendar view
    calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventDisplay: 'block',
        eventBorderColor: 'black',
        aspectRatio: 2,
        // Display a dynamic modal depending on which event is clicked
        eventClick: function(info) {
            var exampleModal = document.getElementById("exampleModal");
            var myModal = new bootstrap.Modal(exampleModal);
            const modalTitleContent = exampleModal.querySelector(".modal-title");
            const modalCourse = exampleModal.querySelector(".modal-body p[id='course']");
            const modalCategory = exampleModal.querySelector(".modal-body p[id='category']");
            const modalDate = exampleModal.querySelector(".modal-body p[id='date']");
            const modalDescription = exampleModal.querySelector(".modal-body p[id='description']");
            const modalBackground = exampleModal.querySelector(".modal-content");
            modalTitleContent.textContent = info.event.title;
            modalCategory.textContent = "Category: " + info.event.extendedProps.category;
            if (info.event.extendedProps.course) {
                modalCourse.textContent = "Course: " + info.event.extendedProps.course;
            } else {
                modalCourse.textContent = "";
            }
            modalDate.textContent = "Due Date: " + info.event.start;
            if (info.event.extendedProps.description){
            modalDescription.textContent = "Description: " + info.event.extendedProps.description;
            } else {
                modalDescription.textContent = "";
            }
            modalBackground.style.border = "1px solid white";
            modalBackground.style.backgroundColor = info.event.backgroundColor 
            myModal.show();
        }
    })
    readEvents();
    calendar.render();
})

// Reads tasks data from firestore
function readEvents(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user){
            db.collection("users").doc(user.uid)
            .collection("tasks") //subcollection
            .get()
            .then(doclist=>{
                doclist.forEach(doc=>{
                    let color;
                    switch (doc.data().category) {
                        case "Lab":
                            color = "#3B1E54";
                            break;
                        case "Assignment":
                            color = "#65091D";
                            break
                        case "Quiz":
                            color = "#725700";
                            break;
                        case "Project":
                            color = "#053F26";
                            break;
                        case "Miscellaneous":
                            color = "#3A4B50";
                            break;
                        default: 
                            color = "white";
                    }
                    calendar.addEvent({
                        title: doc.data().name,
                        start: doc.data().duedate,
                        end: doc.data().duedate,
                        backgroundColor: color,    
                        extendedProps: {
                            category: doc.data().category,
                            description: doc.data().description, 
                            course: doc.data().course
                        }
                    })
                })
            })
        } else {
            console.log("No user logged in");
        }
    })
}