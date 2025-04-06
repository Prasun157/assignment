package com.project.capstone.EmployeeRepository;

import com.project.capstone.EmployeeModel.employee;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface employeeRepository  extends JpaRepository<employee,Long> {

    @Query("SELECT  distinct a.employeeId\n" +
            "FROM employee a\n" +
            "LEFT JOIN leave b on a.employeeId = b.EmployeeId \n" +
            "LEFT JOIN project c on a.employeeId=c.assignedEmployeeId\n" +
            "WHERE a.isAdmin != true\n" +
            "  AND (b.EmployeeId IS NULL OR b.status = 'REJECTED'  OR b.status= 'PENDING' OR (b.status = 'APPROVED' AND CURRENT_DATE NOT BETWEEN b.startDate AND b.endDate))\n" +
            "  AND c.assignedEmployeeId is NULL OR c.status= 'COMPLETED'\n")
    List<Long> findAllAvailableEmployeeIds();

}