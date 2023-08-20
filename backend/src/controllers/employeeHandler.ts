import { PublishPacket } from "aedes";
import Employee from "../models/Employee";
import { Employee as EmployeeInterface } from "../types";

export default (message: PublishPacket, done: () => void) => {
  const operationType = message.topic.split("/")[1];
  console.log(operationType);

  if (operationType === "save")
    saveEmployee({
      password: "123",
    });

  if (operationType === "delete") deleteEmployee();

  done();
};

function saveEmployee(employee: EmployeeInterface) {
  const EMPLOYEE = new Employee(employee);
  EMPLOYEE
    .save()
    .then(employee => console.log(employee))
    .catch(err => console.log(err));
}

function deleteEmployee() {
  console.log("delete");
}
