import { AppBar, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';

interface AppBarProps {
    title: string;
}

export const AppHeader = ({ title }: AppBarProps) => {
    const router = useRouter();
    return (
        <AppBar position="static" style={{ height: "60px", display: "flex", justifyContent: "center", padding: "0 20px", position: "fixed", zIndex: 1 }}>
            <Toolbar>
                <Button color='secondary' onClick={() => router.push('/')} style={{ textTransform: 'none' }}>
                    <Typography variant="h5">{title}</Typography>
                </Button>

            </Toolbar>
        </AppBar>
    );
};
