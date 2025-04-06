//golbal variables
let a_user;
let all_users;
let LeaveData;
let ProjectData;

//this function callls other functions and help to load data onto the dashboard of Adminpage
async function loadProfileData() {
    a_user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!a_user) {
        window.location.href = "login_page.html";
        return;
    }

    document.getElementById("admin_name").innerHTML = `${a_user.firstName } ${a_user.lastName}`;
    all_users = await A_getAllUserData();
    displayEmployees();
    LeaveDataDisplay();
    ProjectDataDisplay();
 
    
}


async function A_getAllUserData() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/emp");
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
        

    } catch (error) {

        console.error("Error fetching user data:", error);
        showToast(error.message);
    }
}


function displayEmployees() {
    let tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";  //this is where the data is loaded

    for(let user of all_users) {
        let row = document.createElement("tr");
       
        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.skillSet.join(", ")}</td>
            <td>
                <button onclick="editUser(${user.employeeId})">Edit</button>
                <button onclick="deleteUser(${user.employeeId}) "  style='background-color:red;'>Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    };
}

/*Edit user function and Save user function works hand in hand as a modal appers when this function is called 
on that modal input tabs with prefilled value are there help user to edit just the stuff they want to edit*/

function editUser(employeeId) {
    let user = all_users.find(emp => emp.employeeId === employeeId);
    if (!user) return;
      
    document.getElementById("editEmployeeId").value = user.employeeId;
    document.getElementById("editName").value = `${user.firstName} ${user.lastName}`;
    document.getElementById("editSkills").value = user.skillSet.join(", ");

    if(user.admin == true){
        document.getElementById("editAdmin").checked = true;   

    }
    else{
        document.getElementById("editAdmin").checked = false;   


    }

    // Show modal
    document.getElementById("editModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
    
}

// every modal's close function call this function
function closeModal() {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("editProjectModal").style.display = "none";
    document.getElementById("addProjectModal").style.display = "none";    
    document.getElementById("allocationModal").style.display = "none";
    
    
}

async function saveChanges() {

    employeeId = parseInt(document.getElementById("editEmployeeId").value);    
    let user = all_users.find(emp => emp.employeeId === employeeId);        
    user.firstName = document.getElementById("editName").value.split(" ")[0];
    user.lastName = document.getElementById("editName").value.split(" ")[1];
    user.skillSet = document.getElementById("editSkills").value.split(",").map(s => s.trim());
    user.admin = document.getElementById("editAdmin").checked;

    console.log(user);

    try {
        let response = await fetch("http://localhost:8080/api/admin/emp", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to update user info");
          
        }
        console.log("updated Successfully");
        
      } catch (error) {
        console.error("Error:", error.message);
        showToast(error.message);
        closeModal();
        return;

         
      }

    showToast("Changes Saved");
    closeModal();
    displayEmployees();
}

//simply calling the Delete API of employee modal
async function deleteUser(emplpyeeId){

    try {
        let response = await fetch(`http://localhost:8080/api/admin/emp/${emplpyeeId}`, {
          method: "DELETE"          
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to Delete");
          
        }
        console.log("Deleated Successfully");
        
      } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
         
      }
      showToast("User Deleted");

      loadProfileData();

}

async function LeaveDataDisplay(){

    try{
        let LeavesResponse = await fetch(`http://localhost:8080/api/admin/leaves`)
        leaveData = await LeavesResponse.json();
        
        if(!LeavesResponse.ok){
            throw new Error("failed to fetch leave data ");
        }
        else{
            let tableBody = document.getElementById("leaveTableBody");
            tableBody.innerHTML = ""; 

            for(let user of leaveData) {
                let row = document.createElement("tr");                
                let specificUser = all_users.find(userA => userA.employeeId == user.employeeId);
                if(user.status == "PENDING"){
                    row.innerHTML = `
                        <td>${specificUser.firstName} ${specificUser.lastName}</td>                        
                        <td>${user.startDate}</td>
                        <td>${user.endDate}</td>
                        <td>${user.reason}</td>
                        <td>${user.status}</td>
                        <td>
                            <button onclick="LeaveApprovel(${user.leaveId} , true)">Approve</button>
                            <button onclick="LeaveApprovel(${user.leaveId} , false)">Reject</button>
                        </td>
                    `;
                }else{
                    row.innerHTML = `
                        <td>${specificUser.firstName} ${specificUser.lastName}</td>
                        <td>${user.startDate}</td>
                        <td>${user.endDate}</td>
                        <td>${user.reason}</td>
                        <td>${user.status}</td>
                        
                    `;

                }

                tableBody.appendChild(row);
            }
        }        
    }
    catch(error){
        console.log("there is some error of get leave data : " , error);
        showToast(error.message);
    }
}

/*Inner html of LeaveDataDisplay consist of leaveApprovel function where if it is approved flag if true else false helping this
function to address the Api put request as we are updating the leave entity only */
async function LeaveApprovel( leavvId , flag){
    
    let currUserLeaveRequest = leaveData.find(s => s.leaveId == leavvId);

    if(flag){
        currUserLeaveRequest.status = "APPROVED";
        
    }
    else{
        currUserLeaveRequest.status = "REJECTED";
    }


    try {
        let response = await fetch("http://localhost:8080/api/admin/leaves", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(currUserLeaveRequest)
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to update Leave Changes");
          
        }
        console.log("updated Successfully the leave changes");
        
      } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
         
      }
    
    showToast("Leave Approved");
    LeaveDataDisplay();


}

