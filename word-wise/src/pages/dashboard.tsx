import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { fakeData } from '@/utils/fakeData';
import { FakeData } from '@/types';
import Flashcard from '@/components/Flaschard';

interface IFlashcard {
  id: string;
  front: string;
  back: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [learningContent, setLearningContent] = useState<FakeData>(fakeData);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const handleNewCards = () => {
    // TODO: Implement ChatGPT API call to generate new flashcards
  };

  const handleSuccess = () => {
    setCurrentFlashcardIndex(currentFlashcardIndex + 1);
  };

  const handleError = () => {
    setCurrentFlashcardIndex(currentFlashcardIndex + 1);
  };

  const currentFlashcard = learningContent[0].flashcards[currentFlashcardIndex];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }} >
        <Toolbar >
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* TODO: Replace with a menu icon */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              German Flashcards
            </Typography>
            <Button color="inherit" onClick={handleNewCards}>
              New Cards
            </Button>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Flashcard
            frontText={currentFlashcard.front}
            backText={currentFlashcard.back}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
