const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CHAT_FILE = "chat.json";

const movies = [
  { title: "Inception", genre: "sci-fi", rating: 9 },
  { title: "Interstellar", genre: "sci-fi", rating: 9 },
  { title: "The Dark Knight", genre: "action", rating: 9 },
  { title: "3 Idiots", genre: "comedy", rating: 8 },
  { title: "KGF", genre: "action", rating: 8 },
  { title: "Bahubali", genre: "action", rating: 8 },
  { title: "Zindagi Na Milegi Dobara", genre: "drama", rating: 8 },
  { title: "The Conjuring", genre: "horror", rating: 7 },
  { title: "Dangal", genre: "sports", rating: 9 }
];

function loadHistory() {
  if (!fs.existsSync(CHAT_FILE)) return [];
  return JSON.parse(fs.readFileSync(CHAT_FILE));
}

function saveHistory(history) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(history, null, 2));
}

function recommendMovie(message) {
  message = message.toLowerCase();
  const genres = ["action","comedy","horror","drama","sci-fi","sports"];
  let g = genres.find(x => message.includes(x));
  if (g) {
    let result = movies.filter(m=>m.genre===g);
    let out = `Here are some good ${g} movies:\n`;
    result.forEach(m=> out += `🎬 ${m.title} (Rating: ${m.rating}/10)\n`);
    return out;
  }
  if (message.includes("best") || message.includes("top")) {
    let s=[...movies].sort((a,b)=>b.rating-a.rating);
    return `🎥 Best movies you should watch:\n- ${s[0].title}\n- ${s[1].title}`;
  }
  return "Tell me your favourite genre — action, comedy, horror, sci-fi, drama, or sports — and I'll recommend movies!";
}

app.get("/api/history",(req,res)=> res.json(loadHistory()));

app.post("/api/message",(req,res)=>{
  const { message } = req.body;
  if(!message) return res.status(400).json({error:"Message required"});
  const history=loadHistory();
  history.push({role:"user",content:message});
  const reply=recommendMovie(message);
  history.push({role:"ai",content:reply});
  saveHistory(history);
  res.json({reply});
});

app.listen(5000,()=>console.log("Movie bot running http://localhost:5000"));
