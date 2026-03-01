package com.example.coursebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "enrollments")
public class enrollment {
    @Id
    private String id;

    @NotBlank(message = "Student ID is mandatory")
    private String studentId;

    @NotBlank(message = "Course ID is mandatory")
    private String courseId;

    private LocalDateTime enrollmentDate;

    private String status; // CONFIRMED, CANCELLED, PENDING

    private double feesPaid;

    private String paymentStatus; // PAID, PENDING, PARTIAL

    // Legacy fields for backward compatibility
    private String courseNumber;
    private LocalDateTime enrollmentTime;
    private double totalAmount;
    private String studentName;
    private String seatNumber;

    public enrollment() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getstudentId() {
        return studentId;
    }

    public void setstudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getcourseId() {
        return courseId;
    }

    public void setcourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getcourseNumber() {
        return courseNumber;
    }

    public void setcourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    // Backward compatibility - returns enrollmentDate if available, otherwise enrollmentTime
    public LocalDateTime getEnrollmentTime() {
        return enrollmentDate != null ? enrollmentDate : enrollmentTime;
    }

    public void setEnrollmentTime(LocalDateTime enrollmentTime) {
        this.enrollmentDate = enrollmentTime;
        this.enrollmentTime = enrollmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Backward compatibility - returns feesPaid if available, otherwise totalAmount
    public double getTotalAmount() {
        return feesPaid > 0 ? feesPaid : totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.feesPaid = totalAmount;
        this.totalAmount = totalAmount;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    // New model getters/setters
    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
        this.enrollmentTime = enrollmentDate;
    }

    public double getFeesPaid() {
        return feesPaid;
    }

    public void setFeesPaid(double feesPaid) {
        this.feesPaid = feesPaid;
        this.totalAmount = feesPaid;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
