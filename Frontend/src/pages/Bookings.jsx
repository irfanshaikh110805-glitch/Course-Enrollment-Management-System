import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Alert, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { bookingService, courseService, studentService } from '../services/api';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [courses, setcourses] = useState([]);
    const [students, setstudents] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filters, setFilters] = useState({ courseId: '', studentId: '' });
    const [formData, setFormData] = useState({ studentId: '', courseNumber: '', passengerName: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, bookings]);

    const refreshData = async () => {
        try {
            const [bRes, fRes, cRes] = await Promise.all([
                bookingService.getAll(),
                courseService.getAll(),
                studentService.getAll()
            ]);
            setBookings(bRes.data.data || []);
            setcourses(fRes.data.data || []);
            setstudents(cRes.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const applyFilters = () => {
        let filtered = [...bookings];
        if (filters.courseId) {
            filtered = filtered.filter(b => b.courseId === filters.courseId);
        }
        if (filters.studentId) {
            filtered = filtered.filter(b => b.studentId === filters.studentId);
        }
        setFilteredBookings(filtered);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await bookingService.book(formData);
            setSuccess("Reservation completed successfully!");
            setFormData({ studentId: '', courseNumber: '', passengerName: '' });
            refreshData();
        } catch (err) { setError(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Confirm permanent cancellation of this selected record?")) {
            try {
                await bookingService.cancel(id);
                refreshData();
            } catch (err) { alert("Action failed"); }
        }
    };

    if (initialLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="animate-up">
            <header className="mb-5">
                <h2 className="fw-bold mb-1">Enrollment Center</h2>
                <p className="text-muted small">Manage course enrollments and cancellations</p>
            </header>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px', position: 'sticky', top: '2rem' }}>
                        <h5 className="fw-bold mb-4">Enroll Student</h5>
                        <Form onSubmit={handleBook}>
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                            {success && <Alert variant="success" className="py-2 small">{success}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small fw-bold text-uppercase">Student Account</Form.Label>
                                <Form.Select
                                    className="form-input-brand shadow-none" required
                                    value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                >
                                    <option value="">Choose Student</option>
                                    {students.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small fw-bold text-uppercase">Select Course</Form.Label>
                                <Form.Select
                                    className="form-input-brand shadow-none" required
                                    value={formData.courseNumber} onChange={e => setFormData({ ...formData, courseNumber: e.target.value })}
                                >
                                    <option value="">Choose Course</option>
                                    {courses.map(f => <option key={f.id} value={f.courseNumber}>{f.courseNumber} ({f.origin} - {f.destination})</option>)}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small fw-bold text-uppercase">Student Name</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Enter student name" className="form-input-brand shadow-none"
                                    value={formData.passengerName} onChange={e => setFormData({ ...formData, passengerName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <button type="submit" className="btn-brand w-100 py-3" disabled={loading}>
                                {loading ? 'ENROLLING...' : 'CONFIRM ENROLLMENT'}
                            </button>
                        </Form>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '25px' }}>
                        <div className="p-4 bg-white border-bottom">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="fw-bold mb-0">Enrollment Records</h5>
                                <i className="bi bi-funnel text-muted"></i>
                            </div>
                            <Row className="g-2">
                                <Col md={5}>
                                    <Form.Select
                                        size="sm" className="form-input-brand shadow-none"
                                        value={filters.courseId} onChange={e => setFilters({ ...filters, courseId: e.target.value })}
                                    >
                                        <option value="">All Courses</option>
                                        {courses.map(f => <option key={f.id} value={f.id}>{f.courseNumber} ({f.origin}-{f.destination})</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={5}>
                                    <Form.Select
                                        size="sm" className="form-input-brand shadow-none"
                                        value={filters.studentId} onChange={e => setFilters({ ...filters, studentId: e.target.value })}
                                    >
                                        <option value="">All Students</option>
                                        {students.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Button variant="outline-secondary" size="sm" className="w-100" onClick={() => setFilters({ courseId: '', studentId: '' })}>
                                        Clear
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <Table responsive className="table-brand mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>STUDENT</th>
                                    <th>COURSE CODE</th>
                                    <th>SEAT</th>
                                    <th>STATUS</th>
                                    <th>FEE</th>
                                    <th className="text-end">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map(b => (
                                    <tr key={b.id}>
                                        <td className="fw-bold text-dark">{b.studentName || b.passengerName}</td>
                                        <td className="small text-muted font-monospace">{b.courseNumber}</td>
                                        <td className="fw-bold text-primary">{b.seatNumber || 'TBD'}</td>
                                        <td>
                                            <span className={`status-badge ${b.status === 'CONFIRMED' ? 'badge-confirm' : 'badge-cancel'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="text-dark fw-bold">${b.totalAmount}</td>
                                        <td className="text-end">
                                            {b.status === 'CONFIRMED' && (
                                                <Button variant="link" className="text-danger p-0" title="CANCEL" onClick={() => handleCancel(b.id)}>
                                                    <i className="bi bi-x-circle-fill fs-5"></i>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted small">No enrollment records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Bookings;
