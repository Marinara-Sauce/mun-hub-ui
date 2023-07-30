import { Button, IconButton } from '@mui/material';
import React from 'react';
import ReorderIcon from '@mui/icons-material/Reorder';
import DeleteIcon from '@mui/icons-material/Delete';
import './header.css';

export default function AppHeader() {
    return (
        <div className="page-header">
            <div className="left-bar">
                <IconButton>
                    <ReorderIcon />
                </IconButton>
                <h2>MUN HUB</h2>
            </div>
            <Button>Admin Login</Button>
        </div>
    );
}