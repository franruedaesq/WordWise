import { LearningText } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState extends Array<LearningText> {}

const openAIreducer = createSlice({
    name: 'openAIreducer',
    initialState: [] as TextState,
    reducers: {
      setData: (state, action: PayloadAction<LearningText>) => {
        state.push(action.payload);
      },
    },
  });
  
  export const { setData } = openAIreducer.actions;
  export default openAIreducer.reducer;