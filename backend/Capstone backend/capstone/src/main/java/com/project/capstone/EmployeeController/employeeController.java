package com.project.capstone.EmployeeController;

import com.project.capstone.EmployeeModel.employee;
import com.project.capstone.EmployeeService.employeeService;
import com.project.capstone.ProjectModel.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class employeeController {

    employeeService empService;


    public employeeController(employeeService emp) {
        this.empService = emp;
    }

    @GetMapping("/api/admin/emp")
    public List<employee> GettingEmployee(){
        return empService.getAllEmployees();
    }

    @PostMapping("/api/admin/emp")
    public void addEmployee(@RequestBody employee emp){
        empService.SaveEmployee(emp);
    }
    @DeleteMapping("/api/admin/emp/{id}")
    public void deleteEmployee(@PathVariable Long id){
        empService.DeleteEmployee(id);
    }
    @PutMapping("/api/admin/emp")
    public void updateEmployee(@RequestBody employee emp){
        empService.UpdateEmployee(emp);
    }
    @GetMapping("/api/admin/emp/{id}")
    public employee getEmployeeById(@PathVariable Long id){
        return empService.getEmployeeById(id);
    }

    @GetMapping("/api/admin/empAvailable")
    public List<Long> getEmployeeAvailable(){
        return empService.getAllAvailableEmployeeIds();
    }
}
