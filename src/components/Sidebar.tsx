import { Calendar, CheckCircle, Folder, MoreVertical, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

import { useTodo } from '../context/TodoContext';

// 将isToday函数移到组件外部
const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const Sidebar: React.FC = () => {
  const { 
    todos, 
    lists, 
    currentFilter, 
    searchQuery, 
    setCurrentFilter, 
    setSearchQuery,
    addList 
  } = useTodo();
  
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const getTaskCount = (filter: string) => {
    switch (filter) {
      case 'today':
        return todos.filter(todo => !todo.completed && isToday(todo.createdAt)).length;
      case 'plan':
        return todos.filter(todo => !todo.completed && todo.dueDate).length;
      case 'all':
        return todos.filter(todo => !todo.completed).length;
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      default:
        return 0;
    }
  };

  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setShowAddList(false);
    }
  };

  const filterOptions = [
    { 
      id: 'today', 
      name: '今天', 
      icon: Calendar, 
      count: getTaskCount('today'),
      color: '#3b82f6',
      description: '今天创建的任务'
    },
    { 
      id: 'plan', 
      name: '计划', 
      icon: Calendar, 
      count: getTaskCount('plan'),
      color: '#10b981',
      description: '有截止时间的任务'
    },
    { 
      id: 'all', 
      name: '全部', 
      icon: Folder, 
      count: getTaskCount('all'),
      color: '#6b7280',
      description: '所有未完成任务'
    },
    { 
      id: 'completed', 
      name: '完成', 
      icon: CheckCircle, 
      count: getTaskCount('completed'),
      color: '#f59e0b',
      description: '已完成的任务'
    }
  ];

  return (
    <div className="sidebar">
      {/* 搜索栏 */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="搜索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="filter-section">
        <h3 className="filter-section-title">分类筛选</h3>
        <div className="filter-grid">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentFilter === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setCurrentFilter(option.id)}
                className={`filter-card ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? option.color : 'var(--border-color)',
                  backgroundColor: isActive ? `${option.color}15` : 'var(--bg-color)'
                }}
              >
                <div className="filter-icon" style={{ color: isActive ? option.color : '#6b7280' }}>
                  <Icon size={20} />
                  {option.id === 'today' && (
                    <span className="calendar-number">1</span>
                  )}
                </div>
                <div className="filter-info">
                  <span className="filter-name" style={{ color: isActive ? option.color : 'var(--text-color)' }}>
                    {option.name}
                  </span>
                  <span className="filter-count" style={{ color: isActive ? option.color : '#9ca3af' }}>
                    {option.count} 个任务
                  </span>
                  <span className="filter-description">
                    {option.description}
                  </span>
                </div>
                {isActive && (
                  <div className="active-indicator" style={{ backgroundColor: option.color }}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 我的列表 */}
      <div className="lists-section">
        <div className="lists-header">
          <h3 className="lists-title">我的列表</h3>
          <button className="update-btn">更新</button>
        </div>
        
        <div className="lists-container">
          {lists.map((list) => (
            <div key={list.id} className="list-item">
              <div className="list-bullet" style={{ backgroundColor: list.color }}></div>
              <span className="list-name">{list.name}</span>
              <span className="list-count">{list.taskCount}</span>
              <button className="list-menu-btn">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* 添加列表 */}
        <div className="add-list-section">
          {showAddList ? (
            <div className="add-list-form">
              <input
                type="text"
                placeholder="输入列表名称"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                className="add-list-input"
                autoFocus
              />
              <div className="add-list-actions">
                <button onClick={handleAddList} className="confirm-btn">
                  确认
                </button>
                <button onClick={() => setShowAddList(false)} className="cancel-btn">
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAddList(true)}
              className="add-list-btn"
            >
              <Plus size={16} />
              添加列表
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 