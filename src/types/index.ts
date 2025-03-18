export enum StageOptions {
  PENDING = "PENDING",
  PROGRESS = "PROGRESS",
  COMPLETE = "COMPLETE",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: StageOptions;
}
