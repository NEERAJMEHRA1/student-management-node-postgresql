import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../../services/studentService';
import { Student } from '../../services/studentService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';
import { useAuth } from '../../hooks/useAuth';

// Create a customized SweetAlert instance with React support
const MySwal = withReactContent(Swal);

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const limit = 10;
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchStudents = async () => {
            setIsLoading(true);
            setError('');
            try {
                const { data, meta } = await getStudents(currentPage, limit);
                setStudents(data);
                setTotalPages(meta.totalPages);
                setTotalStudents(meta.total);
            } catch (err) {
                setError('Failed to fetch students');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [currentPage, isAuthenticated, navigate]);

    const handleDelete = async (id: number) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'bootstrap-4-theme'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteStudent(id);
                setStudents(students.filter(student => student.id !== id));
                await MySwal.fire({
                    title: 'Deleted!',
                    text: 'Student has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme'
                    }
                });
            } catch (err) {
                await MySwal.fire({
                    title: 'Error!',
                    text: 'Failed to delete student.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme'
                    }
                });
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h2>Student Management</h2>
                </Col>
                <Col className="text-end">
                    <Button as={Link as any} to="/students/add" variant="primary">
                        Add New Student
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Marks Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{(currentPage - 1) * limit + index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.age}</td>
                                        <td>{student.marks?.length || 0}</td>
                                        <td>
                                            <Button
                                                as={Link as any}
                                                to={`/students/${student.id}`}
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                as={Link as any}
                                                to={`/students/edit/${student.id}`}
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center">
                            <Pagination>
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={pageNum === currentPage}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                })}

                                <Pagination.Next
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}

                    <div className="text-muted mt-2">
                        Showing {(currentPage - 1) * limit + 1} to{' '}
                        {Math.min(currentPage * limit, totalStudents)} of {totalStudents} students
                    </div>
                </>
            )}
        </Container>
    );
};

export default StudentList;