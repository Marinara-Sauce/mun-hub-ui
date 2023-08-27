import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Delegation } from "../../model/delegation";
import { useHeader } from "../../contexts/headerContext";
import Widget from "../widget/widget";
import CommitteesTable from "./components/committeesTable/committeesTable";

export default function DelegationPage() {
    const { id } = useParams();

    const [delegation, setDelegation] = useState<Delegation>();

    const setHeader = useHeader()[1];

    useEffect(() => {
        fetch(`http://localhost:8000/delegations/${id}`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d: Delegation) => {
                setDelegation(d as Delegation);
                console.log(d)
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => setHeader(delegation ? delegation.delegation_name : 'Delegations'), [delegation]);

    if (!delegation) {
        return (<CircularProgress />)
    }

    return (
        <Box>
            <Widget title="Committees">
                <CommitteesTable delegation={delegation} />
            </Widget>
            <Widget title="Working Papers">
                <CommitteesTable delegation={delegation} />
            </Widget>
        </Box>
    );
}