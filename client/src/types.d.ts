export interface Employee {
  _id: string;
  name: string;
  email: string;
  teams: Team[];
  roles: string[];
  profilePicture: string;
}

export interface Team {
  name: string;
  description: String;
  employees: Employee[];
}

export interface Task {
  title: string;
  description: string;
  assignedTo: string[];
  status: "started" | "progress" | "completed";
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