/* here we have used 2 different html tags for Assigned and Unasssigned projects making the dashboard more user friendly
and this part of capstone less complex , the assign table consist both assigned and completed peojects */
async function ProjectDataDisplay(){

    try{
        let ProjectResponse = await fetch(`http://localhost:8080/api/admin/projects`)
        ProjectData = await ProjectResponse.json();
        
        if(!ProjectResponse.ok){
            throw new Error("failed to fetch Project data ");
        }
        else{
            let tableBodyUnassigned = document.getElementById("Unassigned_ProjectTableBody");
            let tableBodyAssigned   = document.getElementById("Assigned_ProjectTableBody");

            tableBodyUnassigned.innerHTML     = ""; 
            tableBodyAssigned.innerHTML       = "";

            for(let project1 of ProjectData) {
                let row          = document.createElement("tr");                
                let specificUser = all_users.find(userA => userA.employeeId == project1.assignedEmployeeId);
               
                row.innerHTML    = `
                    <td>${project1.projectName}</td> 
                    <td>${project1.requiredSkills}</td>                       
                    <td>${project1.startDate}</td>
                    <td>${project1.endDate}</td>
                    <td>${project1.budget}</td>
                    <td>${project1.status}</td>`;
                if(project1.status == "UNASSIGNED"){
                    row.innerHTML+=`<td>
                                    <button onclick="ProjectEdit(${project1.projectId})">Edit</button>                          
                                    
                                    <button onclick="ProjectAssigned(${project1.projectId})" class="gradient-button">Assign</button>
                                    <button onclick="ProjectDelete(${project1.projectId})" style='background-color:red' >Delete</button>                           
                                    </td>`;
                    tableBodyUnassigned.appendChild(row);
                }
                else{
                    
                    row.innerHTML+=`<td>${specificUser.firstName} ${specificUser.lastName}</td>
                                    <td>
                                    <button onclick="ProjectEdit(${project1.projectId})">Edit</button>                           
                                    </td>`;
                    if(project1.status=="ASSIGNED"){
                        row.innerHTML+=`<td>
                                        <button onclick="ProjectAssigned(${project1.projectId})"  class="gradient-button">Reassign</button>
                                        <button onclick="ProjectDelete(${project1.projectId} )" style='background-color:red;'>Delete</button>                           
                                        </td>`;
                    }

                    tableBodyAssigned.appendChild(row);
                    /*reassign and assign button both call the same function ProjectAssigned where
                     use use PUT API to update projects assigned employee and its status */


                }
                            
            }
        }        
    }
    catch(error){
        console.log("there is some error of get leave data : " , error);
        showToast(error.message);
    }
}

