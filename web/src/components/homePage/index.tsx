import { Box, Button, Typography } from "@mui/material";

export default function HomePage() {
  
  const mostRecentCommittee = localStorage.getItem('recentCommittee');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2, textAlign: 'center' }}>
        <Typography variant="h2">
            Welcome to Tiger MUN!
        </Typography>
        <Typography variant="h5">
            Where would you like to go?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mostRecentCommittee ? <Button variant="contained" sx={{ width: '100%' }} href={`/committee/${mostRecentCommittee}`}>Go to your most recent committee</Button> : null}
        <Box sx={{ display: 'flex', gap: 4 }}>
            <Button
            variant="outlined"
            href="/committee"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 2,
                gap: 1,
                width: '400px',
                height: '500px',
            }}
            >
            <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                Committees
            </Typography>
            <Typography variant="body2">
                View a list of committees in session at the conference, including the speakers list, working papers, access voting, and attendance.
            </Typography>
            </Button>
            <Button
            variant="outlined"
            href="/delegation"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 2,
                gap: 1,
                width: '400px',
                height: '500px'
            }}
            >
            <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                Delegations
            </Typography>
            <Typography variant="body2">
                {'Explore the participating delegations, including committees they\'re apart of and their working papers.'}
            </Typography>
            </Button>
            </Box>
        </Box>
        </Box>
    );
}