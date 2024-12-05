# Project Title

## 1. Project Description
State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser based web application to organize all your tasks in one place. Features will include a calendar and a task tracker.

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi, my name is Daniel! I am excited to fix the Learning Hub!
* Hi, my name is Samuel! I enjoy playing badminton, gaming and hiking whenever I have free time.
* Hi I'm Owen, and I like to lift weights.
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Flaticon (Icons)
* FullCalendar (JavaScript library)
* Node/Express web application framework

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Perform npm install node in the root folder.
* Run node index.js in the root.

## 5. Known Bugs and Limitations
Here are some known bugs:
* Edit task doesn't track the status of Miscellaneous category leading to Course field displaying improperly.

## 6. Features for Future
What we'd like to build in the future:
* A reward system giving tokens based on number of completed tasks
* Tokens can be used to customize your own pixel art avatar
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore                      # Git ignore file
├── app                             # Folder containing all HTML files 
├── public                          # Folder containing all images, CSS and JS files
├── index.js                        # Root file to run node/express
├── package.json                    # Dependency for express
└── README.md                       # Read me file

It has the following subfolders and files:
├── .git                            # Folder for git repo
├── html                            # Folder containing all HTML files
    /calendar.html                      # HTML for calendar
    /index.html                         # HTML for landing page
    /login.html                         # HTML for login with Firebase
    /task_list.html                     # HTML for task list
    ├── text                            # Folder containing all navbar and footer HTML files
        /footer_after_login.html            # HTML for footer after user has logged in
        /footer_before_login.html           # HTML for footer before user has logged in
        /nav_after_login.html               # HTML for navbar after user has logged in
        /nav_before_login.html              # HTML for navbar before user has logged in
├── css                             # Folder for our CSS file
    /style.css                          # CSS file
├── img                             # Folder containing all images
    /calendar.png                       # Calendar logo on landing page
    /coin.png                           # Reward logo on landing page
    /hero.png                           # Hero image on landing page
    /list.png                           # Task list logo for landing page
    /logo.png                           # Our brand logo
├── js                              # Folder containg all JS files
    /authentication.js                  # Firebase authentication JS file
    /calendar.js                        # Calendar JS file using FullCalendar
    /client.js                          # Client side JS file
    /script.js                          # Logout functionality JS file
    /skeleton.js                        # Dynamic navbar and footer loading JS file
    /task_list.js                       # Task list JS file
```


