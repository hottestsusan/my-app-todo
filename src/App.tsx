import './App.css';

import React from 'react';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { TodoProvider } from './context/TodoContext';

const App: React.FC = () => {
  return (
    <TodoProvider>
      <div className="app">
        <div className="app-container">
          {/* 侧边栏 */}
          <Sidebar />
          
          {/* 主内容区域 */}
          <main className="main-content">
            <div className="content-header">
              <h1 className="content-title">今天</h1>
              <ThemeToggle />
            </div>
            
            <div className="content-body">
              <TodoInput />
              <TodoList />
            </div>
          </main>
        </div>
      </div>
    </TodoProvider>
  );
};

export default App; 