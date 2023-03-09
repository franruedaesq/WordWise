import { configureStore } from '@reduxjs/toolkit';
import openAIreducer from './reducers/openAIReducer';

const store = configureStore({
  reducer: {
    openAIreducer,
  },
});

export default store;