/* The core functionality of the Intelligent Workforce Allocation System (IWAS) API begins here.
The /api/admin/empAvailable endpoint retrieves a list of currently available employees. On the 
backend, an SQL query joins multiple tables to identify employees who are not administrators, have
not applied for leave (or whose approved leave does not include today), and are not assigned to 
project. This list is used for both manual and intelligent assignment. In manual assignment, a dropdown
allows administrators to select an employee easily. For intelligent assignment, the system provides
the list of available employees and required project skills to the IWAS function (explained below).
The IWAS function takes an object and a list of skill-related strings as input, returning the most suitable 
employee based on skill matching and suggesting the best candidate to the administrator. */
async function ProjectAssigned(projectId){

    
    let response     = await fetch("http://localhost:8080/api/admin/empAvailable")
    let AvailableEmp = await response.json()
    // console.log(AvailableEmp);
    
    document.getElementById("AssignProjectId").innerHTML=projectId;
    let optionsEmp      = document.getElementById("options");
    optionsEmp.innerHTML= "";

    document.getElementById("AssignProjectId").value = projectId;
    let ThisProject = ProjectData.find(pro => pro.projectId === projectId);
    
    const Skill_Emp = new Object();


    for(let p of AvailableEmp){
        const userinfo        = all_users.find(s=> s.employeeId == p)
        optionsEmp.innerHTML +=  `<option value="${userinfo.employeeId}">${userinfo.firstName} ${userinfo.lastName}</option>`
        
        Skill_Emp[userinfo.employeeId] = userinfo.skillSet;
     }

    let Suggestion_Result    = iwas(ThisProject.requiredSkills , Skill_Emp);
    if(Suggestion_Result){
    const name = all_users.find(s=> s.employeeId    == Suggestion_Result);
    document.getElementById("iwasId").value         = Suggestion_Result;
    document.getElementById("suggestion").innerHTML = `${name.firstName} ${name.lastName}`;
   }
   else{
    document.getElementById("suggestion").innerHTML = `No Recommendation`;

   }


    document.getElementById("allocationModal").style.display = "block";
    document.getElementById("modalOverlay").style.display    = "block";
    

}


async function Allocation(IntelligentAllocation){

    try{
        let projectId   = parseInt(document.getElementById("AssignProjectId").value);
        let ThisProject = ProjectData.find(pro => pro.projectId === projectId);
        if (!ThisProject) return;

        ThisProject.status = "ASSIGNED"
        if(IntelligentAllocation == 1 ){
            if(document.getElementById("suggestion").innerHTML!= `No Recommendation`){
                ThisProject.assignedEmployeeId = document.getElementById("iwasId").value;
            }
            else{
                throw new Error("No Employee Recommendate, Please Assign Manually");
             }
        }else{
            ThisProject.assignedEmployeeId = document.getElementById("options").value;
        }
        
        let response   = await fetch("http://localhost:8080/api/admin/projects", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ThisProject)
        });

        if (!response.ok) {
            throw new Error("Failed to Assign project");
        }
        console.log("Project Assign successfully");
    } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
        return;
    }

    // Close modal and refresh project display
    showToast("Project Assigned");
    closeModal();
    ProjectDataDisplay();
 

}

async function ProjectDelete(projectId){

    try {
        let response = await fetch(`http://localhost:8080/api/admin/projects/${projectId}`, {
          method: "DELETE"          
        });
    
        if (!response.ok) {               
  
          throw new Error("Failed to Delete");
          
        }
        console.log("Deleated Successfully");
        
      } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
         
      }
      document.getElementById("notification").style.backgroundColor = "red";
      showToast("Project Deleted");
      ProjectDataDisplay();
    


}

