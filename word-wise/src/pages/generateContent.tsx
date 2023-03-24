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
import { fetchFlashcards, fetchAnalysis } from '../utils/openAI';
import LoaderComponent from '@/components/Loader';
import { setLoading } from '@/store/reducers/loader';
import { saveLearningContent } from '@/utils/dynamodb';
import { useRouter } from 'next/router';

interface FlashcardResp {
  content: string;
  role: string;
}

const GenerateContent: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const data = useSelector((state: RootState) => state.openAIreducer);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [selectedType, setSelectedType] = useState<string>('dialogue');
  const [selectedSize, setSelectedSize] = useState<string>('25');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<Generatedtitle>({
    german: "",
    english: "",
  });
  const prevTextContent = useRef<TextObj>({
    text: "",
    title: {
      german: "",
      english: "",
    },
    translation: "",
  });
  const [textContent, setTextContent] = useState<TextObj>({
    text: "",
    title: {
      german: "",
      english: "",
    },
    translation: "",
  });
  const [newTextId, setNewTextId] = useState<string>("");
  const [flashcardsarray, setFlashcardsArray] = useState<Flashcard[]>([])
  const [grammar, setGrammar] = useState<string>("")



  const handleGenerateText = async () => {
    setGeneratedText("");
    setGeneratedTitle({
      german: "",
      english: "",
    });
    dispatch(setLoading(true));
    try {
      const respText = await fetchText(selectedType, selectedSize, selectedDifficulty);
      setTextContent(respText);
      dispatch(setLoading(false));
    } catch (error) {
      if (error instanceof Error && error.message.includes("504")) {
        
        console.log("Error 504: Gateway Timeout");
      } else {
        // Manejar otros errores
        console.error(error);
      }
      dispatch(setLoading(false));
    }
  };

  const handleGetFlashcards = async () => {
    dispatch(setLoading(true));
    try {
      const [respFlashcards, respAnalysis] = await Promise.all([
        fetchFlashcards(generatedText, newTextId),
        fetchAnalysis(generatedText, newTextId)
      ]);
      dispatch(setLoading(false));
      const flashcardContent: {id: string, content: Flashcard[]}= respFlashcards;
      setFlashcardsArray(flashcardContent.content);
      setGrammar(respAnalysis.analysis)
      dispatch(setFlashcards({ 
        id: newTextId, 
        flashcards: flashcardContent.content, 
        title: generatedTitle, 
        text: generatedText, 
        type: selectedType, 
        size: selectedSize, 
        difficulty: selectedDifficulty,
        grammar: respAnalysis.analysis
      }));
    } catch (error) {
      console.log(error);
      // handleGetFlashcards();
    }
  };

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
        difficulty: selectedDifficulty,
        grammar: grammar
      })
    }
  }

  useEffect(() => {
    if(flashcardsarray.length > 0 && grammar.length > 0) {
      saveContentInDatabase()
      setFlashcardsArray([])
      setGrammar("")

    }
  }, [flashcardsarray, grammar])



  useEffect(() => {
    if (textContent.text && textContent !== prevTextContent.current) {
      try {
        if (Object.keys(textContent).length !== 0) { // check if textContent is not an empty object
          const textId = uuidv4();
          setNewTextId(textId)
          dispatch(setData({ id: textId, ...textContent, type: selectedType, size: selectedSize, difficulty: selectedDifficulty, flashcards: [], grammar: "" }));
          setGeneratedText(textContent.text);
          setGeneratedTitle(textContent.title);
        }
      } catch (error) {
        console.log(error);
        // handleGenerateText();
      }
      prevTextContent.current = textContent;
    }
  }, [textContent]);

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
              <FormControlLabel value="25" control={<Radio />} label="Short" />
              <FormControlLabel value="40" control={<Radio />} label="Medium" />
              <FormControlLabel value="55" control={<Radio />} label="Large" />
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
        <Button variant="contained" color="primary" onClick={handleGenerateText} size="small" sx={{ maxWidth: "250px" }}>
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
