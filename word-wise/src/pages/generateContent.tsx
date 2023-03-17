import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Flashcard, FlashCardObject, Generatedtitle, TextObj } from '@/types';
import { RootState } from '@/types/store';
import { setData, setFlashcards } from '@/store/reducers/openAIReducer';
import { v4 as uuidv4 } from 'uuid';
import { fetchText } from '@/utils/openAI';
import { fetchFlashcards } from '../utils/openAI';
import LoaderComponent from '@/components/Loader';
import { setLoading } from '@/store/reducers/loader';
import { saveLearningContent } from '@/utils/dynamodb';

interface FlashcardResp {
  content: string;
  role: string;
}

const GenerateContent: React.FC = () => {
  const dispatch = useDispatch();
  // const data = useSelector((state: RootState) => state.openAIreducer);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [selectedType, setSelectedType] = useState<string>('dialogue');
  const [selectedSize, setSelectedSize] = useState<string>('25 words');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<Generatedtitle>({
    german: "",
    english: "",
  });
  const prevNewText = useRef('');
  const [newText, setNewText] = useState<string>("{}");
  const [newTextId, setNewTextId] = useState<string>("");
  const [flashcardsarray, setFlashcardsArray] = useState<Flashcard[]>([])



  const handleGenerate = async () => {
    setGeneratedText("")
    setGeneratedTitle({
      german: "",
      english: "",
    })
    dispatch(setLoading(true));
    const respText = await fetchText(selectedType, selectedSize, selectedDifficulty)
    .then((resp) => {
      setNewText(resp)
      dispatch(setLoading(false))
    })
  };

  const handleGetFlashcards = async () => {
    dispatch(setLoading(true));
    const respFlashcards = await fetchFlashcards(generatedText, newTextId)
    .then((resp) => {
      dispatch(setLoading(false));
      return resp
    })
    try {
      const flashcardContent: {flashcards:Flashcard[]} = JSON.parse(respFlashcards.content);
      setFlashcardsArray(flashcardContent.flashcards)
      dispatch(setFlashcards({ 
        id: newTextId, 
        flashcards: flashcardContent.flashcards, 
        title: generatedTitle, 
        text: generatedText, 
        type: selectedType, 
        size: selectedSize, 
        difficulty: selectedDifficulty }))
      
    } catch (error) {
      console.log(error);
      handleGetFlashcards();
    }
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType((event.target as HTMLInputElement).value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize((event.target as HTMLInputElement).value);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDifficulty((event.target as HTMLInputElement).value);
  };

  const saveContentInDatabase = async () => {
    if (flashcardsarray.length > 0) {
      await saveLearningContent({ 
        id: newTextId, 
        flashcards: flashcardsarray, 
        title: generatedTitle, 
        text: generatedText, 
        type: selectedType, 
        size: selectedSize, 
        difficulty: selectedDifficulty })
    }
  }

  useEffect(() => {
    saveContentInDatabase()
  }, [flashcardsarray])



  useEffect(() => {
    if (newText && newText !== prevNewText.current) {
      try {
        const textContent: TextObj = JSON.parse(newText);
        if (Object.keys(textContent).length !== 0) { // check if textContent is not an empty object
          const textId = uuidv4();
          setNewTextId(textId)
          dispatch(setData({ id: textId, ...textContent, type: selectedType, size: selectedSize, difficulty: selectedDifficulty, flashcards: [] }));
          setGeneratedText(textContent.text);
          setGeneratedTitle(textContent.title);
        }
      } catch (error) {
        console.log(error);
        handleGenerate();
      }
      prevNewText.current = newText;
    }
  }, [newText]);

  return (
    <div>
      <Box display='flex' flexDirection='column' alignItems="center" justifyContent="space-evenly" height="300px">
        <Typography variant="h4" component="h1" gutterBottom>
          Generate German Text
        </Typography>
        <Box display='flex'>
          <FormControl component="fieldset">
            <FormLabel component="legend">Type of Text</FormLabel>
            <RadioGroup
              aria-label="text-type"
              name="text-type"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <FormControlLabel value="dialogue" control={<Radio />} label="Dialogue" />
              <FormControlLabel value="story" control={<Radio />} label="Story" />
              <FormControlLabel value="data" control={<Radio />} label="Random Data" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Size of Text</FormLabel>
            <RadioGroup
              aria-label="text-size"
              name="text-size"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <FormControlLabel value="25 words" control={<Radio />} label="Short" />
              <FormControlLabel value="40 words" control={<Radio />} label="Medium" />
              <FormControlLabel value="55 words" control={<Radio />} label="Large" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Difficulty</FormLabel>
            <RadioGroup
              aria-label="text-difficulty"
              name="text-difficulty"
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
            >
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="medium" control={<Radio />} label="Medium" />
              <FormControlLabel value="expert" control={<Radio />} label="Expert" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleGenerate} size="small" sx={{ maxWidth: "250px" }}>
          Generate
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" maxWidth={1000} margin="0 auto">
        {isLoading ? <LoaderComponent/> : 
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <Box display="flex" mt={4} ml={3} flexWrap="wrap">
          <Typography variant="h5" component="h4" gutterBottom mr={1}>
            {generatedTitle?.german}
          </Typography>
          <Typography variant="h5" component="h5" gutterBottom>
            {generatedTitle?.english && `(${generatedTitle?.english})`}
          </Typography>
        </Box>
        <Typography variant="body1" component="p" gutterBottom whiteSpace="pre-line" mt={1} ml={3}>
          {generatedText && generatedText}
        </Typography>
        {generatedText && <Button variant="contained" color="primary" onClick={handleGetFlashcards} size="small" sx={{ maxWidth: "250px", marginTop:"20px" }}>
          Get Flashcards
        </Button>}
        </div>
        }
      </Box>
    </div>
  );
};

export default GenerateContent;
