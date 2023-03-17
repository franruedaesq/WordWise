import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Flashcard from '@/components/Flaschard';
import { LearningContent } from '@/types';
import { getLearningContent, getLearningContentItem } from '@/utils/dynamodb';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


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

  const handleButtonClick = () => {
  }

  if (learningContent) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, alignItems: "center", padding: "20px", paddingBottom: "150px" }}>
        <Grid container spacing={2} display="flex" justifyContent="center" paddingLeft={"20px"} maxWidth={"350px"}>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            // pagination={{
            //   clickable: true,
            // }}
            // navigation={true}
            modules={[ Navigation]}
            style={{
              width: "100%",
              height: "100%",
            }}
            cssMode={true}
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
        <Grid maxWidth="350px" paddingTop="50px">
        <Typography variant="h6" textAlign="center">{learningContent.title.german}</Typography>
            <Typography variant="h6" textAlign="center" pb={1}>{learningContent.title.english}</Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Show text</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {learningContent.text}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Grammar and Syntax Explanation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography whiteSpace="pre-line" >
                {learningContent.grammar ? learningContent.grammar : "We are working on it" }
              </Typography>
            </AccordionDetails>
          </Accordion>
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
