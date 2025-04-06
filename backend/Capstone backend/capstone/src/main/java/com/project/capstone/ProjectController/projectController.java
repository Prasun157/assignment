package com.project.capstone.ProjectController;

import com.project.capstone.ProjectModel.project;
import com.project.capstone.ProjectService.projectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class projectController {

    private final projectService projService;

    public projectController(projectService projService) {
        this.projService = projService;
    }

    @GetMapping("/api/admin/projects")
    public List<project> getAllProjects() {
        return projService.getAllProjects();
    }

    @PostMapping("/api/admin/projects")
    public void addProject(@RequestBody project proj) {
        projService.saveProject(proj);
    }

    @PutMapping("/api/admin/projects")
    public void updateProject(@RequestBody project proj) {
        projService.updateProject(proj);
    }

    @DeleteMapping("/api/admin/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        projService.deleteProject(id);
    }

    @GetMapping("/api/admin/projects/{id}")
    public project getProjectById(@PathVariable Long id) {
        return projService.getProjectById(id);
    }

    @GetMapping("/api/projects/{empid}")
    public project getProjectById2(@PathVariable Long empid) {

        return projService.getProjectByEmployeeId(empid);
    }






}
