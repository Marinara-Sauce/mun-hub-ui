import { Box, Button } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function AppFooter() {
    return (
        <Box sx={{
            m: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '100%'
        }}>
            <Button
                variant="contained"
                color="primary"
                href={"https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    minWidth: 'unset',
                    padding: 0,
                    margin: 8
                }}
            >
                <InstagramIcon style={{ fontSize: '32px' }} />
            </Button>
            <Button
                variant="contained"
                color="primary"
                href={"https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    minWidth: 'unset',
                    padding: 0,
                    margin: 8
                }}
            >
                <TwitterIcon style={{ fontSize: '32px' }} />
            </Button>
        </Box>
    )
}