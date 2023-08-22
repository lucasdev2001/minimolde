import { PublishPacket } from "aedes";
import Employee from "../models/Employee";
import { Employee as EmployeeInterface } from "../types";

export default (message: PublishPacket, done: () => void) => {
  const operationType = message.topic.split("/")[1];
  const employee = message.payload.toString();

  if (operationType === "save") saveEmployee(employee);
  if (operationType === "auth") authenticateEmployee();

  if (operationType === "update") updateEmployee();

  if (operationType === "delete") deleteEmployee();

  done();
};

function saveEmployee(employee: string) {
  try {
    const nWemployee = JSON.parse(employee) as EmployeeInterface;
    
  } catch (error) {
    console.log(error);
  }
}

function updateEmployee() {}

function deleteEmployee() {}

function authenticateEmployee() {}
