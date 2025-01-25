import React, { useState, useEffect } from "react"; 
// Importerar React och hookarna useState och useEffect. Dessa används för att hantera state och sidverkan i komponenten.

const App = () => {
  // Huvudkomponenten för ditt quizspel.

  const [questions, setQuestions] = useState([]); 
  // State för att lagra quizfrågorna.

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  // Håller reda på vilken fråga som visas för tillfället.

  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  // Håller reda på användarens valda svar.

  const [feedback, setFeedback] = useState(""); 
  // Ger feedback till användaren, t.ex. "Rätt svar!" eller "Fel svar!".

  const [timeLeft, setTimeLeft] = useState(10); 
  // Timer för varje fråga.

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); 
  // Visar om det rätta svaret ska visas.

  const [timerId, setTimerId] = useState(null); 
  // Sparar ID för timer för att kunna rensa den vid behov.

  const [isGameOver, setIsGameOver] = useState(false); 
  // Håller reda på om spelet är slut.

  const [correctAnswers, setCorrectAnswers] = useState(0); 
  // Håller koll på antalet rätta svar.

  const [isGameStarted, setIsGameStarted] = useState(false); 
  // Håller reda på om spelet har startat.

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("./questions.json");
        // Hämtar frågor från en JSON-fil.

        if (!response.ok) {
          throw new Error("Failed to load questions.");
        }

        const data = await response.json();
        setQuestions(data); 
        // Sparar de hämtade frågorna i state.
      } catch (error) {
        console.error("Error fetching questions:", error); 
        // Loggar ett eventuellt fel.
      }
    };

    fetchQuestions(); 
    // Körs endast en gång vid komponentens initiering tack vare beroendelistan [].
  }, []);

  useEffect(() => {
    if (!isGameStarted) {
      return; // Gör inget om spelet inte har startat.
    }

    if (timeLeft === 0) {
      handleTimeout(); 
      // Om tiden är slut, hantera timeout-logik.
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1); 
      // Minskar timern varje sekund.
    }, 1000);

    setTimerId(timer); 
    // Sparar timer-ID:t.

    return () => clearTimeout(timer); 
    // Rensar timern vid uppdateringar eller när komponenten förstörs.
  }, [timeLeft, isGameStarted]); 
  // Reagerar på ändringar av timeLeft och isGameStarted.

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer); 
    // Sätter användarens valda svar.

    clearTimeout(timerId); 
    // Stoppar timern när ett svar väljs.

    if (answer === questions[currentQuestionIndex].answer) {
      setFeedback("Rätt svar!"); 
      // Om svaret är rätt, ge positiv feedback.
      setCorrectAnswers((prev) => prev + 1); 
      // Öka antalet rätta svar.
    } else {
      setFeedback("Fel svar!"); 
      // Annars ge negativ feedback.
    }

    setShowCorrectAnswer(true); 
    // Visa det korrekta svaret.
  };

  const handleNextQuestion = () => {
    setFeedback(""); 
    // Återställ feedback.

    setSelectedAnswer(null); 
    // Rensa användarens val.

    setShowCorrectAnswer(false); 
    // Dölj rätt svar.

    setTimeLeft(10); 
    // Återställ tid för nästa fråga.

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); 
      // Gå till nästa fråga om det finns fler.
    } else {
      setIsGameOver(true); 
      // Om det inte finns fler frågor, avsluta spelet.
    }
  };

  const handleTimeout = () => {
    setFeedback("Tiden är slut!"); 
    // Ge timeout-feedback.

    setShowCorrectAnswer(true); 
    // Visa rätt svar när tiden tar slut.
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0); 
    setFeedback(""); 
    setSelectedAnswer(null); 
    setShowCorrectAnswer(false); 
    setTimeLeft(10); 
    setIsGameOver(false); 
    setCorrectAnswers(0); 
    setIsGameStarted(false); 
    // Återställ alla state till startvärden.
  };

  const handleStartGame = () => {
    setIsGameStarted(true); 
    // Starta spelet.

    setTimeLeft(10); 
    // Återställ timern.
  };

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-blue-300 to-blue-600">
        <h1 className="text-3xl font-bold mb-4">Quizspelet! 𝞹📈🧠📚</h1>
        <button
          onClick={handleStartGame}
          className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Starta spelet
        </button>
      </div>
    );
    // Startskärmen med en "Starta spelet"-knapp.
  }

  if (questions.length === 0) {
    return <div className="text-center mt-10">Laddar frågor...</div>;
    // Visar en laddningsskärm tills frågorna är hämtade.
  }

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-gray-300 to-blue-600">
        <h1 className="text-3xl font-bold mb-4">Quizspelet! 𝞹📈🧠📚</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Grattis!</h1>
          <h2 className="text-xl font-semibold mb-4">Quizspelet är slut!</h2>
          <p className="text-lg font-medium mb-4">Du fick {correctAnswers} av {questions.length} rätt!🥳</p>
          <button
            onClick={handleRestartGame}
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Spela igen
          </button>
        </div>
      </div>
    );
    // Skärmen som visas när spelet är slut, inklusive resultat och en knapp för att starta om.
  }

  const currentQuestion = questions[currentQuestionIndex];
  // Hämtar den aktuella frågan baserat på index.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-gray-300 to-blue-600">
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
  // Huvudlayouten för varje fråga.
};

export default App;
// Exporterar komponenten för användning i din applikation.
