package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.model.student;
import com.example.coursebooking.service.studentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class studentController {
    @Autowired
    private studentService studentService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<student>> register(@Valid @RequestBody student student) {
        student saved = studentService.registerstudent(student);
        return ResponseEntity.ok(ApiResponse.success("student registered successfully", saved));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<student>>> getAll() {
        List<student> students = studentService.getAllstudents();
        return ResponseEntity.ok(ApiResponse.success("Fetched all students", students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<student>> getById(@PathVariable String id) {
        student student = studentService.getstudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched student successfully", student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<student>> update(@PathVariable String id, @Valid @RequestBody student student) {
        student updated = studentService.updatestudent(id, student);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        studentService.deletestudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<student>>> search(@RequestParam String keyword) {
        List<student> students = studentService.searchstudents(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", students));
    }
}