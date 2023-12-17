import { Button } from "@mui/material";
import { useState } from "react";
import { useCommittee } from "../../../contexts/committeeContext";
import TextFieldDialog from "../../../../shared/textFieldDialog/textFieldDialog";

export default function RenameCommittee() {
  const { committee, updateCommittee } = useCommittee();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRenameClicked = () => {
    setRenameDialogOpen(true);
  };

  const handleRename = (name: string) => {
    setRenameLoading(true);
    if (committee) {
      updateCommittee(
        {
          ...committee,
          committee_name: name,
        },
        () => {
          setRenameDialogOpen(false);
          setRenameLoading(false);
        },
      );
    }
  };

  return (
    <>
      <TextFieldDialog
        open={renameDialogOpen}
        title={"Rename Committee"}
        buttonLoading={renameLoading}
        textFieldLabel={"New Committee Name"}
        onSubmit={handleRename}
        onClose={() => setRenameDialogOpen(false)}
      />
      <Button
        variant="contained"
        sx={{ flex: 1, margin: 1 }}
        onClick={handleRenameClicked}
      >
        Rename Committee
      </Button>
    </>
  );
}
