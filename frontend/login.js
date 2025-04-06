//global variables
let userId;
let userData;
let data;


async function loginClick(){

    const email        = document.getElementById("email").value;
    const password     = document.getElementById("password").value;
    const errorElement = document.getElementById("error-message");
    
    //basic check weatherr the fields are filled or not
    if (!email || !password) {
        errorElement.textContent = "Please fill in all fields";
        return;
    }

    try {
        const users = await getAllUserData();
        const user  = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user)); 
            
            /*After users successfullly entered longin info we divert them to  either admin
            page or employye page based on admin tag and store their userid in SessionStorage 
            of employye page or admin page to fetch that info*/
            
            if (user.admin) {
                window.location.href = "admin_page.html";
            } else {
                window.location.href = "employee_page.html";
            }
        } else {
            errorElement.textContent = "Invalid email or password";
        }
    } catch (error) {
        errorElement.textContent     = "Login failed. Please try again later.";
        console.error("Login error:", error);
    }
}


async function getAllUserData() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/emp");
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        return;
        
    }
}

async function RegisterEmployee(){

    const fname        = document.getElementById("first-name").value;
    const lname        = document.getElementById("last-name").value;
    const email1       = document.getElementById("emailR").value;
    const password1    = document.getElementById("passwordR").value;
    const skillSet1    = document.getElementById("skills").value.split(",").map(s => s.trim());
    const errorElement = document.getElementById("error-message2");
    const today        = new Date();



    if (!fname || !lname || !email1 || !password1 || !skillSet1) {
        errorElement.textContent = "Please fill in all fields";
        return;
    }
    //checking weather its official email or not using endsWith function of JavaScript
    if(!email1.endsWith("@grey.com")){
        errorElement.textContent = "Please Enter company's email only (Must end with @grey.com)";
        return;
    }

    try{
        let response = await fetch("http://localhost:8080/api/admin/emp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                firstName : fname ,
                lastName  : lname ,
                email     : email1 ,
                password  : password1 ,                 
                dateOfJoining  :  today.toISOString().split('T')[0],
                skillSet  : skillSet1,
                admin     : false
            })
        });

        if (!response.ok) {
            throw new Error("Failed to Register");
        }
        console.log("Employee Registered successfully");
    }
    catch (error){
        console.log("error error error");
        console.log(error.message);
        errorElement.textContent     = error.message;
        return;
    }
}





