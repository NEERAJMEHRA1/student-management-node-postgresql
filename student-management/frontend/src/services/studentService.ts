import api from './api';

export interface Student {
    id: number;
    name: string;
    email: string;
    age: number;
    marks?: Mark[];
}

export interface Mark {
    subject: string;
    score: number;
}

export interface PaginatedResponse {
    data: Student[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const createStudent = async (studentData: Omit<Student, 'id'>) => {
    const response = await api.post('/students', studentData);
    return response.data;
};

export const getStudents = async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/students', {
        params: { page, limit },
    });
    return {
        data: response.data.data,
        meta: response.data.meta,
    } as PaginatedResponse;
};

export const getStudent = async (id: number) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data as Student;
};

export const updateStudent = async (id: number, studentData: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data.data as Student;
};

export const deleteStudent = async (id: number) => {
    await api.delete(`/students/${id}`);
};