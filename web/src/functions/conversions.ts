import { CommitteeStatus } from "../model/interfaces";


export function CommitteeStatusToString(status: CommitteeStatus) {
  if (!status) return "";

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
