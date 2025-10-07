export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  startDate?: Date;
  endDate?: Date;
}
