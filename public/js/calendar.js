// Global variable for calendar to use in all functions.
let calendar;

// Renders calendar from FullCalendar library 
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar')
    calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventDisplay: 'block',
        eventBorderColor: 'black',
        aspectRatio: 2
    })
    readEvents()
    //myEvents.forEach(event => calendar.addEvent(event))
    calendar.render()
})

// Reads tasks data from firestore
function readEvents(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user){
            console.log(user.uid)
            db.collection("users").doc(user.uid)
            .collection("tasks") //subcollection
            .get()
            .then(doclist=>{
                doclist.forEach(doc=>{
                    let color;
                    console.log(doc.data().category)
                    switch (doc.data().category) {
                        case "lab":
                            color = "#250731"
                            break
                        case "assignment":
                            color = "#65091D"
                            break
                        case "quiz":
                            color = "#725700"
                            break
                        case "project":
                            color = "#134C3F"
                            break
                        case "miscellaneous":
                            color = "#053F26"
                            break
                        default: 
                            color = "white"
                    }

                    calendar.addEvent({
                        title: doc.data().name,
                        start: doc.data().duedate,
                        end: doc.data().duedate,
                        backgroundColor: color,    
                    })
                })
            })
        } else {
            console.log("No user logged in");
        }
    })
}
console.log(calenda)