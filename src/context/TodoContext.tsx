import React, { createContext, useContext, useEffect, useState } from 'react';
import { Todo, TodoContextType, TodoList } from '../types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    }
    return [];
  });

  const [lists, setLists] = useState<TodoList[]>(() => {
    const savedLists = localStorage.getItem('todoLists');
    if (savedLists) {
      return JSON.parse(savedLists);
    }
    return [
      { id: 'fe-learning', name: 'FE Learning', color: '#3b82f6', taskCount: 9 },
      { id: 'fe-reading', name: 'FE Reading', color: '#10b981', taskCount: 3 }
    ];
  });

  const [currentFilter, setCurrentFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todoLists', JSON.stringify(lists));
  }, [lists]);

  // 更新列表的任务数量
  useEffect(() => {
    const updatedLists = lists.map(list => ({
      ...list,
      taskCount: todos.filter(todo => todo.listId === list.id && !todo.completed).length
    }));
    setLists(updatedLists);
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date, listId?: string, timeOfDay?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      dueDate: dueDate,
      listId: listId,
      timeOfDay: timeOfDay as any,
      category: currentFilter as any
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const addList = (name: string, color?: string) => {
    const newList: TodoList = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color || '#6b7280',
      taskCount: 0
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
    // 同时删除该列表下的所有任务
    setTodos(prev => prev.filter(todo => todo.listId !== id));
  };

  const updateList = (id: string, updates: Partial<TodoList>) => {
    setLists(prev =>
      prev.map(list =>
        list.id === id ? { ...list, ...updates } : list
      )
    );
  };

  const value: TodoContextType = {
    todos,
    lists,
    currentFilter,
    searchQuery,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    setCurrentFilter,
    setSearchQuery,
    addList,
    deleteList,
    updateList
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}; 