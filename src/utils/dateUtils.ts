export const getTimeRemaining = (dueDate: Date): string => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return '已过期';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `剩余 ${days} 天`;
  } else if (hours > 0) {
    return `剩余 ${hours} 小时`;
  } else if (minutes > 0) {
    return `剩余 ${minutes} 分钟`;
  } else {
    return '即将到期';
  }
};

export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

export const isDueSoon = (dueDate: Date): boolean => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours <= 24 && hours > 0;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 