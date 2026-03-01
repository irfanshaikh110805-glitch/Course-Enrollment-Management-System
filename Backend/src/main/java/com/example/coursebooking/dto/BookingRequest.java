package com.example.coursebooking.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingRequest {
    @NotBlank(message = "student ID is mandatory")
    private String studentId;

    @NotBlank(message = "course Number is mandatory")
    private String courseNumber;

    @NotBlank(message = "Passenger Name is mandatory")
    private String passengerName;

    public BookingRequest() {
    }

    public BookingRequest(String studentId, String courseNumber, String passengerName) {
        this.studentId = studentId;
        this.courseNumber = courseNumber;
        this.passengerName = passengerName;
    }

    public String getstudentId() {
        return studentId;
    }

    public void setstudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getcourseNumber() {
        return courseNumber;
    }

    public void setcourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }
}
