import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Flashcard from '@/components/Flaschard';
import { RootState } from '@/types/store';
import { LearningContent } from '@/types';
import { getLearningContent, getLearningContentItem } from '@/utils/dynamodb';

interface Props {
  learningContent: LearningContent;
}

const FlashcardPage: React.FC<Props> = ({ learningContent }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const handleSuccess = () => {
    setCurrentFlashcardIndex(currentFlashcardIndex + 1);
  };

  const handleError = () => {
    setCurrentFlashcardIndex(currentFlashcardIndex + 1);
  };

  if (learningContent) {
    const currentFlashcard = learningContent.flashcards[currentFlashcardIndex];

    return (
      <Box sx={{ flexGrow: 1, justifyContent: 'center', padding: "20px", paddingBottom: "150px" }}>
         <Grid container spacing={2} display="flex" justifyContent="center">
            <Flashcard
              frontText={currentFlashcard.front}
              backText={currentFlashcard.back}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Grid>
      </Box>
    );
  } else {
    return (
      <Box sx={{ flexGrow: 1, padding: "20px", paddingBottom: "150px" }}>
         <Grid container spacing={2}>
            <p>Learning content not found</p>
          </Grid>
      </Box>
    );
  }
};

export async function getStaticPaths() {
  // Fetch all the learning content items from DynamoDB
  const learningContent = await getLearningContent('');

  // Generate paths for all the learning content items
  const paths = learningContent.map((item) => ({
    params: { id: item.id },
  }));

  return {
    paths,
    fallback: true,
  };
}
export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    // Fetch the learning content item with the specified ID
    const learningContent = await getLearningContentItem(params.id);

    return {
      props: {
        learningContent,
      },
    };
  } catch (error) {
    console.error("Error fetching learning content:", error);
    return {
      props: {
        learningContent: null,
      },
    };
  }
}


export default FlashcardPage;
