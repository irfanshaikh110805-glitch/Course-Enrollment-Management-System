package com.example.coursebooking.service;

import com.example.coursebooking.dto.BookingRequest;
import com.example.coursebooking.exception.InsufficientSeatsException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.enrollment;
import com.example.coursebooking.model.student;
import com.example.coursebooking.model.course;
import com.example.coursebooking.repository.enrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class enrollmentService {
    @Autowired
    private enrollmentRepository enrollmentRepository;
    @Autowired
    private courseService courseService;
    @Autowired
    private studentService studentService;

    public enrollment enrollStudent(BookingRequest request) {
        student student = studentService.getstudentById(request.getstudentId());
        course course = courseService.getcourseByNumber(request.getcourseNumber());

        // Check for duplicate enrollment
        List<enrollment> existingEnrollments = enrollmentRepository.findByStudentIdAndCourseId(
                student.getId(), course.getId());
        for (enrollment e : existingEnrollments) {
            if ("CONFIRMED".equals(e.getStatus())) {
                throw new RuntimeException("Student is already enrolled in this course");
            }
        }

        if (course.getAvailableSeats() <= 0) {
            throw new InsufficientSeatsException("No seats available for course: " + course.getcourseNumber());
        }

        // Calculate seat number
        int seatNum = course.getTotalSeats() - course.getAvailableSeats() + 1;

        // Create enrollment
        enrollment enrollment = new enrollment();
        enrollment.setstudentId(student.getId());
        enrollment.setcourseId(course.getId());
        enrollment.setcourseNumber(course.getcourseNumber());
        enrollment.setSeatNumber("S-" + seatNum);
        enrollment.setEnrollmentTime(LocalDateTime.now());
        enrollment.setStatus("CONFIRMED");
        enrollment.setTotalAmount(course.getPrice());
        enrollment.setStudentName(request.getPassengerName());

        // Update seats
        courseService.updateAvailableSeats(course.getId(), -1);

        return enrollmentRepository.save(enrollment);
    }

    public enrollment cancelEnrollment(String enrollmentId) {
        enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("enrollment not found: " + enrollmentId));

        if ("CANCELLED".equals(enrollment.getStatus())) {
            throw new RuntimeException("enrollment is already cancelled");
        }

        enrollment.setStatus("CANCELLED");
        // Free seat
        courseService.updateAvailableSeats(enrollment.getcourseId(), 1);

        return enrollmentRepository.save(enrollment);
    }

    public List<enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<enrollment> getEnrollmentsBystudent(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<enrollment> getEnrollmentsBycourse(String courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public enrollment updateEnrollment(String id, enrollment updatedEnrollment) {
        enrollment existing = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + id));
        
        // Update allowed fields
        if (updatedEnrollment.getStudentName() != null) {
            existing.setStudentName(updatedEnrollment.getStudentName());
        }
        if (updatedEnrollment.getSeatNumber() != null) {
            existing.setSeatNumber(updatedEnrollment.getSeatNumber());
        }
        
        return enrollmentRepository.save(existing);
    }
}
