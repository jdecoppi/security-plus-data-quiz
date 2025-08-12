import { useState, useEffect } from 'react'
import './App.css'
import QuizBtn from './components/QuizBtn'
import { CosmosClient } from '@azure/cosmos';

async function ConnectToCosmosDB() {

  // const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;

  if (!connectionString) {
    console.error('Missing COSMOS_DB_CONNECTION_STRING in .env file');
    return;
  }

  const client = new CosmosClient(connectionString);
  const database = client.database('security_plus_questions');
  const container = database.container('secplusqs');


  try {
    //SELECT * from container limit 10 sort by rand
    //select 10 by random



    //i dont think nodwl

    const uniqueNumbers = generateUniqueRandomNumbers(10, 1, 25);
    console.log(uniqueNumbers);

    const placeholders = uniqueNumbers.map((_, i) => `@id${i}`).join(", "); //the slots
    const parameters = uniqueNumbers.map((value, i) => ({ name: `@id${i}`, value })); //values tio put in the slots


    const querySpec = {
      query: `SELECT * FROM c WHERE c.QuestionID IN (${placeholders})`,
      parameters
    };

    const { resources: results } = await container.items
      .query(querySpec)
      .fetchAll();
    console.log(results);
    return results;
  } catch (err) {
    console.log(err);
  }
}

function generateUniqueRandomNumbers(count: number, min: number, max: number): number[] {
  if (count > (max - min + 1)) {
    throw new Error("Count cant be larger than max or miximum, review.,");
  }

  const uniqueNumbers = new Set<number>();
  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }
  return Array.from(uniqueNumbers);
}

