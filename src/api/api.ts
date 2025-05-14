import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

// Fetch all todos
export const getTodos = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

// Fetch a single todo by ID
export const getTodoById = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching todo with ID ${id}:`, error);
        throw error;
    }
};

// Create a new todo
export const createTodo = async (todo: { title: string; completed: boolean }) => {
    try {
        const response = await axios.post(BASE_URL, todo);
        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

// Update an existing todo by ID
export const updateTodo = async (id: number, updatedTodo: { title?: string; completed?: boolean }) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedTodo);
        return response.data;
    } catch (error) {
        console.error(`Error updating todo with ID ${id}:`, error);
        throw error;
    }
};

// Delete a todo by ID
export const deleteTodo = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting todo with ID ${id}:`, error);
        throw error;
    }
};