export type Note = {
  uid: string;
  title: string;
  collapse: boolean;
  type: "text" | "html" | "tasks";
  content?: string;
  html?: string;
  tasks?: Array<{ task: string; completed: boolean }>;
};
