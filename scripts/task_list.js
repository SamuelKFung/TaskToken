//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("cardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    
    db.collection(collection).get()   //the collection called "hikes"
        .then(allTasks=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allTasks.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "details" key
				var course = doc.data().course;   
                //				var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                //var length = doc.data().hikeLength; //gets the length field
              // var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
                
                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-due').innerHTML = 3 +" days";
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-course').innerHTML = course;
                //newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                // newcard.querySelector('a').href = "eachHike.html?docID="+docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("tasks");  //input param is the name of the collection