
import { useState } from 'react'
import './App.css'
import QuizBtn from './components/QuizBtn'
import mysql from'mysql2/promise';

async function ConnectToDB() {
  

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'secplususer',
  database: 'security_plus_questions',
});

// A simple SELECT query
try {
  const [results, fields] = await connection.query(
    'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45'
  );

  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
}

// Using placeholders
try {
  const [results] = await connection.query(
    'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    ['Page', 45]
  );

  console.log(results);
} catch (err) {
  console.log(err);
}


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

  const [quizPhase, setQuizPhase] = useState(0)



  switch (quizPhase) {

    case 0:
      return (
        <>
          <div className="">
            <h1>Security+ Quiz - Data</h1>
            <p>This quiz will present you 10 questions out of a pool of 25, by connecting through a mySQL databsee.</p>
            <QuizBtn
              displayedString="Start Quiz"
              onClick={() => setQuizPhase((quizPhase) => quizPhase + 1)}
            />
          </div>
        </>
      )

    case 1:
      ConnectToDB()
      return (
        <>
          <div className="">
            <h2>Question {currentQuestionCount.toString()}: {currentQuestionText}</h2>


            <ol style={{ listStyleType: 'upper-alpha' }}>
              <li>{currentQuestionOptionAText}</li>
              <li>{currentQuestionOptionBText}</li>
              <li>{currentQuestionOptionCText}</li>
              <li>{currentQuestionOptionDText}</li>
            </ol>
            
            <QuizBtn
              displayedString={currentQuestionCount === 10 ? "END QUIZ" : "Next Question"} 
              onClick={() => currentQuestionCount === 10 ? setQuizPhase(quizPhase => quizPhase + 1) : setCurrentQuestionCount((currentQuestionCount) => currentQuestionCount + 1)}
              />


          </div>
        </>
      )

    case 2:

    default:


  }
}

export default App
