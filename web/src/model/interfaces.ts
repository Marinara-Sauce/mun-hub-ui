export interface AdminUser {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  super_user: boolean;
}

export interface Committee {
  committee_id: number;
  committee_name: string;
  committee_abbreviation: string;
  committee_description?: string;
  committee_status: CommitteeStatus;
  committee_announcement: string;
  committee_poll: CommitteePollingType;
  delegations: Delegation[];
  working_papers: WorkingPaper[];
  speaker_list_open: boolean;
}

export interface Delegation {
  delegation_id: number;
  delegation_name: string;
  committees: Committee[];
  working_papers: WorkingPaper[];
}

export interface WorkingPaper {
  working_paper_id: number;
  paper_link: string;
  committee_id: number;
  working_group_name: string;
  delegations: Delegation[];
}

export interface VotingSession {
  live: boolean,
  committee_id: number,
  open_time: string,
  close_time: string,
  voting_session_id: number,
  votes: Vote[],
}

export interface Vote {
  timestamp: string,
  delegation_id: number,
  voting_session_id: number,
  vote: VoteType,
  vote_id: number,
}

export interface AttendanceSession {
  live: boolean,
  committee_id: number,
  open_time: string,
  close_time: string,
  attendance_session_id: number,
  entries: Attendance[],
}

export interface Attendance {
  timestamp: string,
  delegation_id: number,
  attendance_session_id: number,
  entry: AttendanceEntryType,
  attendance_entry_id: number,
}

export enum CommitteeStatus {
  IN_SESSION = 1,
  SUSPENDED_SESSION = 2,
  OUT_OF_SESSION = 3,
  UNMOD = 4,
  MOD = 5
}

export enum CommitteePollingType {
  NONE = 1,
  VOTING = 2,
  ATTENDANCE = 3
}

export enum VoteType {
  YES = 1,
  NO = 2,
  ABSTAIN = 3
}

export enum AttendanceEntryType {
  PRESENT = 1,
  PRESENT_AND_VOTING = 2
}