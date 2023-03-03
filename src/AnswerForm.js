import "./styles/App.css";
import React from "react";
import Radio from "@mui/material/Radio";

function AnswerForm({ question, answers, currentResult, setResult }) {
  return (
    <div className='answer'>
      <p>{question}</p>
      <form>
        <ul className='results-list'>
          {answers &&
            answers.map((answer, index) => {
              return (
                <li
                  key={index}
                  className='result-list'
                  onClick={() => setResult(index)}
                >
                  <span>{answer.content}</span>
                  <Radio
                    value={index}
                    onChange={() => setResult(index)}
                    checked={currentResult === index}
                  />
                </li>
              );
            })}
        </ul>
      </form>
    </div>
  );
}

export default AnswerForm;
