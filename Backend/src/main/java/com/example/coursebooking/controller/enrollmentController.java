package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.dto.BookingRequest;
import com.example.coursebooking.model.enrollment;
import com.example.coursebooking.service.enrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class enrollmentController {
    @Autowired
    private enrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<enrollment>> enroll(@Valid @RequestBody BookingRequest request) {
        enrollment enrollment = enrollmentService.enrollStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled successfully", enrollment));
    }

    @PostMapping("/cancel/{enrollmentId}")
    public ResponseEntity<ApiResponse<enrollment>> cancel(@PathVariable String enrollmentId) {
        enrollment cancelled = enrollmentService.cancelEnrollment(enrollmentId);
        return ResponseEntity.ok(ApiResponse.success("Enrollment cancelled successfully", cancelled));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<enrollment>>> getAll() {
        List<enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(ApiResponse.success("Fetched all enrollments", enrollments));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<enrollment>>> getBystudent(@PathVariable String studentId) {
        List<enrollment> enrollments = enrollmentService.getEnrollmentsBystudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fetched student enrollments", enrollments));
    }

    @GetMapping("/stats/{courseId}")
    public ResponseEntity<ApiResponse<List<enrollment>>> getStats(@PathVariable String courseId) {
        List<enrollment> enrollments = enrollmentService.getEnrollmentsBycourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Fetched course enrollment details", enrollments));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<enrollment>>> getByCourse(@PathVariable String courseId) {
        List<enrollment> enrollments = enrollmentService.getEnrollmentsBycourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Fetched course enrollments", enrollments));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<enrollment>> update(@PathVariable String id, @Valid @RequestBody enrollment enrollment) {
        enrollment updated = enrollmentService.updateEnrollment(id, enrollment);
        return ResponseEntity.ok(ApiResponse.success("Enrollment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<enrollment>> withdraw(@PathVariable String id) {
        enrollment cancelled = enrollmentService.cancelEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment withdrawn successfully", cancelled));
    }
}
