package com.project.capstone.ProjectModel;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.type.SqlTypes;
import lombok.Data;

@Data
@Entity
@Table(name = "project")
public class project {
    @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String projectName;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Double budget;

    @JdbcTypeCode(SqlTypes.JSON) // Maps the field to a JSONB column in PostgreSQL
    @Column(columnDefinition = "jsonb")
    private List<String> requiredSkills; // Represents a JSON array of required skills

    @Column(nullable = true)
    private Long assignedEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.UNASSIGNED;;

    public enum ProjectStatus {
        UNASSIGNED,
        ASSIGNED,
        COMPLETED
    }
}
