const express = require('express');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<form method="post" action="/transcript"><input type="text" name="url" placeholder="Enter YouTube video URL" required><button type="submit">Get Transcript</button></form>');
});

app.post('/transcript', async (req, res) => {
  const url = req.body.url;
  const videoId = url.split('watch?v=')[1];

  try {
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcriptData.map(entry => entry.text).join('\n');
    res.send(`<pre>${transcriptText}</pre><a href="/">Back</a>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve transcript. Make sure the video has captions and try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
