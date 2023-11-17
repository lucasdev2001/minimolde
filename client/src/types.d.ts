export interface Employee {
  _id: string;
  name: string;
  email: string;
  teams: Team[];
  roles: string[];
  profilePicture: string;
}

export interface Team {
  _id?: string | null;
  name: string;
  description: string;
  employees: Employee[];
}

export type TaskStatus = "started" | "inProgress" | "completed";

export interface Task {
  _id?: string | null;
  title: string;
  description: string;
  assignedTo: string[];
  assignedType: "self" | "employees" | "team";
  status: TaskStatus;
  employees?: Employee[];
}

export interface Token {
  _id: string;
  exp: number;
}

export type Status = "uploading" | "completed" | "failed";

export interface File {
  originalName: string;
  name: string;
  employee: string;
  status: Status;
  assignedTo: string;
  created_at?: Date | number;
  updated_at?: Date | number;
}

export interface Notification {
  content: string;
  from: Employee;
  created_at: Date;
}
