package com.example.coursebooking.repository;

import com.example.coursebooking.model.student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface studentRepository extends MongoRepository<student, String> {
    Optional<student> findByEmail(String email);
    List<student> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
