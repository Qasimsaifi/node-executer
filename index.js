const express = require('express');
const { exec } = require('child_process');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Endpoint to execute Node.js code
app.post('/execute', (req, res) => {
  const { code } = req.body;

  exec(`node -e "${code}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (stderr) {
      return res.status(400).json({ error: stderr });
    }

    res.status(200).json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
