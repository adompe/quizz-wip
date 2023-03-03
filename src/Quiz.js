import "./styles/App.css";
import React, { useState, useEffect } from "react";
import quizDatas from "./data/quiz.json";
import AnswerForm from "./AnswerForm";
import Canvas from "./Canvas";
import CanvasIsland from "./CanvasIsland";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

function Quiz() {
  const [step, setStep] = useState(0);

  const [results, setResults] = useState([]);
  const [isFinnish, setIsFinnish] = useState(false);

  const [minutes, setMinutes] = useState(2);
  const [secondes, setSecondes] = useState(30);

  const NextStepButton = (e) => {
    if (step + 1 < quizDatas.length) {
      setMinutes(2);
      setSecondes(30);
    } else setIsFinnish(true);
    setStep(step + 1);
  };

  const resetQuestions = (e) => {
    setIsFinnish(false);
    setMinutes(2);
    setSecondes(30);
    setStep(0);
    setResults([]);
  };

  useEffect(() => {
    let interval;

    if (step < quizDatas.length) {
      // Countdown timer
      interval = setInterval(() => {
        if (minutes === 0 && secondes === 0) {
          setMinutes(2);
          setSecondes(30);
          setStep(step + 1);
        } else if (secondes === 0) {
          setMinutes(minutes - 1);
          setSecondes(60);
        } else setSecondes(secondes - 1);
      }, 1000);
    }

    return () => (interval ? clearInterval(interval) : null);
  }, [minutes, secondes, step]);

  return (
    <div className='question' style={{ width: "75%", paddingTop: "30px" }}>
      <LinearProgress
        variant='determinate'
        value={(step / quizDatas.length) * 100}
        style={{ width: "100%" }}
      />
      {!isFinnish ? (
        <div>
          <div className='quiz-header'>
            <div className='timer'>
              {minutes}:{secondes < 10 ? "0" + secondes : secondes}
            </div>
            <div className='quiz-title'>
              Question {step + 1} sur {quizDatas.length}
            </div>
          </div>

          {quizDatas[step].type === "question" ? (
            <AnswerForm
              question={quizDatas[step].question}
              answers={quizDatas[step].answers}
              currentResult={results[step]}
              setResult={(result) => {
                let currentResults = [...results];
                currentResults[step] = result;
                setResults(currentResults);
              }}
            />
          ) : (
            <CanvasIsland
              question={quizDatas[step].question}
              setCompleted={() => {
                let currentResults = [...results];
                currentResults[step] = 1;
                setResults(currentResults);
              }}
            />
          )}
          <Button
            onClick={NextStepButton}
            variant='contained'
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            NEXT
          </Button>
        </div>
      ) : (
        <div>
          <div className='quiz-header'>
            <div className='quiz-title'>
              {quizDatas.reduce(
                (acc, value, indexQuestion) =>
                  acc +
                  (value.answers
                    ? value.answers.some(
                        (answer, indexAnswer) =>
                          answer.isCorrect &&
                          indexAnswer === results[indexQuestion]
                      )
                      ? 1
                      : 0
                    : results[indexQuestion] === 1
                    ? 1
                    : 0),
                0
              )}{" "}
              sur {quizDatas.length}
            </div>
          </div>
          <ul className='results-list'>
            {quizDatas.map((quizData, idx) =>
              quizData.type === "question" ? (
                <li key={idx} className='result-list'>
                  <span>Question {idx}</span>
                  {quizData.answers.some(
                    (answer, answerIdx) =>
                      answer.isCorrect && answerIdx === results[idx]
                  )
                    ? "✅"
                    : "❌"}
                </li>
              ) : (
                <li key={idx} className='result-list'>
                  <span>Question {idx}</span>
                  {results[idx] === 1 ? "✅" : "❌"}
                </li>
              )
            )}
          </ul>
          <Button
            onClick={resetQuestions}
            variant='contained'
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            RESET
          </Button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
