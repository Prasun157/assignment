package com.project.capstone.EmployeeService;

import com.project.capstone.EmployeeModel.employee;
import com.project.capstone.EmployeeRepository.employeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;


@Service
public class employeeService  {

//    public List<employee> emp = new ArrayList<>() ;
    private Long nextId = 1L;
    private JdbcTemplate jdbcTemplate;

    @Autowired
    employeeRepository empRepo;

    public employeeService(employeeRepository empRepo) {
        this.empRepo = empRepo;
    }


    public List<employee> getAllEmployees(){
        return empRepo.findAll();
    }


    public void SaveEmployee(employee employee1){
        employee1.setEmployeeId(nextId++);
        empRepo.save(employee1);
//        return "Saved Successfully";
    }


    public void DeleteEmployee(Long id){
        List<employee> empA = empRepo.findAll();

        for(employee employee1:empA){
            if(id == employee1.getEmployeeId()){
                empRepo.delete(employee1);
//                return "Deleted Successfully";
            }
        }
//        return "Employee Not Found";

    }


    public void UpdateEmployee(employee employee1){
        List<employee> empA = empRepo.findAll();
        for(employee employee2:empA){
            if(employee1.getEmployeeId() == employee2.getEmployeeId()){
                empRepo.delete(employee2);
                empRepo.save(employee1);
//                return "Updated Successfully";
            }
        }
//        return "Employee Not Found";
    }

    public employee getEmployeeById(Long id){
        List<employee> emp = empRepo.findAll();
        for(employee employee1:emp){
            if(id == employee1.getEmployeeId()){
                return employee1;
            }
        }
        return null;
    }

    public List<Long> getAllAvailableEmployeeIds() {
        return empRepo.findAllAvailableEmployeeIds();
    }



}
