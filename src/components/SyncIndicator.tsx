import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

import React from 'react';
import { useTodo } from '../context/TodoContext';

const SyncIndicator: React.FC = () => {
  const { syncStatus, syncData } = useTodo();

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff size={16} className="text-red-500" />;
    }
    
    if (syncStatus.pendingChanges > 0) {
      return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
    }
    
    if (syncStatus.syncError) {
      return <AlertCircle size={16} className="text-red-500" />;
    }
    
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return '离线模式';
    }
    
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} 个待同步`;
    }
    
    if (syncStatus.syncError) {
      return '同步失败';
    }
    
    return '已同步';
  };

  const handleSyncClick = () => {
    if (syncStatus.isOnline && syncStatus.pendingChanges > 0) {
      syncData();
    }
  };

  return (
    <div className="sync-indicator">
      <button
        onClick={handleSyncClick}
        className="sync-button"
        disabled={!syncStatus.isOnline || syncStatus.pendingChanges === 0}
        title={getStatusText()}
      >
        {getStatusIcon()}
        <span className="sync-text">{getStatusText()}</span>
      </button>
    </div>
  );
};

export default SyncIndicator; 