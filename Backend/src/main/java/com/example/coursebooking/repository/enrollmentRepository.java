package com.example.coursebooking.repository;

import com.example.coursebooking.model.enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface enrollmentRepository extends MongoRepository<enrollment, String> {
    List<enrollment> findByStudentId(String studentId);
    List<enrollment> findByCourseId(String courseId);
    List<enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
}
