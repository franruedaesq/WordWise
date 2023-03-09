import { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

interface FlashcardProps {
  frontText: string;
  backText: string;
  onSuccess: () => void;
  onError: () => void;
}

const FlashcardContainer = styled('div')({
  perspective: '1000px',
  cursor: 'pointer',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '5px'
});

const Flashcard = ({ frontText, backText, onSuccess: onCorrectClick, onError: onIncorrectClick }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
    // Only render the component on the client-side
    const [rendered, setRendered] = useState<boolean>(false);
    useEffect(() => setRendered(true), []);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrectClick = () => {
    setIsFlipped(false);
    onCorrectClick();
  };

  const handleIncorrectClick = () => {
    setIsFlipped(false);
    onIncorrectClick();
  };

  if (!rendered) {
    return null;
  }

  return (
    <FlashcardContainer onClick={handleClick} >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerStyle={{ width: "250px", height: "400px", background: "white", color:"black" }}>
        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">{frontText}</Typography>
        </div>
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <Typography variant="h6">{backText}</Typography>
        <div>
            <Button variant="contained" color="success" onClick={handleCorrectClick} sx={{ marginRight: '10px'}}>&#10003; </Button>
            <Button variant="outlined" color="error" onClick={handleIncorrectClick}>	&#10060;</Button>
        </div>
        </div>
      </ReactCardFlip>
    </FlashcardContainer>
  );
};

export default Flashcard;
