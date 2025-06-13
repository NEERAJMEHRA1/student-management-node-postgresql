import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Student, Mark } from '../../services/studentService';
import Swal from 'sweetalert2';

interface StudentFormProps {
    initialData?: Student;
    onSubmit: (studentData: Omit<Student, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [age, setAge] = useState(initialData?.age || 0);
    const [marks, setMarks] = useState<Mark[]>(initialData?.marks || []);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddMark = () => {
        setMarks([...marks, { subject: '', score: 0 }]);
    };

    const handleRemoveMark = (index: number) => {
        const newMarks = [...marks];
        newMarks.splice(index, 1);
        setMarks(newMarks);
    };

    const handleMarkChange = (index: number, field: keyof Mark, value: string | number) => {
        const newMarks = [...marks];
        newMarks[index] = { ...newMarks[index], [field]: value };
        setMarks(newMarks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await onSubmit({
                name,
                email,
                age,
                marks,
            });
        } catch (err) {
            setError('Failed to save student');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>{initialData ? 'Edit Student' : 'Add New Student'}</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter age"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            required
                            min="1"
                        />
                    </Form.Group>

                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label>Marks</Form.Label>
                            <Button variant="outline-primary" size="sm" onClick={handleAddMark}>
                                Add Mark
                            </Button>
                        </div>
                        {marks.map((mark, index) => (
                            <Row key={index} className="mb-2 g-2">
                                <Col md={6}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Subject"
                                        value={mark.subject}
                                        onChange={(e) =>
                                            handleMarkChange(index, 'subject', e.target.value)
                                        }
                                        required
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Score"
                                        value={mark.score}
                                        onChange={(e) =>
                                            handleMarkChange(index, 'score', Number(e.target.value))
                                        }
                                        required
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleRemoveMark(index)}
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default StudentForm;