function App() {

  //scratch notes
  /* phases: before quiz has started, quiz ongoing, quiz finished */
  /* variables per phase:
  ........before: none
  ........during: currentQuestion (int), optionA (str), optionB (str), optionC (str), optionD (str), correctAnswers (array int), selectedAnswers (arrayint), output
  ........after:  */

  /* processing 
  .......before: just the submit btn to start
  .......during: connection query, 
  .......scoreScreen: 
  */


  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentQuestionOptionAText, setCurrentQuestionOptionAText] = useState("a");
  const [currentQuestionOptionBText, setCurrentQuestionOptionBText] = useState("b");
  const [currentQuestionOptionCText, setCurrentQuestionOptionCText] = useState("c");
  const [currentQuestionOptionDText, setCurrentQuestionOptionDText] = useState("d");
  const [currentQuestionCorrectAnswer, setQuestionCorrectAnswer] = useState(0);
  const [finalOutputString, setFinalOutputString] = useState(''); //not a fan of this but w.e
  const [connectOnce, setConnectOnce] = useState(0)

  const [quizPhase, setQuizPhase] = useState(0)


  const [results, setResults] = useState<any[]>([])

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState<number | null>(null);

  // Function to fetch questions from Cosmos DB
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await ConnectToCosmosDB();
      if (data && data.length > 0) {
        setResults(data);
        setCurrentQuestionCount(1); // Start with the first question
        updateCurrentQuestion(data, 0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setFinalOutputString("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the current question display based on question index
  const updateCurrentQuestion = (questionData: any[], index: number) => {
    if (questionData && questionData.length > index) {
      const question = questionData[index];
      setCurrentQuestionText(question.QuestionText || "");
      setCurrentQuestionOptionAText(question.OptionAText || "");
      setCurrentQuestionOptionBText(question.OptionBText || "");
      setCurrentQuestionOptionCText(question.OptionCText || "");
      setCurrentQuestionOptionDText(question.OptionDText || "");
      setQuestionCorrectAnswer(question.CorrectOption || 0);
      
      // Check if there's already a selected answer for this question
      const existingAnswer = selectedAnswers[index];
      setCurrentSelectedAnswer(existingAnswer !== undefined ? existingAnswer : null);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setCurrentSelectedAnswer(answerIndex);
    
    // Update the selected answers array
    const newSelectedAnswers = [...selectedAnswers];
    // We need to use currentQuestionCount - 1 as the index because question count starts at 1
    newSelectedAnswers[currentQuestionCount - 1] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
    
    console.log("Selected answers updated:", newSelectedAnswers);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    // Save current answer if one is selected
    if (currentSelectedAnswer !== null) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionCount - 1] = currentSelectedAnswer;
      setSelectedAnswers(newSelectedAnswers);
    } else {
      // If no answer selected, mark as 0 (unanswered)
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionCount - 1] = 0;
      setSelectedAnswers(newSelectedAnswers);
    }
    
    // Log for debugging
    console.log("Moving from question", currentQuestionCount);
    console.log("Current selected answers:", selectedAnswers);
    
    if (currentQuestionCount < results.length) {
      // Move to next question - note the index is currentQuestionCount because arrays are 0-indexed
      const nextQuestionIndex = currentQuestionCount;
      setCurrentQuestionCount(currentQuestionCount + 1);
      updateCurrentQuestion(results, nextQuestionIndex);
    } else {
      // Calculate score
      calculateAndDisplayScore();
    }
  };

  // New function to calculate score with improved logging and type handling
  const calculateAndDisplayScore = () => {
    // Make sure to convert both arrays to the same type (number)
    const correctAnswers = results.map(result => Number(result.CorrectOption));
    const userAnswers = selectedAnswers.map(answer => Number(answer));
    
    console.log("Final selected answers:", userAnswers);
    console.log("Correct answers:", correctAnswers);
    
    let correctCount = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      // Explicitly compare as numbers
      const isCorrect = correctAnswers[i] === userAnswers[i];
      console.log(`Question ${i+1}: User selected ${userAnswers[i]} (${typeof userAnswers[i]}), correct is ${correctAnswers[i]} (${typeof correctAnswers[i]}), ${isCorrect ? 'CORRECT' : 'WRONG'}`);
      if (isCorrect) {
        correctCount++;
      }
    }
    
    console.log(`Final score: ${correctCount} out of ${results.length}`);
    setScore(correctCount);
    setQuizPhase(2); // Move to score screen
  };

  // Effect to fetch questions when starting the quiz
  useEffect(() => {
    if (quizPhase === 1 && results.length === 0) {
      fetchQuestions();
    }
  }, [quizPhase]);

  switch (quizPhase) {

    case 0:
      return (
        <>
          <div className="">
            <h1>Security+ Quiz - Data</h1>
            <p>This quiz will present you 10 questions out of a pool of 25, by connecting through a database.</p>
            <QuizBtn
              displayedString="Start Quiz"
              onClick={() => setQuizPhase(1)}
            />
          </div>
        </>
      );

    case 1:
      return (
        <>
          <div className="">
            {isLoading ? (
              <p>Loading questions...</p>
            ) : (
              <>
                <h2>Question {currentQuestionCount} of {results.length}: {currentQuestionText}</h2>

                <ol style={{ listStyleType: 'upper-alpha' }}>
                  <li 
                    onClick={() => handleAnswerSelect(1)}
                    className={currentSelectedAnswer === 1 ? "selected-answer" : ""}
                  >
                    {currentQuestionOptionAText}
                  </li>
                  <li 
                    onClick={() => handleAnswerSelect(2)}
                    className={currentSelectedAnswer === 2 ? "selected-answer" : ""}
                  >
                    {currentQuestionOptionBText}
                  </li>
                  <li 
                    onClick={() => handleAnswerSelect(3)}
                    className={currentSelectedAnswer === 3 ? "selected-answer" : ""}
                  >
                    {currentQuestionOptionCText}
                  </li>
                  <li 
                    onClick={() => handleAnswerSelect(4)}
                    className={currentSelectedAnswer === 4 ? "selected-answer" : ""}
                  >
                    {currentQuestionOptionDText}
                  </li>
                </ol>

                <QuizBtn
                  displayedString={currentQuestionCount === results.length ? "Finish Quiz" : "Next Question"}
                  onClick={handleNextQuestion}
                />
              </>
            )}
          </div>
        </>
      );

    case 2:
      return (
        <>
          <div className="">
            <h2>Quiz Finished!</h2>
            <p>Your score is: {score} out of {results.length}</p>
            <QuizBtn
              displayedString="Restart Quiz"
              onClick={() => {
                setCurrentQuestionCount(0);
                setScore(0);
                setSelectedAnswers([]);
                setResults([]);
                setQuizPhase(0);
              }}
            />
          </div>
        </>
      );

    default:
      return null;


  }
}

export default App