import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Flashcard from '@/components/Flaschard';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { selectLearningContentById } from '@/store/selectors/openAI';

const FlashcardPage: React.FC = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const learningContent = useSelector((state) => selectLearningContentById(state, id as string));

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const handleSuccess = (index: number) => {
    // console.log(index)
    // setCurrentFlashcardIndex(currentFlashcardIndex + 1)
  };

  const handleError = (index: number) => {
    // console.log(index)
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

export default FlashcardPage;
