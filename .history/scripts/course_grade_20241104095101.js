// Function to read the lab01 grade from the Firestore "courses" collection
// Input param is the String representing the course document name
function readLab01Info(course) {
    // Access the course document directly
    db.collection("courses").doc(course) // Ensure the course name matches the document in Firestore
        .onSnapshot(courseDoc => { // Using courseDoc for clarity
            if (!courseDoc.exists) {
                console.log("No such course document!");
                return; // Exit if document doesn't exist
            }

            console.log("Current course document data: ", courseDoc.data()); // .data() returns data object

            // Now access the 'labs' collection within the course document
            const labsRef = db.collection("courses").doc(course).collection("labs").doc("lab01");
            labsRef.onSnapshot(labDoc => {
                if (!labDoc.exists) {
                    console.log("No such lab document!");
                    return; // Exit if the lab document doesn't exist
                }

                console.log("Current lab document data: ", labDoc.data());
                const lab01Grade = labDoc.data().lab01_grade; // Access the lab01_grade field
                const lab01DueDate = labDoc.data().lab01_due_date;
                document.getElementById("lab01-grade-goes-here").innerHTML = lab01Grade;
                document.getElementById("lab01-due-date-goes-here").innerHTML = lab01DueDate; // Display the data

            }, (error) => {
                console.error("Error calling onSnapshot for lab document", error);
            });

        }, (error) => {
            console.error("Error calling onSnapshot for course document", error);
        });
}

// Call the function with the correct course document name
readLab01Info("1510"); // Make sure this document exists in Firestore
