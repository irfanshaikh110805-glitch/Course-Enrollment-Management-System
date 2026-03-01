import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { courseService, studentService, bookingService } from '../services/api';

const Dashboard = () => {
    const [counts, setCounts] = useState({ courses: 0, students: 0, bookings: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [f, c, b] = await Promise.all([
                    courseService.getAll(),
                    studentService.getAll(),
                    bookingService.getAll()
                ]);
                setCounts({
                    courses: f.data.data.length,
                    students: c.data.data.length,
                    bookings: b.data.data.length
                });
            } catch (err) { console.error(err); }
        };
        fetchCounts();
    }, []);

    const cards = [
        { label: 'Courses', value: counts.courses, icon: 'bi-book', color: '#6366f1' },
        { label: 'Students', value: counts.students, icon: 'bi-people', color: '#8b5cf6' },
        { label: 'Enrollments', value: counts.bookings, icon: 'bi-journal-check', color: '#ec4899' }
    ];

    return (
        <div className="animate-up">
            <header className="mb-5 d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="fw-bold mb-1">Dashboard Overview</h2>
                    <p className="text-muted small">Real-time status of your course enrollment system</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="p-2 bg-white rounded shadow-sm text-center" style={{ width: '100px' }}>
                        <h6 className="small text-muted mb-0">Uptime</h6>
                        <span className="fw-bold text-success">99.9%</span>
                    </div>
                </div>
            </header>

            <Row className="g-4 mb-5">
                {cards.map((card, i) => (
                    <Col md={4} key={i}>
                        <Card className="stat-card border-0 h-100">
                            <div className="d-flex align-items-center gap-4">
                                <div className="p-3 rounded-pill bg-light d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px' }}>
                                    <i className={`bi ${card.icon} fs-3`} style={{ color: card.color }}></i>
                                </div>
                                <div className="text-start">
                                    <h3 className="fw-bold mb-0">{card.value}</h3>
                                    <p className="text-muted small m-0 text-uppercase tracking-wider">{card.label}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Col lg={12}>
                <Card className="stat-card border-0 shadow-lg" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="fw-bold mb-2">Welcome to Course Enrollment System!</h4>
                            <p className="mb-0 text-white-50 small">Manage student enrollments and course schedules efficiently.</p>
                        </div>
                        <i className="bi bi-mortarboard d-none d-md-block" style={{ fontSize: '5rem', opacity: '0.2' }}></i>
                    </div>
                </Card>
            </Col>
        </div>
    );
};

export default Dashboard;
