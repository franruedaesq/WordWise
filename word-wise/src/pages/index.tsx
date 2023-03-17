import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getLearningContent } from '@/utils/dynamodb';
import CardComponent from '@/components/CardComponent';
import { LearningContent } from '@/types';
import { addData } from '@/store/reducers/openAIReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types/store';

export const getStaticProps = async () => {
  try {
    const list: LearningContent[] = await getLearningContent('');
    return {
      props: { list },
    };
  } catch (error) {
    console.error("Error fetching learning content list:", error);
    return {
      props: { list: [] },
    };
  }
};


const Home: React.FC<{ list: LearningContent[] }> = ({ list }) => {
  const dispatch = useDispatch();
  const contentList = useSelector((state: RootState) => state.openAIreducer);
  const [learningContentToShow, setLearningContentToShow] = useState(10);
  const [totalLearningContent, setTotalLearningContent] = useState(0);

  const loadMoreObjects = () => {
    setLearningContentToShow(learningContentToShow + 10);
  };

  useEffect(() => {
    dispatch(addData(list));
    setTotalLearningContent(list.length);
  }, [list, dispatch]);

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
