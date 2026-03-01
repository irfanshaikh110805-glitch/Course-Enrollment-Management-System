package com.example.coursebooking.repository;

import com.example.coursebooking.model.course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface courseRepository extends MongoRepository<course, String> {
    Optional<course> findBycourseNumber(String courseNumber);
    List<course> findByOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(String origin, String destination);
}
