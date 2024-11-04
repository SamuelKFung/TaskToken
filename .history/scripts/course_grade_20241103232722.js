// Function to read the lab01 grade from the Firestore "courses" collection
// Input param is the String representing the course document name
function readLab01Grade(course) {
    db.collection("courses").doc(course) // Ensure the course name matches the document in Firestore
        .onSnapshot(course => { // Arrow notation
            console.log("current document data: ", course.data()); // .data() returns data object
            
            // You may need to define how to get the lab category from the course document
            const category = courseDoc.data().category; // Assuming 'category' exists in courseDoc

            db.collection("labs").doc(category) // Use the category to get the lab document
                .onSnapshot(categoryDoc => {
                    console.log("current document data: ", categoryDoc.data());
                    document.getElementById("lab01-grade-goes-here").innerHTML = categoryDoc.data().lab01_grade; // Display the data

                }, (error) => {
                    console.log("Error calling onSnapshot for category", error);
                });

        }, (error) => {
            console.log("Error calling onSnapshot for course", error);
        });
}

// Call the function with the correct course name
readLab01Grade("lab01_grade"); // Make sure this document exists in Firestore
