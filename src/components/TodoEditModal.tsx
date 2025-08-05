import { Calendar, Clock, Save, Tag, Trash2, User, X } from 'lucide-react';
import React, { useState } from 'react';

import DatePicker from './DatePicker';
import { Todo } from '../types';
import { useTodo } from '../context/TodoContext';

interface TodoEditModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
}

const TodoEditModal: React.FC<TodoEditModalProps> = ({ todo, isOpen, onClose }) => {
  const { updateTodo, deleteTodo, lists } = useTodo();
  const [editedTodo, setEditedTodo] = useState<Todo>(todo);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    { id: 'today', name: '今天', color: '#3b82f6' },
    { id: 'plan', name: '计划', color: '#10b981' },
    { id: 'all', name: '全部', color: '#6b7280' },
    { id: 'completed', name: '完成', color: '#f59e0b' }
  ];

  const priorities = [
    { id: 'low', name: '低', color: '#10b981' },
    { id: 'medium', name: '中', color: '#f59e0b' },
    { id: 'high', name: '高', color: '#ef4444' }
  ];

  const timeOptions = [
    { value: 'morning', label: '上午' },
    { value: 'afternoon', label: '下午' },
    { value: 'evening', label: '今晚' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTodo(todo.id, {
        ...editedTodo,
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      await deleteTodo(todo.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">编辑待办事项</h3>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* 任务内容 */}
          <div className="form-group">
            <label className="form-label">任务内容</label>
            <textarea
              value={editedTodo.text}
              onChange={(e) => setEditedTodo(prev => ({ ...prev, text: e.target.value }))}
              className="form-textarea"
              rows={3}
              placeholder="输入任务内容..."
            />
          </div>

          {/* 分类选择 */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} />
              分类
            </label>
            <div className="category-options">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setEditedTodo(prev => ({ ...prev, category: category.id as any }))}
                  className={`category-option ${editedTodo.category === category.id ? 'selected' : ''}`}
                  style={{ borderColor: category.color }}
                >
                  <div className="category-dot" style={{ backgroundColor: category.color }}></div>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 优先级 */}
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              优先级
            </label>
            <div className="priority-options">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => setEditedTodo(prev => ({ ...prev, priority: priority.id as any }))}
                  className={`priority-option ${editedTodo.priority === priority.id ? 'selected' : ''}`}
                  style={{ borderColor: priority.color }}
                >
                  <div className="priority-dot" style={{ backgroundColor: priority.color }}></div>
                  {priority.name}
                </button>
              ))}
            </div>
          </div>

          {/* 时间段 */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} />
              时间段
            </label>
            <div className="time-options">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEditedTodo(prev => ({ 
                    ...prev, 
                    timeOfDay: editedTodo.timeOfDay === option.value ? undefined : option.value as any 
                  }))}
                  className={`time-option ${editedTodo.timeOfDay === option.value ? 'selected' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 截止时间 */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              截止时间
            </label>
            <DatePicker
              selectedDate={editedTodo.dueDate}
              onDateChange={(date) => setEditedTodo(prev => ({ ...prev, dueDate: date }))}
              placeholder="设置截止时间"
            />
          </div>

          {/* 列表选择 */}
          <div className="form-group">
            <label className="form-label">所属列表</label>
            <div className="list-options">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setEditedTodo(prev => ({ 
                    ...prev, 
                    listId: editedTodo.listId === list.id ? undefined : list.id 
                  }))}
                  className={`list-option ${editedTodo.listId === list.id ? 'selected' : ''}`}
                  style={{ borderColor: list.color }}
                >
                  <div className="list-dot" style={{ backgroundColor: list.color }}></div>
                  {list.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleDelete} className="delete-btn">
            <Trash2 size={16} />
            删除
          </button>
          <div className="action-buttons">
            <button onClick={onClose} className="cancel-btn">
              取消
            </button>
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={isSaving || !editedTodo.text.trim()}
            >
              <Save size={16} />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoEditModal; 