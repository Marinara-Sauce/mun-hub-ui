import { Delegation } from "./delegation";

export interface WorkingPaper {
  working_paper_id: number;
  paper_link: string;
  committee_id: number;
  working_group_name: string;
  delegations: Delegation[];
}
