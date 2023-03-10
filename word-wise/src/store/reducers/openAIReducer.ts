import { FlashCardObject, LearningContent } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LearningContentState extends Array<LearningContent> {}

const openAIreducer = createSlice({
    name: 'openAIreducer',
    initialState: [] as LearningContentState,
    reducers: {
      setData: (state, action: PayloadAction<LearningContent>) => {
        state.push(action.payload);
      },
      setFlashcards: (state, action: PayloadAction<LearningContent>) => {
        const updatedLearningContents = state.filter(
          (lc) => lc.id !== action.payload.id
        );
        return [...updatedLearningContents, action.payload];
      },
      addData: (state, action: PayloadAction<LearningContent[]>) => {
        return [...state, ...action.payload];
      }
    },
  });
  
  export const { setData, setFlashcards, addData } = openAIreducer.actions;
  export default openAIreducer.reducer;