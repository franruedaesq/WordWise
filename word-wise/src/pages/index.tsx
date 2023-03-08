import { IItem } from '@/utils/item';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';

const Home: React.FC = () => {
  const [item, setItem] = useState<IItem>({
    id: uuidv4(), // Genera un ID aleatorio
    UserId: "",
    Name: "",
    Email: "",
    Level: "",
    TypeOfContent: "",
    Progress: {
      FlashCardsCompleted: 0,
      QuizzesCompleted: 0,
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch(`/api/dynamo/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: item,
      }),
    });
    if (res.ok) {
      setItem({
        id: uuidv4(), // Genera un ID aleatorio
        UserId: "",
        Name: "",
        Email: "",
        Level: "",
        TypeOfContent: "",
        Progress: {
          FlashCardsCompleted: 0,
          QuizzesCompleted: 0,
        },
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input type="text" name="UserId" value={item.UserId} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="Name" value={item.Name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="text" name="Email" value={item.Email} onChange={handleChange} />
        </label>
        <label>
          Level:
          <input type="text" name="Level" value={item.Level} onChange={handleChange} />
        </label>
        <label>
          Type of Content:
          <input type="text" name="TypeOfContent" value={item.TypeOfContent} onChange={handleChange} />
        </label>
        <label>
          Flash Cards Completed:
          <input type="number" name="FlashCardsCompleted" value={item.Progress.FlashCardsCompleted} onChange={e => setItem({ ...item, Progress: { ...item.Progress, FlashCardsCompleted: parseInt(e.target.value) } })} />
        </label>
        <label>
          Quizzes Completed:
          <input type="number" name="QuizzesCompleted" value={item.Progress.QuizzesCompleted} onChange={e => setItem({ ...item, Progress: { ...item.Progress, QuizzesCompleted: parseInt(e.target.value) } })} />
        </label>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default Home;
