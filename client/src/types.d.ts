export interface Employee {
  _id: string;
  name: string;
  email: string;
  teams: Team[];
  roles: string[];
  profilePicture: string;
}

export interface Team {
  _id?: string;
  name: string;
  description: string;
  employees: Employee[];
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  assignedTo?: string[];
  status: "started" | "inProgress" | "completed" | "";
  employees?: Employee[];
}

export interface Token {
  _id: string;
  exp: number;
}

export interface File {
  originalName: string;
  name: string;
  employee: string;
  task: string;
  status: "uploading" | "completed" | "failed";
  assignedTo: string;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  content: string;
  from: Employee;
  created_at: Date;
}
