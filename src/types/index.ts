export enum StageOptions {
  PENDING = "PENDING",
  PROGRESS = "IN PROGRESS",
  COMPLETE = "COMPLETE",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: StageOptions;
  index?: number;
}
