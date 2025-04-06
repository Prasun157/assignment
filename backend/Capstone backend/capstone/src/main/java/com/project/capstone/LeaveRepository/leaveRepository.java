package com.project.capstone.LeaveRepository;

import com.project.capstone.LeaveModel.leave;
import org.springframework.data.jpa.repository.JpaRepository;


public interface leaveRepository extends JpaRepository<leave, Long> {

}
