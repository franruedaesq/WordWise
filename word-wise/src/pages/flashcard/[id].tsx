import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Flashcard from '@/components/Flaschard';
import { RootState } from '@/types/store';


const FlashcardPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const contentList = useSelector((state: RootState) => state.openAIreducer);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const learningContent = contentList.find(item => item.id === id)
  console.log(learningContent)

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

export default FlashcardPage;


// export async function getServerSideProps(context) {
//     const { params } = context;
//     const { id } = params;
  
//     // Aquí puedes utilizar el ID de la ruta para obtener los datos del post correspondiente
//     // ...
  
//     return {
//       props: {
//         postData: /* los datos del post correspondiente */,
//       },
//     };
//   }