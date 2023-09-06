const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Endpoint to execute Node.js code
app.post('/execute', (req, res) => {
  const { code } = req.body;

  // Create a temporary JavaScript file
  const tempFileName = `temp_${Date.now()}.js`;
  fs.writeFileSync(tempFileName, code);

  // Execute the temporary file
  execFile('node', [tempFileName], (error, stdout, stderr) => {
    // Delete the temporary file
    fs.unlinkSync(tempFileName);

    if (error) {
      console.error('Execution Error:', error);
      return res.status(500).json({ error: 'An error occurred while executing the code.', stderr });
    }

    if (stderr) {
      console.error('Script Error:', stderr);
      return res.status(400).json({ error: stderr });
    }

    console.log('Execution Result:', stdout);
    res.status(200).json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
