export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  listId?: string; // 所属列表ID
  category?: 'today' | 'plan' | 'all' | 'completed';
  timeOfDay?: 'morning' | 'afternoon' | 'evening'; // 时间段
  createdBy: string; // 创建者ID
  assignedTo?: string; // 分配给谁
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  teamId?: string; // 所属团队
  isPublic: boolean; // 是否公开
}

export interface TodoList {
  id: string;
  name: string;
  color?: string;
  taskCount: number;
  createdBy: string;
  teamId?: string;
  isPublic: boolean;
  members: string[]; // 成员ID列表
  permissions: ListPermission[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user' | 'guest';
  teams: string[]; // 所属团队ID列表
  preferences: UserPreferences;
  lastActive: Date;
  isOnline: boolean;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: TeamMember[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: Date;
  permissions: string[];
}

export interface Comment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  mentions: string[]; // 提及的用户ID
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ListPermission {
  userId: string;
  permissions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  mentions: boolean;
  dueDateReminders: boolean;
  teamUpdates: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  activityVisibility: 'public' | 'team' | 'private';
  allowMentions: boolean;
}

export interface TeamSettings {
  allowGuestInvites: boolean;
  requireApproval: boolean;
  defaultPermissions: string[];
  maxMembers: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date;
  pendingChanges: number;
  syncError?: string;
}

export interface TodoContextType {
  // 数据
  todos: Todo[];
  lists: TodoList[];
  teams: Team[];
  currentUser?: User;
  syncStatus: SyncStatus;
  
  // 筛选和搜索
  currentFilter: string;
  searchQuery: string;
  selectedTeam?: string;
  
  // 任务操作
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  assignTodo: (todoId: string, userId: string) => Promise<void>;
  
  // 列表操作
  addList: (list: Omit<TodoList, 'id' | 'taskCount'>) => Promise<void>;
  updateList: (id: string, updates: Partial<TodoList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  
  // 团队操作
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  joinTeam: (teamId: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  inviteToTeam: (teamId: string, email: string, role: TeamMember['role']) => Promise<void>;
  
  // 用户操作
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  
  // 筛选和搜索
  setCurrentFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTeam: (teamId?: string) => void;
  
  // 同步操作
  syncData: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
  
  // 权限检查
  canEdit: (resource: Todo | TodoList) => boolean;
  canDelete: (resource: Todo | TodoList) => boolean;
  canInvite: (teamId: string) => boolean;
} 