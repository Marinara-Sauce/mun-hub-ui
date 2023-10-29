import { Delegation } from "./delegation";
import { WorkingPaper } from "./workingPaper";

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
}

export enum CommitteeStatus {
  IN_SESSION = 1,
  SUSPENDED_SESSION = 2,
  OUT_OF_SESSION = 3,
  UNMOD = 4,
  MOD = 5,
}

export enum CommitteePollingType {
  NONE = 1,
  VOTING = 2,
  ATTENDANCE = 3,
}

export function CommitteeStatusToString(status: CommitteeStatus) {
  switch (status) {
    case CommitteeStatus.IN_SESSION:
      return "In Session";
    case CommitteeStatus.OUT_OF_SESSION:
      return "Out of Session";
    case CommitteeStatus.SUSPENDED_SESSION:
      return "Suspended Session";
    case CommitteeStatus.MOD:
      return "Moderated Caucus";
    case CommitteeStatus.UNMOD:
      return "Unmoderated Caucus";
  }
}
