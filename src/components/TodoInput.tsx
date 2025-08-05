import { Clock, List, Plus } from 'lucide-react';
import React, { useState } from 'react';

import DatePicker from './DatePicker';
import { useTodo } from '../context/TodoContext';

const TodoInput: React.FC = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  
  const { addTodo, lists } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, dueDate, selectedListId || undefined, timeOfDay || undefined);
      setText('');
      setDueDate(undefined);
      setSelectedListId('');
      setTimeOfDay('');
      setShowOptions(false);
    }
  };

  const timeOptions = [
    { value: 'morning', label: '上午' },
    { value: 'afternoon', label: '下午' },
    { value: 'evening', label: '今晚' }
  ];

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="添加新的待办事项..."
          className="todo-input-field"
        />
        <button 
          type="button" 
          onClick={() => setShowOptions(!showOptions)}
          className="options-btn"
        >
          <Plus size={20} />
        </button>
        <button type="submit" className="add-button" disabled={!text.trim()}>
          <Plus size={20} />
        </button>
      </div>
      
      {showOptions && (
        <div className="options-panel">
          {/* 列表选择 */}
          <div className="option-group">
            <label className="option-label">
              <List size={16} />
              选择列表
            </label>
            <div className="list-options">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => setSelectedListId(selectedListId === list.id ? '' : list.id)}
                  className={`list-option ${selectedListId === list.id ? 'selected' : ''}`}
                  style={{ borderColor: list.color }}
                >
                  <div className="list-dot" style={{ backgroundColor: list.color }}></div>
                  {list.name}
                </button>
              ))}
            </div>
          </div>

          {/* 时间段选择 */}
          <div className="option-group">
            <label className="option-label">
              <Clock size={16} />
              时间段
            </label>
            <div className="time-options">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeOfDay(timeOfDay === option.value ? '' : option.value)}
                  className={`time-option ${timeOfDay === option.value ? 'selected' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 截止时间 */}
          <div className="option-group">
            <DatePicker
              selectedDate={dueDate}
              onDateChange={setDueDate}
              placeholder="设置截止时间"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoInput; 