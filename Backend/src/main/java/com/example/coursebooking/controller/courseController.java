package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.model.course;
import com.example.coursebooking.service.courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class courseController {
    @Autowired
    private courseService courseService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<course>> add(@Valid @RequestBody course course) {
        course saved = courseService.addcourse(course);
        return ResponseEntity.ok(ApiResponse.success("course added successfully", saved));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<course>>> getAll() {
        List<course> courses = courseService.getAllcourses();
        return ResponseEntity.ok(ApiResponse.success("Fetched all courses", courses));
    }

    @GetMapping("/{courseNumber}")
    public ResponseEntity<ApiResponse<course>> getByNumber(@PathVariable String courseNumber) {
        course course = courseService.getcourseByNumber(courseNumber);
        return ResponseEntity.ok(ApiResponse.success("Fetched course successfully", course));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<course>> getById(@PathVariable String id) {
        course course = courseService.getcourseById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched course successfully", course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<course>> update(@PathVariable String id, @Valid @RequestBody course course) {
        course updated = courseService.updatecourse(id, course);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<course>>> search(@RequestParam String keyword) {
        List<course> courses = courseService.searchcourses(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", courses));
    }
}