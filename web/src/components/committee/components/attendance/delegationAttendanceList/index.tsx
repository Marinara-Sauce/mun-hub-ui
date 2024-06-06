import { Box, Typography, Menu, MenuItem, List, ListItem, IconButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { Delegation, AttendanceEntryType } from "../../../../../model/interfaces";
import PendingIcon from "@mui/icons-material/Pending";

export default function DelegationAttendanceList({
    columnTitle,
    delegations,
    currentAttendance,
    overrideAttendance,
    removeAttendance,
  }: {
    columnTitle: string;
    delegations: Delegation[];
    currentAttendance?: AttendanceEntryType;
    overrideAttendance: (
      delegationId: number,
      attendanceType: AttendanceEntryType,
    ) => void;
    removeAttendance: (delegationId: number) => void;
  }) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [delegationWithMenuOpen, setDelegationWithMenuOpen] =
      useState<number>();
    const menuOpen = Boolean(anchorEl);
  
    function handleClick(
      event: React.MouseEvent<HTMLButtonElement>,
      delegationId: number,
    ) {
      setAnchorEl(event.currentTarget);
      setDelegationWithMenuOpen(delegationId);
    }
  
    function handleClose() {
      setAnchorEl(null);
      setDelegationWithMenuOpen(undefined);
    }
  
    return (
      <>
        <Box sx={{ justifyContent: "center", mx: 1, textOverflow: "initial"}}>
          <Typography fontWeight="bold">{columnTitle}</Typography>
          <Menu
            id="modify-attendance-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "modify-button",
            }}
          >
            {currentAttendance !== AttendanceEntryType.PRESENT ? (
              <MenuItem
                onClick={() => {
                  overrideAttendance(
                    delegationWithMenuOpen!,
                    AttendanceEntryType.PRESENT,
                  );
                  handleClose();
                }}
              >
                Mark as Present
              </MenuItem>
            ) : null}
            {currentAttendance !== AttendanceEntryType.PRESENT_AND_VOTING ? (
              <MenuItem
                onClick={() => {
                  overrideAttendance(
                    delegationWithMenuOpen!,
                    AttendanceEntryType.PRESENT_AND_VOTING,
                  );
                  handleClose();
                }}
              >
                Mark as Present & Voting
              </MenuItem>
            ) : null}
            {currentAttendance ? (
              <MenuItem
                onClick={() => {
                  removeAttendance(delegationWithMenuOpen!);
                  handleClose();
                }}
              >
                Mark as Absent
              </MenuItem>
            ) : null}
          </Menu>
          <List>
            {delegations.map((d) => (
              <ListItem
                key={d.delegation_id}
                disableGutters
                secondaryAction={
                  <IconButton
                    aria-label="Pending"
                    size="small"
                    id="modify-button"
                    onClick={(event) => handleClick(event, d.delegation_id)}
                    aria-controls={
                      menuOpen ? "modify-attendance-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                  >
                    <PendingIcon />
                  </IconButton>
                }
              >
                <ListItemText>{d.delegation_name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </>
    );
  }