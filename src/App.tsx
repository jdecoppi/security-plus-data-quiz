
import { useState } from 'react'
import './App.css'
import QuizBtn from './components/QuizBtn'

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
  const [currentQuestionOptionAText, setCurrentQuestionOptionAText] = useState("");
  const [currentQuestionOptionBText, setCurrentQuestionOptionBText] = useState("");
  const [currentQuestionOptionCText, setCurrentQuestionOptionCText] = useState("");
  const [currentQuestionOptionDText, setCurrentQuestionOptionDText] = useState("");
  const [currentQuestionCorrectAnswer, setQuestionCorrectAnswer] = useState(0);
  const [finalOutputString, setFinalOutputString] = useState(''); //not a fan of this but w.e

  const [quizPhase, setQuizPhase] = useState(0)


  return (


    <>
      <div className="">
        <h1>Security+ Quiz - Data</h1>
        <p>This quiz will present you 10 questions out of a pool of 25, by connecting through a mySQL databsee that is authenticated with Azure Key Vault.</p>
        <QuizBtn 
        displayedString="Start Quiz"
        btnPhase={quizPhase} />
      </div>


    </>
  )
}

export default App
