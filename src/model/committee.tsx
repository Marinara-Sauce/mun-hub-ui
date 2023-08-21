import { Participant } from "./participant";

export interface Committee {
    committeeId: number;
    committeeName: string;
    committeeAbbreviation: string;
    committeeDescription?: string;
    committeeStatus: CommitteeTypes;
    participants: Participant[];
}

export enum CommitteeTypes {
    IN_SESSION = 1,
    SUSPENDED_SESSION = 2,
    OUT_OF_SESSION = 3,
    UNMOD = 4,
    MOD = 5
};