import { Calendar, X } from 'lucide-react';
import React, { useState } from 'react';

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  selectedDate, 
  onDateChange, 
  placeholder = "设置截止时间" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleDateSelect = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      onDateChange(date);
      setInputValue(date.toISOString().slice(0, 16));
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onDateChange(undefined);
    setInputValue('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="date-picker">
      <div className="date-input-container">
        <input
          type="datetime-local"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            if (inputValue) {
              handleDateSelect(inputValue);
            }
          }}
          placeholder={placeholder}
          className="date-input"
        />
        <div className="date-actions">
          {selectedDate && (
            <button
              onClick={handleClear}
              className="clear-date-btn"
              aria-label="清除截止时间"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="calendar-btn"
            aria-label="选择日期"
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>
      
      {selectedDate && (
        <div className="selected-date">
          <span className="date-label">截止时间:</span>
          <span className="date-value">{formatDate(selectedDate)}</span>
        </div>
      )}
    </div>
  );
};

export default DatePicker; 