import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Spinner, Row, Col, Badge, Alert } from 'react-bootstrap';
import { courseService } from '../services/api';

const courses = () => {
    const [courses, setcourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ courseNumber: '', origin: '', destination: '', departureTime: '', totalSeats: 30, price: 0 });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchcourses();
    }, []);

    const fetchcourses = async () => {
        try {
            const res = await courseService.getAll();
            setcourses(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingCourse) {
                await courseService.update(editingCourse.id, formData);
            } else {
                await courseService.add(formData);
            }
            setShowModal(false);
            setFormData({ courseNumber: '', origin: '', destination: '', departureTime: '', totalSeats: 30, price: 0 });
            setEditingCourse(null);
            fetchcourses();
        } catch (err) { setError(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        const formattedTime = course.departureTime ? new Date(course.departureTime).toISOString().slice(0, 16) : '';
        setFormData({
            courseNumber: course.courseNumber,
            origin: course.origin,
            destination: course.destination,
            departureTime: formattedTime,
            totalSeats: course.totalSeats,
            price: course.price
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                await courseService.delete(id);
                fetchcourses();
            } catch (err) { 
                alert("Failed to delete course: " + (err.response?.data?.message || err.message)); 
            }
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchcourses();
            return;
        }
        try {
            const res = await courseService.search(searchTerm);
            setcourses(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCourse(null);
        setFormData({ courseNumber: '', origin: '', destination: '', departureTime: '', totalSeats: 30, price: 0 });
        setError(null);
    };

    if (initialLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="animate-up">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Course Catalog</h2>
                    <p className="text-muted small">Available courses and enrollment management</p>
                </div>
                <button className="btn-brand" onClick={() => setShowModal(true)}>
                    <i className="bi bi-calendar-plus-fill me-2"></i> ADD COURSE
                </button>
            </div>

            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '20px' }}>
                <div className="p-3">
                    <Row className="g-2">
                        <Col md={10}>
                            <Form.Control
                                type="text"
                                placeholder="Search by course name or instructor..."
                                className="form-input-brand shadow-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" className="w-100" onClick={handleSearch}>
                                <i className="bi bi-search me-2"></i>Search
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '25px' }}>
                <Table responsive className="table-brand mb-0 align-middle">
                    <thead>
                        <tr>
                            <th>COURSE NO</th>
                            <th>DETAILS</th>
                            <th>START DATE</th>
                            <th>CAPACITY</th>
                            <th>PRICE</th>
                            <th className="text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? courses.map(course => (
                            <tr key={course.id}>
                                <td className="fw-bold text-accent" style={{ color: 'var(--accent-color)' }}>{course.courseNumber}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fw-bold fs-6 text-dark">{course.origin}</span>
                                        <i className="bi bi-arrow-right text-accent mx-2" style={{ color: '#a855f7' }}></i>
                                        <span className="fw-bold fs-6 text-dark">{course.destination}</span>
                                    </div>
                                </td>
                                <td className="small text-muted">
                                    {new Date(course.departureTime).toLocaleString()}
                                </td>
                                <td>
                                    <span className="px-3 py-2 rounded-pill fw-bold" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem' }}>
                                        {course.availableSeats} of {course.totalSeats} seats
                                    </span>
                                </td>
                                <td className="fw-bold text-dark fs-6">${course.price.toFixed(2)}</td>
                                <td className="text-end">
                                    <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleEdit(course)}>
                                        <i className="bi bi-pencil-fill fs-5"></i>
                                    </Button>
                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(course.id)}>
                                        <i className="bi bi-trash-fill fs-5"></i>
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">Empty schedule records.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleModalClose} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '30px' }}>
                <Modal.Header closeButton className="p-4 border-light">
                    <Modal.Title className="fw-bold px-2">{editingCourse ? 'Update Course' : 'Add New Course'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4 bg-light overflow-hidden" style={{ borderRadius: '0 0 30px 30px' }}>
                        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Course Code</Form.Label>
                            <Form.Control
                                type="text" placeholder="e.g. CS-101" className="form-input-brand shadow-none"
                                value={formData.courseNumber} onChange={e => setFormData({ ...formData, courseNumber: e.target.value.toUpperCase() })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Course Name</Form.Label>
                                    <Form.Control
                                        type="text" placeholder="e.g. Introduction to Programming" className="form-input-brand shadow-none"
                                        value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Instructor</Form.Label>
                                    <Form.Control
                                        type="text" placeholder="e.g. Dr. Smith" className="form-input-brand shadow-none"
                                        value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Start Date & Time</Form.Label>
                            <Form.Control
                                type="datetime-local" className="form-input-brand shadow-none"
                                value={formData.departureTime} onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Max Students</Form.Label>
                                    <Form.Control
                                        type="number" className="form-input-brand shadow-none"
                                        value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Course Fee ($)</Form.Label>
                                    <Form.Control
                                        type="number" step="0.01" className="form-input-brand shadow-none"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end mt-4">
                            <Button variant="link" className="text-muted text-decoration-none me-3" onClick={handleModalClose}>CANCEL</Button>
                            <button type="submit" className="btn-brand" disabled={loading}>
                                {loading ? 'SAVING...' : (editingCourse ? 'UPDATE COURSE' : 'ADD COURSE')}
                            </button>
                        </div>
                    </Modal.Body>
                </Form>
            </Modal>
        </div>
    );
};

export default courses;
