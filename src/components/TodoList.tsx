import React, { useMemo } from 'react';
import { isDueSoon, isOverdue } from '../utils/dateUtils';

import TodoItem from './TodoItem';
import { useTodo } from '../context/TodoContext';

// 将isToday函数移到组件外部
const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const TodoList: React.FC = () => {
  const { todos, currentFilter, searchQuery, clearCompleted } = useTodo();

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // 根据当前筛选条件过滤
    switch (currentFilter) {
      case 'today':
        filtered = todos.filter(todo => !todo.completed && isToday(todo.createdAt));
        break;
      case 'plan':
        filtered = todos.filter(todo => !todo.completed && todo.dueDate);
        break;
      case 'all':
        filtered = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos.filter(todo => !todo.completed);
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 排序：未完成的按截止时间排序，已完成的按创建时间倒序
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (!a.completed && !b.completed) {
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, currentFilter, searchQuery]);

  const getTimeOfDayLabel = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return '上午';
      case 'afternoon': return '下午';
      case 'evening': return '今晚';
      default: return '';
    }
  };

  const groupTodosByTimeOfDay = (todos: any[]) => {
    const groups = {
      morning: todos.filter(todo => todo.timeOfDay === 'morning'),
      afternoon: todos.filter(todo => todo.timeOfDay === 'afternoon'),
      evening: todos.filter(todo => todo.timeOfDay === 'evening'),
      noTime: todos.filter(todo => !todo.timeOfDay)
    };
    return groups;
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const overdueCount = todos.filter(todo => !todo.completed && todo.dueDate && isOverdue(todo.dueDate)).length;
  const dueSoonCount = todos.filter(todo => !todo.completed && todo.dueDate && isDueSoon(todo.dueDate) && !isOverdue(todo.dueDate)).length;

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>还没有待办事项</h3>
        <p>添加你的第一个待办事项开始吧！</p>
      </div>
    );
  }

  if (filteredAndSortedTodos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>没有找到匹配的任务</h3>
        <p>尝试调整搜索条件或筛选器</p>
      </div>
    );
  }

  const groupedTodos = groupTodosByTimeOfDay(filteredAndSortedTodos);
  const hasTimeGroups = groupedTodos.morning.length > 0 || groupedTodos.afternoon.length > 0 || groupedTodos.evening.length > 0;

  return (
    <div className="todo-list">
      <div className="todo-items">
        {/* 按时间段分组显示 */}
        {hasTimeGroups ? (
          <>
            {groupedTodos.morning.length > 0 && (
              <div className="time-group">
                <h4 className="time-group-title">上午</h4>
                {groupedTodos.morning.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            
            {groupedTodos.afternoon.length > 0 && (
              <div className="time-group">
                <h4 className="time-group-title">下午</h4>
                {groupedTodos.afternoon.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            
            {groupedTodos.evening.length > 0 && (
              <div className="time-group">
                <h4 className="time-group-title">今晚</h4>
                {groupedTodos.evening.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            
            {groupedTodos.noTime.length > 0 && (
              <div className="time-group">
                <h4 className="time-group-title">其他时间</h4>
                {groupedTodos.noTime.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </>
        ) : (
          // 如果没有时间段分组，直接显示所有任务
          filteredAndSortedTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
      
      {todos.length > 0 && (
        <div className="todo-stats">
          <div className="stats-info">
            <span className="stats-text">
              {activeCount} 个待办中，{completedCount} 个已完成
            </span>
            {(overdueCount > 0 || dueSoonCount > 0) && (
              <div className="due-stats">
                {overdueCount > 0 && (
                  <span className="overdue-count">⚠️ {overdueCount} 个已过期</span>
                )}
                {dueSoonCount > 0 && (
                  <span className="due-soon-count">⏰ {dueSoonCount} 个即将到期</span>
                )}
              </div>
            )}
          </div>
          {completedCount > 0 && (
            <button onClick={() => clearCompleted()} className="clear-completed">
              清除已完成
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList; 