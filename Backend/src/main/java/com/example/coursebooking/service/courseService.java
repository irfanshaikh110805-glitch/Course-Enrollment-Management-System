package com.example.coursebooking.service;

import com.example.coursebooking.exception.DuplicateResourceException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.course;
import com.example.coursebooking.repository.courseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class courseService {
    @Autowired
    private courseRepository courseRepository;

    public course addcourse(course course) {
        if (courseRepository.findBycourseNumber(course.getcourseNumber()).isPresent()) {
            throw new DuplicateResourceException("course " + course.getcourseNumber() + " already exists");
        }
        course.setAvailableSeats(course.getTotalSeats());
        return courseRepository.save(course);
    }

    public List<course> getAllcourses() {
        return courseRepository.findAll();
    }

    public course getcourseByNumber(String courseNumber) {
        return courseRepository.findBycourseNumber(courseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("course not found: " + courseNumber));
    }

    public course updateAvailableSeats(String id, int change) {
        course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("course not found with id: " + id));
        course.setAvailableSeats(course.getAvailableSeats() + change);
        return courseRepository.save(course);
    }

    public void deleteCourse(String id) {
        course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("course not found with id: " + id));
        
        // Check if course has enrollments
        int enrolledStudents = course.getTotalSeats() - course.getAvailableSeats();
        if (enrolledStudents > 0) {
            throw new RuntimeException("Cannot delete course with enrolled students. Please withdraw all students first.");
        }
        
        courseRepository.delete(course);
    }

    public course updatecourse(String id, course updatedCourse) {
        course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("course not found with id: " + id));
        
        // Check if course number is being changed and if it already exists
        if (!existing.getcourseNumber().equals(updatedCourse.getcourseNumber())) {
            if (courseRepository.findBycourseNumber(updatedCourse.getcourseNumber()).isPresent()) {
                throw new DuplicateResourceException("course " + updatedCourse.getcourseNumber() + " already exists");
            }
        }
        
        existing.setcourseNumber(updatedCourse.getcourseNumber());
        existing.setOrigin(updatedCourse.getOrigin());
        existing.setDestination(updatedCourse.getDestination());
        existing.setDepartureTime(updatedCourse.getDepartureTime());
        existing.setPrice(updatedCourse.getPrice());
        
        // Only update total seats if no students enrolled
        int enrolledStudents = existing.getTotalSeats() - existing.getAvailableSeats();
        if (enrolledStudents == 0) {
            existing.setTotalSeats(updatedCourse.getTotalSeats());
            existing.setAvailableSeats(updatedCourse.getTotalSeats());
        }
        
        return courseRepository.save(existing);
    }

    public course getcourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("course not found with id: " + id));
    }

    public List<course> searchcourses(String keyword) {
        return courseRepository.findByOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(keyword, keyword);
    }
}
