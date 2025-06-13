import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Container, Alert, Spinner, Badge, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getStudent, deleteStudent } from '../../services/studentService';
import { Student, Mark } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';

// Create customized SweetAlert instance with React support and Bootstrap 4 theme
const MySwal = withReactContent(Swal);

const StudentView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchStudent = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (!id) {
                    throw new Error('Student ID is required');
                }
                const studentData = await getStudent(parseInt(id));
                setStudent(studentData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch student');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudent();
    }, [id, isAuthenticated, navigate]);

    const handleDelete = async () => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning' as const,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'bootstrap-4-theme',
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger'
            }
        });

        if (result.isConfirmed && student) {
            try {
                await deleteStudent(student.id);
                await MySwal.fire({
                    title: 'Deleted!',
                    text: 'Student has been deleted.',
                    icon: 'success' as const,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme',
                        confirmButton: 'btn btn-primary'
                    }
                });
                navigate('/students');
            } catch (err) {
                await MySwal.fire({
                    title: 'Error!',
                    text: 'Failed to delete student.',
                    icon: 'error' as const,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme',
                        confirmButton: 'btn btn-primary'
                    }
                });
            }
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    const calculateAverage = (marks: Mark[] | undefined) => {
        if (!marks || marks.length === 0) return 0;
        const sum = marks.reduce((acc, mark) => acc + mark.score, 0);
        return (sum / marks.length).toFixed(2);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Student Details</h2>
                <div>
                    <Button
                        variant="outline-secondary"
                        as={Link as any}
                        to="/students"
                        className="me-2"
                    >
                        Back to List
                    </Button>
                    {student && (
                        <>
                            <Button
                                variant="primary"
                                as={Link as any}
                                to={`/students/edit/${student.id}`}
                                className="me-2"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : student ? (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="mb-4">
                                {student.name} <Badge bg="info">ID: {student.id}</Badge>
                            </Card.Title>
                            <Row>
                                <Col md={6}>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <th>Email:</th>
                                                <td>{student.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Age:</th>
                                                <td>{student.age}</td>
                                            </tr>
                                            <tr>
                                                <th>Total Subjects:</th>
                                                <td>{student.marks?.length || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Average Score:</th>
                                                <td>
                                                    <Badge bg={parseFloat(calculateAverage(student.marks)) >= 50 ? 'success' : 'danger'}>
                                                        {calculateAverage(student.marks)}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-4">Marks</Card.Title>
                            {student.marks && student.marks.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Score</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.marks.map((mark, index) => (
                                            <tr key={index}>
                                                <td>{mark.subject}</td>
                                                <td>{mark.score}%</td>
                                                <td>
                                                    <Badge bg={mark.score >= 50 ? 'success' : 'danger'}>
                                                        {mark.score >= 50 ? 'Pass' : 'Fail'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <Alert variant="info">No marks recorded for this student</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <Alert variant="warning">Student not found</Alert>
            )}
        </Container>
    );
};

export default StudentView;