function projectPrevalues(ProjectId){

    let ThisProject = ProjectData.find(pro => pro.projectId === ProjectId);
    if (!ThisProject) return;
    
    //function creation 
    document.getElementById("editProjectId").value=ThisProject.projectId;
    document.getElementById("editProjectName").value=ThisProject.projectName;
    document.getElementById("editProjectSkills").value=ThisProject.requiredSkills;
    document.getElementById("editProjectStartDate").value=ThisProject.startDate;
    document.getElementById("editProjectEndDate").value=ThisProject.endDate;
    document.getElementById("editProjectBudget").value=ThisProject.budget
    document.querySelector(`input[name="projectStatus"][value="${ThisProject.status}"]`).checked = true;

}

function ProjectEdit(ProjectId ) {

   
    projectPrevalues(ProjectId); 

    // Show modal
    document.getElementById("editProjectModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";


    
    
}

async function saveProject() {
    try{
    let projectId   = parseInt(document.getElementById("editProjectId").value);
    let ThisProject = ProjectData.find(pro => pro.projectId === projectId);
    if (!ThisProject) return;
    // Update project details
    ThisProject.projectName    = document.getElementById("editProjectName").value;
    ThisProject.requiredSkills = document.getElementById("editProjectSkills").value.split(",").map(s => s.trim());
    ThisProject.startDate      = document.getElementById("editProjectStartDate").value;
    ThisProject.endDate        = document.getElementById("editProjectEndDate").value;
    ThisProject.budget         = parseFloat(document.getElementById("editProjectBudget").value);  

    if(ThisProject.status == "UNASSIGNED" && document.querySelector('input[name="projectStatus"]:checked').value!="UNASSIGNED"){
        
        throw new Error("click Assign befour editing an Unassigned project")
    }
    
    // console.log(document.querySelector('input[name="projectStatus"]:checked').value)
    
    let selectedStatus = document.querySelector('input[name="projectStatus"]:checked');
    ThisProject.status = selectedStatus ? selectedStatus.value : ThisProject.status;

    
        let response   = await fetch("http://localhost:8080/api/admin/projects", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ThisProject)
        });

        if (!response.ok) {
            throw new Error("Failed to update project");
        }
        console.log("Project updated successfully");
    } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
        return;
    }

    // Close modal and refresh project display
    showToast("Project Updated");
    closeModal();
    ProjectDataDisplay();
}


function AddProject(){

    document.getElementById("addProjectModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";

}

async function saveNewProject() {

    try{    

        let response = await fetch("http://localhost:8080/api/admin/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                projectName : document.getElementById("addProjectName").value,
                requiredSkills: document.getElementById("addProjectSkills").value.split(",").map(s => s.trim()),
                startDate : document.getElementById("addProjectStartDate").value,
                endDate : document.getElementById("addProjectEndDate").value,
                budget : parseFloat(document.getElementById("addProjectBudget").value)
            })
        });

        if (!response.ok) {
            throw new Error("Failed to Add project");
        }
        console.log("Project Added successfully");
    } catch (error) {
        console.error("Error:", error);
        showToast(error.message);
        return;
    }

    // Close modal and refresh project display
    showToast("Project Added");
    closeModal();
    ProjectDataDisplay();
}

//used for popUp notifications on the admins page 
function showToast(message) {
    let toast = document.getElementById("notification");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}

//simply removes the Current user and returns to the login page. One must login to reentre the admin page
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = "login_page.html";
}

/* The iwas function selects the most suitable employee based on skill matching.
It takes s (a list of required skills) and t (an object mapping employee IDs to their skills).
The function normalises skill names to lowercase, then checks how many required skills each 
employee possesses. The employee with the highest match count is returned as the best candidate. */
function iwas(s , t ){
    
    const normalize = (str) => str.toLowerCase();
    const sSet = new Set(s.map(normalize));
    
    let bestMatch = null;
    let maxMatches = 0;
    
    for (const [employeeId, skills] of Object.entries(t)) {
        let count = skills.map(normalize).filter(skill => sSet.has(skill)).length;
        
        if (count > maxMatches) {
            maxMatches = count;
            bestMatch = employeeId;
        }
    }
    
    return bestMatch;
}