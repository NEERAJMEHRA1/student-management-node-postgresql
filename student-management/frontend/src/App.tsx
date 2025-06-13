import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';
import StudentList from './components/students/StudentList';
import StudentView from './components/students/StudentView';
import StudentForm from './components/students/StudentForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Header from './components/common/Header';
import { useAuth } from './hooks/useAuth';
import { Student } from './services/studentService';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <Header isAuthenticated={false} onLogout={function (): void {
                    throw new Error('Function not implemented.');
                }} />
                <Container className="mt-4">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={
                            <PrivateRoute>
                                <StudentList />
                            </PrivateRoute>
                        } />

                        <Route path="/students" element={
                            <PrivateRoute>
                                <StudentList />
                            </PrivateRoute>
                        } />

                        <Route path="/students/:id" element={
                            <PrivateRoute>
                                <StudentView />
                            </PrivateRoute>
                        } />

                        <Route path="/students/add" element={
                            <PrivateRoute>
                                <StudentForm onSubmit={function (studentData: Omit<Student, 'id'>): Promise<void> {
                                    throw new Error('Function not implemented.');
                                }} onCancel={function (): void {
                                    throw new Error('Function not implemented.');
                                }} />
                            </PrivateRoute>
                        } />

                        <Route path="/students/edit/:id" element={
                            <PrivateRoute>
                                <StudentForm onSubmit={function (studentData: Omit<Student, 'id'>): Promise<void> {
                                    throw new Error('Function not implemented.');
                                }} onCancel={function (): void {
                                    throw new Error('Function not implemented.');
                                }} />
                            </PrivateRoute>
                        } />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
};

export default App;