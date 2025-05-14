import { useState, useEffect } from 'react';
import './App.css';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getTodos, createTodo, deleteTodo } from './api/api';
import { BiSolidTrash } from "react-icons/bi";

interface Todo {
  id: number;
  title: string;
}

function App() {
  const queryClient = useQueryClient();
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [addTodo, setAddTodo] = useState(10)
  const [error, setError] = useState('');

  const { data: todos, isSuccess } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  // Update local state when the query succeeds
  useEffect(() => {
    if (isSuccess && todos) {
      // Initialize local state
      setLocalTodos(todos.slice(0, addTodo)); 
    }
  }, [isSuccess, todos, addTodo]);

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      // Update local state
      setLocalTodos((prev) => [...prev, newTodo]); 
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle(''); 
      setError('');
    },
  });

  const del = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, id) => {
      // Update local state
      setLocalTodos((prev) => prev.filter((todo) => todo.id !== id)); 
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      // Basic form validation
      setError('Title is required');
      return;
    }
    mutation.mutate({
      title: newTodoTitle,
      completed: false,
    });
  };


  return (
    <main className="flex flex-col gap-6 items-center list-none py-6 text-sm">
      <h1 className="text-5xl font-bold mb-[2rem]">TODO APP</h1>

      <form onSubmit={handleAddTodo} className="flex flex-wrap gap-4 justify-center  items-center">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter todo title"
          className="p-2 px-6 bg-white outline-none w-[20rem] rounded-[2rem] text-xs"
        />
        {error && <p className="bg-red-100 px-6 py-1 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="px-6 py-2 relative overflow-hidden bg-white shadow rounded-[2rem] group"
        >
          <div className='absolute w-[100%] h-full bg-green-200 top-0 -left-[100%] group-hover:left-0 transition-all duration-300'/>
          <span className='relative z-10'>Add Todo</span>
        </button>
      </form>
      
      <div className="flex flex-wrap gap-6 justify-center p-4">
        {localTodos.map((todo) => (
          <li
            className="p-3 px-6 bg-green-200 rounded-[2rem] flex items-center gap-4 hover:shadow-md cursor-default"
            key={todo.id}
          >
            <span className='w-[90%]'>{todo.title}</span>
            <BiSolidTrash
              onClick={() => {
                del.mutate(todo.id);
              }}
            />
          </li>
        ))}
      </div>

        <button
          className="px-6 py-2 relative overflow-hidden bg-white shadow-md rounded-[2rem] group"
          onClick={()=> setAddTodo(addTodo + 10)}
        >
          <div className='absolute w-[100%] h-full bg-green-200 top-0 -left-[100%] group-hover:left-0 transition-all duration-300'/>
          <span className='relative z-10'>Load more</span>
        </button>
    </main>
  );
}

export default App;
