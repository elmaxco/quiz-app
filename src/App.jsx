import React, { useState, useEffect } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        if (!response.ok) {
          throw new Error("Failed to load questions.");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!isGameStarted) {
      return; // Om spelet inte har startat, gör inget
    }

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    setTimerId(timer);

    return () => clearTimeout(timer);
  }, [timeLeft, isGameStarted]); // Lägg till isGameStarted som beroende

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    clearTimeout(timerId);
    if (answer === questions[currentQuestionIndex].answer) {
      setFeedback("Rätt svar!");
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setFeedback("Fel svar!");
    }
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setTimeLeft(10);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleTimeout = () => {
    setFeedback("Tiden är slut!");
    setShowCorrectAnswer(true);
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setFeedback("");
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setTimeLeft(10);
    setIsGameOver(false);
    setCorrectAnswers(0);
    setIsGameStarted(false); // Återgå till startskärmen
  };

  const handleStartGame = () => {
    setIsGameStarted(true); // Starta spelet
    setTimeLeft(10); // Återställ tid
  };

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-gray-300 to-blue-600">
        <h1 className="text-3xl font-bold mb-4">Quizspelet!</h1>
        <button
          onClick={handleStartGame}
          className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Starta spelet
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center mt-10">Laddar frågor...</div>;
  }

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-gray-300 to-blue-600">
        <h1 className="text-3xl font-bold mb-4">Quizspelet</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Spelet är slut!</h2>
          <p className="text-lg font-medium mb-4">Du fick {correctAnswers} av {questions.length} rätt!</p>
          <button
            onClick={handleRestartGame}
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Spela igen
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-gray-300 to-blue-600">
      <h1 className="text-3xl font-bold mb-4">Quizspelet</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <p className="text-gray-700 text-sm mb-2">Tid kvar: {timeLeft} sekunder</p>
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelection(option)}
              disabled={showCorrectAnswer}
              className={`py-2 px-4 border rounded-lg text-center ${
                selectedAnswer === option
                  ? "bg-gray-200"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && (
          <p
            className={`mt-4 text-lg ${
              feedback === "Rätt svar!" ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedback}
          </p>
        )}
        {showCorrectAnswer && (
          <div className="mt-4">
            <p className="text-gray-700">
              Rätt svar: <span className="font-bold">{currentQuestion.answer}</span>
            </p>
            <button
              onClick={handleNextQuestion}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Nästa fråga
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
