import { Committee } from "./committee";

export interface Delegation {
    delegation_id: number;
    delegation_name: string;
    committees: Committee[];
    workingPapers: string[];

}