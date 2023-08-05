import { Button, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Widget from "../../../widget/widget";
import './working-papers.css';
import React from "react";

export default function WorkingPapers() {

    const tableData = [
        {
          workingGroupName: 'Group A',
          groupMembers: 'John Doe, Jane Smith',
          paperLink: 'https://example.com/paperA',
        },
        {
          workingGroupName: 'Group B',
          groupMembers: 'Alice Johnson, Bob Williams',
          paperLink: 'https://example.com/paperB',
        },
        {
          workingGroupName: 'Group C',
          groupMembers: 'Michael Brown, Emily Davis',
          paperLink: 'https://example.com/paperC',
        },
        // Add more data rows as needed
    ];

    return (
        <Widget title="Working Papers">
            <table className="table">
                <thead>
                    <tr className="table-header">
                        <th>Working Group Name</th>
                        <th>Group Members</th>
                        <th>Paper Link</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                    <tr key={index}>
                        <td>{row.workingGroupName}</td>
                        <td>{row.groupMembers}</td>
                        <td>
                        <a href={row.paperLink} target="_blank" rel="noopener noreferrer">
                            {row.paperLink}
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </Widget>
    );
}