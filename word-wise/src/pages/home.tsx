import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getLearningContent } from '@/utils/dynamodb';
import CardComponent from '@/components/CardComponent';
import { LearningContent } from '@/types';
import { addData } from '@/store/reducers/openAIReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types/store';

const Home: React.FC = () => {
  
  const dispatch = useDispatch();
  const contentList = useSelector((state: RootState) => state.openAIreducer);
  const [learningContentToShow, setLearningContentToShow] = useState(10);
  const [totalLearningContent, setTotalLearningContent] = useState(0);

  const handleGetList = async () => {
    getLearningContentList()
  };

  const getLearningContentList = async () => {
    const list: LearningContent[] = await getLearningContent('story');
    setTotalLearningContent(list.length)
    dispatch(addData(list))
  }

  const loadMoreObjects = () => {
    setLearningContentToShow(learningContentToShow + 10);
  };

  useEffect(() => {
    console.log("are we here", contentList.length)
    if (contentList.length == 0) {
      console.log("what about here?")
      getLearningContentList()
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (learningContentToShow < totalLearningContent) {
          loadMoreObjects();
        }
      }
    });
    return () => window.removeEventListener('scroll', loadMoreObjects);
  }, [learningContentToShow, totalLearningContent]);

  return (
    <Box sx={{ flexGrow: 1, padding: "20px", paddingBottom: "150px" }}>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={handleGetList}
        size="small"
        sx={{ maxWidth: '250px', marginTop: '20px' }}
      >
        Get List
      </Button> */}
      {contentList.length > 0 &&
        contentList.slice(0, learningContentToShow).map((item) => (
          <CardComponent
            key={item.id}
            englishTitle={item.title.english}
            germanTitle={item.title.german}
            text={item.text}
            flashcardID={item.id}
          />
        ))}
    </Box>
  );
};

export default Home;
