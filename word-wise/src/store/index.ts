import { configureStore } from '@reduxjs/toolkit';
import openAIreducer from './reducers/openAIReducer';
import loaderReducer from './reducers/loader';

const store = configureStore({
  reducer: {
    openAIreducer,
    loading: loaderReducer,
  },
});

export default store;