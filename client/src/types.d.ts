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
