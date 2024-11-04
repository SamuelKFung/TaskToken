// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readTaskName(task) {
    db.collection("tasks").doc(task)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(taskDoc => {                                                              //arrow notation
            console.log("current document data: " + taskDoc.data());                          //.data() returns data object
            document.getElementById("task-name-goes-here").innerHTML = taskDoc.data().name;      //using javascript to display the data on the right place
            document.getElementById("due-date-goes-here").innerHTML = taskDoc.data().due; 
            document.getElementById("descripition-goes-here").innerHTML = taskDoc.data().description; 
            document.getElementById("course-goes-here").innerHTML = taskDoc.data().course; 
            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log ("Error calling onSnapshot", error);
        });
    }
 readTaskName("task1");        //calling the function