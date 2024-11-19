// Function to display a task card in the UI
function displayMytaskCard(doc) {
    var name = doc.data().name;
    var desc = doc.data().description;
    let due = new Date(doc.data().duedate);
    let today = new Date();

    // Calculate the difference in years, months, and days
    let yearsUntilDue = due.getFullYear() - today.getFullYear();
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

    // Determine the badge color based on the due date
    let pillBadgeColor;
    if (yearsUntilDue < 0 || (yearsUntilDue === 0 && monthsUntilDue < 0) || (yearsUntilDue === 0 && monthsUntilDue === 0 && daysUntilDue < 0)) {
        // Task is overdue (late)
        pillBadgeColor = "text-bg-danger";  // Red for overdue tasks
    } else if (daysUntilDue > 3 && monthsUntilDue === 0 && yearsUntilDue === 0) {
        pillBadgeColor = "text-bg-success";  // Green for tasks with plenty of time
    } else if (daysUntilDue >= 0 && daysUntilDue < 3 && monthsUntilDue === 0 && yearsUntilDue === 0) {
        pillBadgeColor = "text-bg-warning";  // Yellow for tasks due soon (within 3 days)
    } else {
        pillBadgeColor = "bg-success";  // Default green if everything is normal
    }

    // Special case for tasks due today
    if (daysUntilDue === 0 && monthsUntilDue === 0 && yearsUntilDue === 0) {
        pillBadgeColor += " border border-danger border-5";  // Add a red border for today’s tasks
    }

    let pillBadgeElement = name + "<span class=\"badge rounded-pill card-due fs-5 mx-4 mt-auto mb-auto " + pillBadgeColor + "\">" + dueText + "</span>";

    // Determine how to display the due date text
    let dueText;
    if (yearsUntilDue < 0 || (yearsUntilDue === 0 && monthsUntilDue < 0) || (yearsUntilDue === 0 && monthsUntilDue === 0 && daysUntilDue < 0)) {
        // Late task message
        dueText = "Late by " + (-yearsUntilDue) + " year(s), " + (-monthsUntilDue) + " month(s), " + (-daysUntilDue) + " day(s)";
    } else {
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
    }

    // Clone the task card template and populate it with the task data
    let newcard = document.getElementById("taskCardTemplate").content.cloneNode(true);
    newcard.querySelector('.card-name').innerHTML = pillBadgeElement;
    newcard.querySelector('.card-description').innerHTML = desc;
    newcard.querySelector('.card-due').innerHTML = dueText;

    // Add the delete functionality
    let deleteButton = newcard.querySelector('.btn-danger'); // Assuming your button in the template has the class 'btn-danger'
    deleteButton.addEventListener('click', function() {
        deleteTask(doc.id); // Pass the task ID to delete the task
    });

    // Append the new card to the tasks container
    document.getElementById("mytasks-go-here").append(newcard);
}
