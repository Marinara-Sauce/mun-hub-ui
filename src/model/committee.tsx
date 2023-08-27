import { Participant } from "./participant";

export interface Committee {
    committee_id: number;
    committee_name: string;
    committee_abbreviation: string;
    committee_description?: string;
    committee_status: CommitteeTypes;
    participants: Participant[];
}

export enum CommitteeTypes {
    IN_SESSION = 1,
    SUSPENDED_SESSION = 2,
    OUT_OF_SESSION = 3,
    UNMOD = 4,
    MOD = 5
};