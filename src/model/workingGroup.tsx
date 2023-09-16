import { Delegation } from "./delegation";

export interface WorkingGroup {
    working_group_id: number;
    working_group_name: string;
    delegations: Delegation[];
}