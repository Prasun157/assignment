package com.project.capstone.ProjectService;

import com.project.capstone.EmployeeModel.employee;
import com.project.capstone.EmployeeRepository.employeeRepository;
import com.project.capstone.ProjectModel.project;
import com.project.capstone.ProjectRepository.projectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class projectService {

    private Long nextId = 5L;

    @Autowired
    private projectRepository projRepo;

    public projectService(projectRepository projRepo) {
        this.projRepo = projRepo;
    }

    public List<project> getAllProjects() {
        return projRepo.findAll();
    }

    public void saveProject(project project1) {
        project1.setProjectId(nextId++);
        projRepo.save(project1);
    }

    public void deleteProject(Long id) {
        List<project> projA = projRepo.findAll();

        for (project project1 : projA) {
            if (id.equals(project1.getProjectId())) {
                projRepo.delete(project1);
            }
        }
    }

    public void updateProject(project project1) {
        List<project> projA = projRepo.findAll();
        for (project project2 : projA) {
            if (project1.getProjectId().equals(project2.getProjectId())) {
                projRepo.delete(project2);
                projRepo.save(project1);
//                projRepo.upsert()
            }
        }
    }

    public project getProjectById(Long id) {
        List<project> proj = projRepo.findAll();
        for (project project1 : proj) {
            if (id.equals(project1.getProjectId())) {
                return project1;
            }
        }
        return null;
    }

    public project getProjectByEmployeeId(Long empid) {
        List<project> proj = projRepo.findAll();

        for(project project1:proj){
            if(empid == project1.getAssignedEmployeeId()){
                return project1;
            }
        }

        return null;


    }


}
