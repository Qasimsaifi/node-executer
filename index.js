const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/execute', (req, res) => {
  const pythonCode = req.body.code; // Assuming you receive the Python code in the request body

  exec(`python -c "${pythonCode}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ error: 'An error occurred while executing Python code.' });
      return;
    }

    if (stderr) {
      console.error(`Python Error: ${stderr}`);
      res.status(400).json({ error: 'There was an error in the Python code.' });
      return;
    }

    console.log(`Python Output: ${stdout}`);
    res.json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
