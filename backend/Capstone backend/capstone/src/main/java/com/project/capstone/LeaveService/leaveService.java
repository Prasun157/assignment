package com.project.capstone.LeaveService;

import com.project.capstone.LeaveModel.leave;
import com.project.capstone.LeaveRepository.leaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class leaveService  {


    @Autowired
    private leaveRepository leaveRepo;
    long nextId = 5L;

    public leaveService(leaveRepository leaveRepo) {
        this.leaveRepo = leaveRepo;
    }

    public List<leave> getAllLeaves() {
        return leaveRepo.findAll();
    }

    public void saveLeave(leave leave1) {
        leave1.setLeaveId(nextId++);
        leaveRepo.save(leave1);
    }

    public void deleteLeave(Long id) {
        List<leave> leaveA = leaveRepo.findAll();
        for (leave leave1 : leaveA) {
            if (id.equals(leave1.getLeaveId())) {
                leaveRepo.delete(leave1);
            }
        }
    }

    public void updateLeave(leave leave1 ) {
        List<leave> leaveA = leaveRepo.findAll();
        for (leave leave2 : leaveA) {
            if (leave1.getLeaveId().equals(leave2.getLeaveId())) {
                leaveRepo.delete(leave2);
                leaveRepo.save(leave1);
            }
        }
    }

    public List<leave> getLeaveById(Long id) {
        List<leave> leaveA = leaveRepo.findAll();
        List<leave> answer = new ArrayList<>();
        for (leave leave1 : leaveA) {
            if (id.equals(leave1.getEmployeeId())) {
                answer.add(leave1);
            }
        }
        if(answer.isEmpty()){
            return null;
        }
        return answer;
    }


}
