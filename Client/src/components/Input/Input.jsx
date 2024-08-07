import React, { useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import "./Input.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Input = () => {
  let [text, setText] = useState("");
  let [load, setLoad] = useState(false);

  const mic = () => {
    recognition.start();
    recognition.interimResults = true;
    recognition.addEventListener("result", (e) => {
      text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .pop();
      setText(text);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("topic", text);
      setLoad(true);
      const response = await Axios.post('https://apptgen.vercel.app/post',formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status==200){
        setLoad(false)
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }; 

  return (
    <div className="input-container">
      <form className="container" onSubmit={handleSubmit}>
        <input
          type="text"
          id="prompt"
          placeholder="Topic Name..."
          defaultChecked="false"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <br />
        <div id="mic" onClick={mic}>
          <FontAwesomeIcon icon={faMicrophone} />
        </div>
        <button
          type="submit"
          id="button"
        >
          Submit
        </button>
        {load && <div className="loading"> Loading...</div>}
      </form>
    </div>
  );
};

export default Input;
