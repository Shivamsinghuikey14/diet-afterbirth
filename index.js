const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

// Function to read data from the JSON file
const getDataFromFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${fileName}: ${err.message}`);
  }
};

// Endpoint to fetch diet data based on diet type, meal type, or benefits
app.get('/diet/:dietType?/:mealType?', async (req, res) => {
  try {
    const { dietType, mealType } = req.params;
    const data = await getDataFromFile('./data.json');

    if (!dietType) {
      return res.json(data.postpartumDietPlan);
    }

    if (data.postpartumDietPlan[dietType]) {
      if (mealType) {
        if (data.postpartumDietPlan[dietType][mealType]) {
          return res.json(data.postpartumDietPlan[dietType][mealType]);
        } else {
          return res.status(404).send('Meal type not found for the selected diet');
        }
      }
      return res.json(data.postpartumDietPlan[dietType]);
    } else {
      return res.status(404).send('Diet type not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the postpartum diet API!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
