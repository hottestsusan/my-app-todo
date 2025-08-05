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

interface SyncStatusType {
  isOnline: boolean;
  lastSync: Date;
  pendingChanges: number;
  syncError?: string;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : new Date(),
        createdBy: todo.createdBy || 'current-user',
        priority: todo.priority || 'medium',
        tags: todo.tags || [],
        attachments: todo.attachments || [],
        comments: todo.comments || [],
        isPublic: todo.isPublic || false
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
      { 
        id: 'fe-learning', 
        name: 'FE Learning', 
        color: '#3b82f6', 
        taskCount: 9,
        createdBy: 'current-user',
        isPublic: true,
        members: ['current-user'],
        permissions: []
      },
      { 
        id: 'fe-reading', 
        name: 'FE Reading', 
        color: '#10b981', 
        taskCount: 3,
        createdBy: 'current-user',
        isPublic: true,
        members: ['current-user'],
        permissions: []
      }
    ];
  });

  const [teams, setTeams] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'current-user',
    email: 'user@example.com',
    displayName: '当前用户',
    role: 'user',
    teams: [],
    preferences: {
      theme: 'light',
      language: 'zh-CN',
      notifications: {
        email: true,
        push: true,
        mentions: true,
        dueDateReminders: true,
        teamUpdates: true
      },
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'public',
        allowMentions: true
      }
    },
    lastActive: new Date(),
    isOnline: true
  });

  const [currentFilter, setCurrentFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>({
    isOnline: navigator.onLine,
    lastSync: new Date(),
    pendingChanges: 0,
    syncError: undefined
  });

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

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setSyncStatus((prev: SyncStatusType) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus((prev: SyncStatusType) => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.id,
      priority: todoData.priority || 'medium',
      tags: todoData.tags || [],
      attachments: todoData.attachments || [],
      comments: todoData.comments || [],
      isPublic: todoData.isPublic || false
    };
    setTodos(prev => [newTodo, ...prev]);
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
      )
    );
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const toggleTodo = async (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
      )
    );
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const assignTodo = async (todoId: string, userId: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, assignedTo: userId, updatedAt: new Date() } : todo
      )
    );
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const clearCompleted = async () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const addList = async (listData: Omit<TodoList, 'id' | 'taskCount'> | string) => {
    let newList: TodoList;
    
    if (typeof listData === 'string') {
      // 向后兼容：如果传入的是字符串，创建简单的列表
      newList = {
        id: Date.now().toString(),
        name: listData,
        color: '#6b7280',
        taskCount: 0,
        createdBy: currentUser.id,
        isPublic: true,
        members: [currentUser.id],
        permissions: []
      };
    } else {
      // 新的完整列表对象
      newList = {
        id: Date.now().toString(),
        ...listData,
        taskCount: 0
      };
    }
    
    setLists(prev => [...prev, newList]);
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const updateList = async (id: string, updates: Partial<TodoList>) => {
    setLists(prev =>
      prev.map(list =>
        list.id === id ? { ...list, ...updates } : list
      )
    );
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const deleteList = async (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
    setTodos(prev => prev.filter(todo => todo.listId !== id));
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const createTeam = async (teamData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTeam = {
      id: Date.now().toString(),
      ...teamData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTeams(prev => [...prev, newTeam]);
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const joinTeam = async (teamId: string) => {
    // 实现加入团队逻辑
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const leaveTeam = async (teamId: string) => {
    // 实现离开团队逻辑
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const inviteToTeam = async (teamId: string, email: string, role: any) => {
    // 实现邀请用户逻辑
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const updateProfile = async (updates: Partial<any>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const updatePreferences = async (preferences: Partial<any>) => {
    setCurrentUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
    setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  };

  const syncData = async () => {
    try {
      // 模拟同步操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncStatus({
        isOnline: navigator.onLine,
        lastSync: new Date(),
        pendingChanges: 0,
        syncError: undefined
      });
    } catch (error) {
      setSyncStatus((prev: SyncStatusType) => ({
        ...prev,
        syncError: error instanceof Error ? error.message : '同步失败'
      }));
    }
  };

  const clearOfflineData = async () => {
    localStorage.removeItem('todos');
    localStorage.removeItem('todoLists');
    setTodos([]);
    setLists([]);
    setSyncStatus(prev => ({ ...prev, pendingChanges: 0 }));
  };

  const canEdit = (resource: Todo | TodoList) => {
    if (!currentUser) return false;
    return resource.createdBy === currentUser.id || currentUser.role === 'admin';
  };

  const canDelete = (resource: Todo | TodoList) => {
    if (!currentUser) return false;
    return resource.createdBy === currentUser.id || currentUser.role === 'admin';
  };

  const canInvite = (teamId: string) => {
    if (!currentUser) return false;
    const team = teams.find((m: any) => m.id === teamId);
    if (!team) return false;
    const member = team.members.find((m: any) => m.userId === currentUser.id);
    return member?.role === 'owner' || member?.role === 'admin' || currentUser.role === 'admin';
  };

  const value: TodoContextType = {
    todos,
    lists,
    teams,
    currentUser,
    syncStatus,
    currentFilter,
    searchQuery,
    selectedTeam,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    assignTodo,
    clearCompleted,
    addList,
    updateList,
    deleteList,
    createTeam,
    joinTeam,
    leaveTeam,
    inviteToTeam,
    updateProfile,
    updatePreferences,
    setCurrentFilter,
    setSearchQuery,
    setSelectedTeam,
    syncData,
    clearOfflineData,
    canEdit,
    canDelete,
    canInvite
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}; 