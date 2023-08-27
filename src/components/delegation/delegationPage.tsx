import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Delegation } from "../../model/delegation";
import { useHeader } from "../../contexts/headerContext";
import Widget from "../widget/widget";
import { Committee } from "../../model/committee";

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

    const tableData: Committee[] = [];

    return (
        <Box>
            <Widget title="Committees">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Committee Name</th>
                            <th>Committee Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length > 0 ? tableData.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <a href={`/committee/${row.committee_id}`}>{row.committee_name}</a>
                            </td>
                            <td>{row.committee_status}</td>
                        </tr>
                        )) : <Typography sx={{m: 1}}>No Data to Show :(</Typography>}
                    </tbody>
                </table>
            </Widget>
            <Widget title="Working Papers">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Committee Name</th>
                            <th>Working Group Name</th>
                            <th>Working Group Members</th>
                            <th>Working Group Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length > 0 ? tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.committee_name}</td>
                            <td>{row.committee_status}</td>
                        </tr>
                        )) : <Typography sx={{m: 1}}>No Data to Show :(</Typography>}
                    </tbody>
                </table>
            </Widget>
        </Box>
    );
}