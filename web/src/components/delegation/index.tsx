import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Delegation } from "../../model/interfaces";
import { useHeader } from "../../contexts/headerContext";
import Widget from "../shared/widget";
import CommitteesTable from "./components/committeesTable";
import { useApi } from "../../contexts/apiContext";
import WorkingPaperTable from "./components/workingPaperTable";

export default function DelegationPage() {
  const { id } = useParams();

  const { axiosInstance } = useApi();

  const [delegation, setDelegation] = useState<Delegation>();

  const setHeader = useHeader()[1];

  useEffect(() => {
    axiosInstance.get(`/delegations/advanced/${id}`)
      .then((response) => setDelegation(response.data));
  }, [id]);

  useEffect(
    () => setHeader(delegation ? delegation.delegation_name : "Delegations"),
    [delegation],
  );

  if (!delegation) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Widget title="Committees">
        <CommitteesTable delegation={delegation} />
      </Widget>
      <Widget title="Working Papers">
        <WorkingPaperTable delegation={delegation} />
      </Widget>
    </Box>
  );
}
