import { combineReducers } from '@reduxjs/toolkit';
import openAIreducer from '../store/reducers/openAIReducer';

const rootReducer = combineReducers({
  openAIreducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;