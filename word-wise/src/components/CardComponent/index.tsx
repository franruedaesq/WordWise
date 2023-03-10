import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

interface CardProps {
  englishTitle: string;
  germanTitle: string;
  text: string;
  flashcardID: string;
}

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const CardComponent: React.FC<CardProps> = ({
  englishTitle,
  germanTitle,
  text,
  flashcardID,
}) => {
  const router = useRouter();
  const handleButtonClick = () => {
    const id = flashcardID; // replace with the ID you want to navigate to
    router.push(`/flashcard/${id}`);
  };
  return (
    <div style={{ maxWidth: "1000px", margin: "10px auto", borderRadius: "10px", }}>
      <Card>
        <StyledCardContent>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h5">{germanTitle}</Typography>
            <Typography variant="h6">{englishTitle}</Typography>
          </div>
          <Typography variant="body1" mt={2}>{text}</Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: "10px" }} onClick={handleButtonClick}>
            Go to Flashcards
          </Button>
        </StyledCardContent>
      </Card>
    </div>
  );
};

export default CardComponent;
