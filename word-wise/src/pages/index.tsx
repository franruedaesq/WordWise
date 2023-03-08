import React, { useEffect, useState } from 'react';
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

interface TextParams {
  textType: string;
  textSize: string;
  textDifficulty: string;
}

interface Generatedtitle {
  german: string;
  english: string;
}

interface TextObj {
  title: Generatedtitle;
  text: string;
}

interface ResponseData {
  response: {
    role: string;
    content: TextObj
  };
}


const Home: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('dialogue');
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<Generatedtitle>({
    german: "",
    english: "",
  });

  const [newText, setNewText] = useState<string>("{}");

  const handleGenerate = async () => {
    // TODO: Implement ChatGPT API call to generate text
    setGeneratedText("")
    setGeneratedTitle({
      german: "",
      english: "",
    })
    fetchData(selectedType, selectedSize, selectedDifficulty)
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

  async function fetchData(textType: string, textSize: string, textDifficulty: string) {
    const params: TextParams = {
      textType,
      textSize,
      textDifficulty,
    };

    const resp = await fetch('/api/openAI/getText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await resp.json()
    console.log(data.response.content)
    setNewText(data.response.content)
  }

  useEffect(() => {
    try {
      const textContent: TextObj = JSON.parse(newText)
      console.log(textContent)
      setGeneratedText(textContent.text)
      setGeneratedTitle(textContent.title)
    } catch (error) {
      console.log(error)
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
          <FormControlLabel value="short" control={<Radio />} label="Short" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="large" control={<Radio />} label="Large" />
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
      <Button variant="contained" color="primary" onClick={handleGenerate} size="small" sx={{ maxWidth: "250px"}}>
        Generate
      </Button>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" mt={4} ml={3}>
        <Typography variant="h5" component="h4" gutterBottom mr={1}>
          {generatedTitle?.german}
        </Typography> 
        <Typography variant="h5" component="h5" gutterBottom>
           {generatedTitle?.english}
        </Typography>
      </Box>
      {/* <Typography variant="h6" component="h4" gutterBottom>
        {generatedTitle?.german} - {generatedTitle?.english}
      </Typography> */}
      <Typography variant="body1" component="p" gutterBottom whiteSpace="pre-line" mt={1} ml={3}>
          {generatedText && generatedText}
      </Typography> 
      </Box>
    </div>
  );
};

export default Home;
