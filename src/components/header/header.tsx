import { Button, IconButton } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import './header.css';
import { useHeader } from '../../contexts/headerContext';

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
                <Button>Admin Login</Button>
            </div>
        </div>
    );
}