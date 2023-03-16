import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Flashcard from '@/components/Flaschard';
import { LearningContent } from '@/types';
import { getLearningContent, getLearningContentItem } from '@/utils/dynamodb';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper";


interface Props {
  learningContent: LearningContent;
}

const FlashcardPage: React.FC<Props> = ({ learningContent }) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const handleSuccess = (index: number) => {
    console.log(index)
    // setCurrentFlashcardIndex(currentFlashcardIndex + 1)
  };
  
  const handleError = (index: number) => {
    console.log(index)
    // setCurrentFlashcardIndex(currentFlashcardIndex + 1)
  };
  

  if (learningContent) {
    return (
      <Box sx={{ display:"flex", flexGrow: 1, justifyContent: "center", padding: "20px", paddingBottom: "150px" }}>
        <Grid container spacing={2} display="flex" justifyContent="center" paddingLeft="70px" maxWidth={"400px"}>
          <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]} loop={true} style={{
            width: "100%",
            height: "100%",
          }}

          >
            {learningContent.flashcards.map((flashcard, index) => (
              <SwiperSlide key={index}>
                <Flashcard
                  frontText={flashcard.front}
                  backText={flashcard.back}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
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
  // Fetch the learning content item with the specified ID
  const learningContent = await getLearningContentItem(params.id);

  return {
    props: {
      learningContent,
    },
  };
}

export default FlashcardPage;
