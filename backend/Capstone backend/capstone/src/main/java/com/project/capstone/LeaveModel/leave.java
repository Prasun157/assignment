package com.project.capstone.LeaveModel;
import com.project.capstone.EmployeeModel.employee;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "leaves")
public class leave {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;

    @Column(nullable = false)
    private Long EmployeeId;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(length = 500 ,nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING;

    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED
    }

}
