import { CheckCircle, Circle, Clock, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { formatDate, getTimeRemaining, isDueSoon, isOverdue } from '../utils/dateUtils';

import DatePicker from './DatePicker';
import { Todo } from '../types';
import { useTodo } from '../context/TodoContext';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, updateTodo, lists } = useTodo();
  const [isEditingDate, setIsEditingDate] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    updateTodo(todo.id, { dueDate: date });
    setIsEditingDate(false);
  };

  const getDueDateClass = () => {
    if (!todo.dueDate) return '';
    if (isOverdue(todo.dueDate)) return 'overdue';
    if (isDueSoon(todo.dueDate)) return 'due-soon';
    return 'due-normal';
  };

  const getTimeOfDayLabel = (timeOfDay?: string) => {
    switch (timeOfDay) {
      case 'morning': return '上午';
      case 'afternoon': return '下午';
      case 'evening': return '今晚';
      default: return '';
    }
  };

  const getListInfo = () => {
    if (!todo.listId) return null;
    const list = lists.find(l => l.id === todo.listId);
    return list;
  };

  const listInfo = getListInfo();

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button
        onClick={() => toggleTodo(todo.id)}
        className="toggle-button"
        aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
      >
        {todo.completed ? (
          <CheckCircle size={24} className="check-icon" />
        ) : (
          <Circle size={24} className="circle-icon" />
        )}
      </button>
      
      <div className="todo-content">
        <div className="todo-main">
          <span className="todo-text">{todo.text}</span>
          
          {/* 列表信息 */}
          {listInfo && (
            <div className="list-info">
              <div className="list-dot" style={{ backgroundColor: listInfo.color }}></div>
              <span className="list-name">{listInfo.name}</span>
              {todo.createdAt && (
                <span className="created-date">
                  - {todo.createdAt.toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* 时间段信息 */}
        {todo.timeOfDay && (
          <div className="time-of-day">
            <Clock size={12} />
            <span>{getTimeOfDayLabel(todo.timeOfDay)}</span>
          </div>
        )}
        
        {/* 截止时间信息 */}
        {todo.dueDate && (
          <div className={`due-date-info ${getDueDateClass()}`}>
            <Clock size={14} />
            <span className="due-date-text">
              {getTimeRemaining(todo.dueDate)}
            </span>
            <button
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="edit-date-btn"
              aria-label="编辑截止时间"
            >
              <Edit size={12} />
            </button>
          </div>
        )}
        
        {isEditingDate && (
          <div className="date-edit-container">
            <DatePicker
              selectedDate={todo.dueDate}
              onDateChange={handleDateChange}
              placeholder="修改截止时间"
            />
          </div>
        )}
      </div>
      
      <button
        onClick={() => deleteTodo(todo.id)}
        className="delete-button"
        aria-label="删除待办事项"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TodoItem; 