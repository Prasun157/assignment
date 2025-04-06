package com.project.capstone.LeaveController;

import com.project.capstone.LeaveModel.leave;
import com.project.capstone.LeaveService.leaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class leaveController {

    private final leaveService leaveService;

    public leaveController(leaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/api/admin/leaves")
    public List<leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PostMapping("/api/leaves")
    public void addLeave(@RequestBody leave leaveRequest) {
        leaveService.saveLeave(leaveRequest);
    }

    @PutMapping("/api/admin/leaves")
    public void updateLeave(@RequestBody leave leaveRequest ) {
        leaveService.updateLeave(leaveRequest );
    }

    @DeleteMapping("/api/leaves/{id}")
    public void deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
    }

    @GetMapping("/api/admin/leaves/{id}")
    public List<leave> getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

}
