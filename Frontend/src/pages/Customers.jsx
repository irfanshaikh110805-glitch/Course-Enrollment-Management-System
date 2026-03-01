import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { studentService } from '../services/api';

const students = () => {
    const [students, setstudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchstudents();
    }, []);

    const fetchstudents = async () => {
        try {
            const res = await studentService.getAll();
            setstudents(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingStudent) {
                await studentService.update(editingStudent.id, formData);
            } else {
                await studentService.register(formData);
            }
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '' });
            setEditingStudent(null);
            fetchstudents();
        } catch (err) { setError(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ name: student.name, email: student.email, phone: student.phone });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await studentService.delete(id);
                fetchstudents();
            } catch (err) { 
                alert("Failed to delete student: " + (err.response?.data?.message || err.message)); 
            }
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchstudents();
            return;
        }
        try {
            const res = await studentService.search(searchTerm);
            setstudents(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingStudent(null);
        setFormData({ name: '', email: '', phone: '' });
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
                    <h2 className="fw-bold mb-1">Student Directory</h2>
                    <p className="text-muted small">Registered student accounts and profile management</p>
                </div>
                <button className="btn-brand" onClick={() => setShowModal(true)}>
                    <i className="bi bi-person-plus-fill me-2"></i> NEW STUDENT
                </button>
            </div>

            <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '20px' }}>
                <div className="p-3">
                    <Row className="g-2">
                        <Col md={10}>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or email..."
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
                            <th>IDENTIFIER</th>
                            <th>NAME/FULL PROFILE</th>
                            <th>EMAIL ACCESS</th>
                            <th>CONTACT NO.</th>
                            <th className="text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td className="small text-muted font-monospace">{student.id.substring(0, 8)}</td>
                                <td className="fw-bold fs-6 text-dark">{student.name}</td>
                                <td className="text-muted">{student.email}</td>
                                <td>{student.phone}</td>
                                <td className="text-end">
                                    <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleEdit(student)}>
                                        <i className="bi bi-pencil-fill fs-5"></i>
                                    </Button>
                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(student.id)}>
                                        <i className="bi bi-trash-fill fs-5"></i>
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">Zero accounts found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleModalClose} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '30px' }}>
                <Modal.Header closeButton className="p-4 border-light">
                    <Modal.Title className="fw-bold px-2">{editingStudent ? 'Update Student' : 'Register Student'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4 bg-light overflow-hidden" style={{ borderRadius: '0 0 30px 30px' }}>
                        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Full Student Name</Form.Label>
                            <Form.Control
                                type="text" placeholder="Enter name" className="form-input-brand shadow-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Email Address</Form.Label>
                            <Form.Control
                                type="email" placeholder="e.g. name@example.com" className="form-input-brand shadow-none"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Phone Number</Form.Label>
                            <Form.Control
                                type="text" placeholder="e.g. +1 555-0123" className="form-input-brand shadow-none"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <div className="text-end mt-4">
                            <button type="submit" className="btn-brand" disabled={loading}>
                                {loading ? 'SAVING...' : (editingStudent ? 'UPDATE STUDENT' : 'REGISTER STUDENT')}
                            </button>
                        </div>
                    </Modal.Body>
                </Form>
            </Modal>
        </div>
    );
};

export default students;