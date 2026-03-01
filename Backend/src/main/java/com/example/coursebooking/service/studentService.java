package com.example.coursebooking.service;

import com.example.coursebooking.exception.DuplicateResourceException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.student;
import com.example.coursebooking.repository.studentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class studentService {
    @Autowired
    private studentRepository studentRepository;

    public student registerstudent(student student) {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new DuplicateResourceException("student with email " + student.getEmail() + " already exists");
        }
        return studentRepository.save(student);
    }

    public List<student> getAllstudents() {
        return studentRepository.findAll();
    }

    public student getstudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("student not found with id: " + id));
    }

    public student updatestudent(String id, student updatedStudent) {
        student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("student not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!existing.getEmail().equals(updatedStudent.getEmail())) {
            if (studentRepository.findByEmail(updatedStudent.getEmail()).isPresent()) {
                throw new DuplicateResourceException("student with email " + updatedStudent.getEmail() + " already exists");
            }
        }
        
        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setPhone(updatedStudent.getPhone());
        return studentRepository.save(existing);
    }

    public void deletestudent(String id) {
        student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("student not found with id: " + id));
        studentRepository.delete(student);
    }

    public List<student> searchstudents(String keyword) {
        return studentRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }
}
