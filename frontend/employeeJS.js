//this are the Global varibles that stores user infoo
let user;
let userData1;
let projectData ;
let LeaveData;

//what we saved in session Storage is fetch here by this funtion and call by <body> tag onLoad
async function loadProfileData() {
    user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = "login_page.html";
        return;
    }

    
    document.getElementById("employee_name").innerHTML = `${user.firstName } ${user.lastName}`;
    showSkills();
    currentProject();
    leaveStatus();
    
}

function showSkills() {
    
    let d = `<ul class="skills-list">`;
    for (let skill of user.skillSet) {
        d += `<li class="skill-chip">
                ${skill}
                <button class="remove-btn" onclick="removeSkill('${skill}')" >×</button>
              </li>`;
    }
    d     += `</ul>`;
    document.getElementById("skills").innerHTML = d;
    
}

async function removeSkill(skill) {
    console.log("Removing:", skill);    
    user.skillSet    = user.skillSet.filter(s => s !== skill);
    
    try {
        let response = await fetch("http://localhost:8080/api/admin/emp", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to update skills: " + response.statusText);
          
        }
        console.log("skills updated Successfully");
        
      } catch (error) {
        console.error("Error:", error);
         
      } 
      
    showSkills(); 
}

async function currentProject(){
    try{
        let currProject = await fetch(`http://localhost:8080/api/projects/${user.employeeId}`)
        projectData = await currProject.json()

        if(projectData.status != "COMPLETED"){
    
            document.getElementById("projectName").textContent = projectData.projectName;
            document.getElementById("startDate").textContent   = projectData.startDate;
            document.getElementById("endDate").textContent     = projectData.endDate;
            document.getElementById("budget").textContent      = projectData.budget;
            document.getElementById("status").textContent      = projectData.status;
            document.getElementById("ProjectComplete").classList.remove("hidden");
            }
        else{ 
            throw new Error("No Assigned projects here");  

        }   
    }
    catch(error){
        document.getElementById("currentProject").innerHTML = "no current project";
        document.getElementById("ProjectComplete").classList.add("hidden");

    }
}

async function ProjectCompleted(){

    console.log("Project Completed");    
    projectData.status = "COMPLETED";

    try {
        let response = await fetch("http://localhost:8080/api/admin/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(projectData)
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to update In DataBase: " + response.statusText);
          
        }
        console.log("Updated Successfully");
        document.getElementById("ProjectComplete").classList.add("hidden");
        
      } catch (error) {
        console.error("Error:", error);
         
    } 
    currentProject();
}


async function applyLeave() {

    const Reason       = document.getElementById("reason").value;
    const FromDate     = document.getElementById("from").value;
    const ToDate       = document.getElementById("to").value;
    const errorElement = document.getElementById("error-message");

    if (!Reason || !FromDate || !ToDate) {
        errorElement.textContent = "Please fill in all fields";
        return;
    }

    try {
      let response = await fetch("http://localhost:8080/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          
          employeeId: user.employeeId,
          startDate: FromDate,
          endDate: ToDate,
          reason: Reason,
          status: "PENDING"
        })
      });
  
      if (!response.ok) {
        errorElement.textContent = "unable to apply";       

        throw new Error("Failed to apply leave: " + response.statusText);
        
      }
      console.log("Leave Applied Successfully");
      errorElement.textContent = "Applied successfully"; 
      
    } catch (error) {
      console.error("Error:", error);
      errorElement.textContent = "unable to apply"; 
    }

    leaveStatus();
}
  
async function leaveStatus(){
    try {
        let response = await fetch(`http://localhost:8080/api/admin/leaves/${user.employeeId}`);

        if (!response.ok ) {
            throw new Error("Failed to fetch leave data");
        }

        let leaveData = await response.json();
        let leaveHtml = ""; // using this to build the content
        

        for (let leave1 of leaveData) {
            leaveHtml += `<strong>Leave Applied: From:</strong> ${leave1.startDate} 
                          <strong> - To:</strong> ${leave1.endDate} 
                          <strong> | Status:</strong> ${leave1.status} <br>`;
        }
        
        //given that the LeaveHTML is empty No leave is requested displayed
        document.getElementById('leaveStatus').innerHTML = leaveHtml || "No Leave is Requested";

    } catch (error) {
        console.error("Error fetching leave data:", error);
        document.getElementById('leaveStatus').innerHTML = "No Leave is Requested";
    }
}

  
function viewHistory() {
    alert('History feature will be implemented here');
    //Under Construction
    
}

async function AddSkills() {

    const newSkillInput     = document.getElementById("newSkillInput");
    const newSkill          = newSkillInput.value.trim();
    if(newSkill) {
        user.skillSet.push(newSkill);
        newSkillInput.value = "";  
        try {
            let response    = await fetch("http://localhost:8080/api/admin/emp", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(user)
            });
        
            if (!response.ok) {               
      
              throw new Error("Failed to update skills: " + response.statusText);
              
            }
            console.log("skills updated Successfully");
            
          } catch (error) {
            console.error("Error: ", error);
             
          } 
        showSkills(); 

    } else {
        alert("Please enter a skill!");
    }    
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = "login_page.html";
}

