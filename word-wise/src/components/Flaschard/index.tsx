import { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Button, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useSwiper } from "swiper/react";

interface FlashcardProps {
  frontText: string;
  backText: string;
  onSuccess: (index: number) => void;
  onError: (index: number) => void;
  index: number;
}

const FlashcardContainer = styled('div')({
  perspective: '1000px',
  cursor: 'pointer',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '5px'
});

const Flashcard = ({ frontText, backText, onSuccess: onCorrectClick, onError: onIncorrectClick, index }: FlashcardProps) => {
  const theme = useTheme(); // use the useTheme hook to access the current theme object
  const swiper = useSwiper()

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  // Only render the component on the client-side
  const [rendered, setRendered] = useState<boolean>(false);
  useEffect(() => setRendered(true), []);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrectClick = () => {
    swiper.slideNext()
    setIsFlipped(false);
    onCorrectClick(index);
  };

  const handleIncorrectClick = () => {
    swiper.slideNext()
    setIsFlipped(false);
    onIncorrectClick(index);
  };

  if (!rendered) {
    return null;
  }

  return (
    <FlashcardContainer onClick={handleClick} >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerStyle={{ width: "300px", height: "400px", margin: "10px", borderRadius: "10px", background: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">{frontText}</Typography>
        </div>
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography pt="100px" variant="h6">{backText}</Typography>
          <div style={{ display: 'flex' }}>
            <Button variant="contained" color="success" onClick={handleCorrectClick} sx={{ width: "150px", height: "50px", borderRadius: 0, borderBottomLeftRadius: "10px" }}>&#10003; </Button>
            <Button variant="outlined" color="error" onClick={handleIncorrectClick} sx={{ width: "150px", height: "50px", borderRadius: 0, borderBottomRightRadius: "10px" }}>	&#10060;</Button>
          </div>
        </div>
      </ReactCardFlip>
    </FlashcardContainer>
  );
};

export default Flashcard;
