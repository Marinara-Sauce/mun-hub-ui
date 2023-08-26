import { Box, Button, IconButton, Tab } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import './header.css';
import { useHeader } from '../../contexts/headerContext';
import { Link } from 'react-router-dom';

export default function AppHeader() {

    const [ header ] = useHeader();

    return (
        <div className="page-header">
            <div className="left-bar">
                <IconButton>
                    <ReorderIcon />
                </IconButton>
                <h2>{header}</h2>
            </div>
            <div className="right-bar">
                <Button component={Link} to="/committee" sx={{m: 1}}>Committees</Button>
                <Button component={Link} to="/delegations" sx={{m: 1}}>Delegations</Button>
                <Button component={Link} to="/login" sx={{m: 1}}>Admin Login</Button>
            </div>
        </div>
    );
}