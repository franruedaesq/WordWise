import { LearningContentState } from '@/types/store';
import { createSelector } from '@reduxjs/toolkit';

const selectOpenAIState = (state: any) => state.openAIreducer;

export const selectLearningContentById = createSelector(
    selectOpenAIState,
    (_: any, id: string) => id,
    (learningContentState: LearningContentState, id: string) => {
      return learningContentState.find((lc) => lc.id === id);
    },
  );
  