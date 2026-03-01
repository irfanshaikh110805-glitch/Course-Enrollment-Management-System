package com.example.coursebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Document(collection = "courses")
public class course {
    @Id
    private String id;

    @NotBlank(message = "Course code is mandatory")
    @Indexed(unique = true)
    private String courseCode;

    @NotBlank(message = "Course name is mandatory")
    private String courseName;

    private String description;

    @Min(value = 1, message = "Duration must be at least 1")
    private int duration; // in weeks or months

    @Min(value = 0, message = "Fees cannot be negative")
    private double fees;

    @Min(value = 1, message = "Max capacity must be at least 1")
    private int maxCapacity;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    // Legacy fields for backward compatibility
    private String courseNumber;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private int totalSeats;
    private int availableSeats;
    private double price;

    public course() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Backward compatibility - courseNumber maps to courseCode
    public String getcourseNumber() {
        return courseCode != null ? courseCode : courseNumber;
    }

    public void setcourseNumber(String courseNumber) {
        this.courseCode = courseNumber;
        this.courseNumber = courseNumber;
    }

    // Backward compatibility - origin maps to courseName
    public String getOrigin() {
        return courseName != null ? courseName : origin;
    }

    public void setOrigin(String origin) {
        this.courseName = origin;
        this.origin = origin;
    }

    // Backward compatibility - destination maps to description
    public String getDestination() {
        return description != null ? description : destination;
    }

    public void setDestination(String destination) {
        this.description = destination;
        this.destination = destination;
    }

    // Backward compatibility - departureTime maps to startDate
    public LocalDateTime getDepartureTime() {
        return startDate != null ? startDate : departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.startDate = departureTime;
        this.departureTime = departureTime;
    }

    // Backward compatibility - totalSeats maps to maxCapacity
    public int getTotalSeats() {
        return maxCapacity > 0 ? maxCapacity : totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.maxCapacity = totalSeats;
        this.totalSeats = totalSeats;
        if (this.availableSeats == 0) {
            this.availableSeats = totalSeats;
        }
    }

    public int getAvailableSeats() {
        return availableSeats > 0 ? availableSeats : maxCapacity;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    // Backward compatibility - price maps to fees
    public double getPrice() {
        return fees > 0 ? fees : price;
    }

    public void setPrice(double price) {
        this.fees = price;
        this.price = price;
    }

    // New model getters/setters
    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
        this.courseNumber = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
        this.origin = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.destination = description;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public double getFees() {
        return fees;
    }

    public void setFees(double fees) {
        this.fees = fees;
        this.price = fees;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
        this.totalSeats = maxCapacity;
        if (this.availableSeats == 0) {
            this.availableSeats = maxCapacity;
        }
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
        this.departureTime = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
