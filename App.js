import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");

  useEffect(()=> {
    axios.get("http://localhost:5000/api/history").then(r=>setMessages(r.data));
  },[]);

  const send=async()=>{
    if(!input.trim())return;
    const u={role:"user",content:input};
    setMessages(p=>[...p,u]);
    const r=await axios.post("http://localhost:5000/api/message",{message:input});
    const a={role:"ai",content:r.data.reply};
    setMessages(p=>[...p,a]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==="user"?"user-msg":"ai-msg"}>{m.content}</div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask for movie recommendations..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
