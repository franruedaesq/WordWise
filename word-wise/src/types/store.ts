import { combineReducers } from '@reduxjs/toolkit';
import openAIreducer from '../store/reducers/openAIReducer';
import loaderReducer from '../store/reducers/loader';
import { LearningContent } from '.';

const rootReducer = combineReducers({
  openAIreducer,
  loading: loaderReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export interface LearningContentState extends Array<LearningContent> {}