import cors from 'cors';
import express from 'express';
import {
    sentence
} from 'txtgen';
const app = express();
app.use(cors());


function genParagraph(sentences) {
    let paragraph = '';
    for (let i = 0; i < sentences; i++) {
        paragraph += sentence() + '. ';
    }
    return paragraph;
}

function capitalizeFirstLetter(sentence) {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

app.get('/generate-paragraph', (req, res, next) => {
    try {
        const sentences = parseInt(req.query.sentences) || 2;
        const punctuations = req.query.punctuations === 'true';
        console.log(punctuations);
        const capital = req.query.capital === 'true';

        let filteredText = genParagraph(sentences);

        if (capital) {
            // Corrected to use filteredText instead of paragraph
            filteredText = filteredText.split('. ').map(sentence => capitalizeFirstLetter(sentence)).join('. ');
        } else {
            filteredText = filteredText.toLowerCase();
        }

        if (!punctuations) {
            filteredText = filteredText.replace(/[^\w\s]/g, '');
        }
        filteredText = filteredText.trim();
        res.json({ paragraph: filteredText });
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(process.env.PORT || 3001);