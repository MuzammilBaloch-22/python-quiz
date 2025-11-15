
import React, { useMemo, useEffect, useState } from 'react';
import type { Question, Answer } from '../types';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: Answer[];
  onRestart: () => void;
}

interface ReviewItemProps {
    question: Question;
    userAnswer: Answer;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ question, userAnswer }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCorrect = userAnswer.isCorrect;
    
    return (
        <div className="border-b border-light-border dark:border-dark-border py-4">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left flex justify-between items-center">
                <p className="flex-1 font-medium">{question.question}</p>
                <span className={`text-2xl ml-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    {isCorrect ? <span className="text-light-correct dark:text-dark-correct">✓</span> : <span className="text-light-incorrect dark:text-dark-incorrect">✗</span>}
                </span>
            </button>
            {isExpanded && (
                <div className="mt-4 pl-4 border-l-4 border-light-border dark:border-dark-border">
                    <p className="mb-2">
                        Your answer: <span className={`font-semibold ${isCorrect ? 'text-light-correct dark:text-dark-correct' : 'text-light-incorrect dark:text-dark-incorrect'}`}>
                            {userAnswer.selectedAnswer || 'Timed out'}
                        </span>
                    </p>
                    {!isCorrect && (
                        <p className="mb-2">
                            Correct answer: <span className="font-semibold text-light-correct dark:text-dark-correct">
                                {userAnswer.correctAnswer}
                            </span>
                        </p>
                    )}
                    <p className="text-sm text-light-text-alt dark:text-dark-text-alt">Topic: {question.topic}</p>
                </div>
            )}
        </div>
    );
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart }) => {
  
  // Key logic: Scoring and result generation
  const { correctAnswers, wrongAnswers, score, percentage } = useMemo(() => {
    const correct = userAnswers.filter((answer) => answer.isCorrect).length;
    const wrong = questions.length - correct;
    const perc = (correct / questions.length) * 100;
    return {
      correctAnswers: correct,
      wrongAnswers: wrong,
      score: correct,
      percentage: perc.toFixed(1),
    };
  }, [userAnswers, questions.length]);

  // Key logic: Save score to LocalStorage
  useEffect(() => {
    localStorage.setItem('pythonQuizLastScore', JSON.stringify(score));
    const bestScore = localStorage.getItem('pythonQuizBestScore');
    if (!bestScore || score > JSON.parse(bestScore)) {
      localStorage.setItem('pythonQuizBestScore', JSON.stringify(score));
    }
  }, [score]);

  const copyResultsToClipboard = () => {
    const resultText = `I scored ${score}/${questions.length} (${percentage}%) on Python Quiz Master!`;
    navigator.clipboard.writeText(resultText).then(() => {
        alert('Results copied to clipboard!');
    });
  };

  return (
    <div className="p-4 md:p-8 bg-light-bg-alt dark:bg-dark-bg-alt rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Quiz Results</h2>

      {/* Score Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
        <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
          <p className="text-sm text-light-text-alt dark:text-dark-text-alt">Score</p>
          <p className="text-3xl font-bold">{score} / {questions.length}</p>
        </div>
        <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
          <p className="text-sm text-light-text-alt dark:text-dark-text-alt">Percentage</p>
          <p className="text-3xl font-bold text-light-primary dark:text-dark-primary">{percentage}%</p>
        </div>
        <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
          <p className="text-sm text-light-text-alt dark:text-dark-text-alt">Correct</p>
          <p className="text-3xl font-bold text-light-correct dark:text-dark-correct">{correctAnswers}</p>
        </div>
        <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
          <p className="text-sm text-light-text-alt dark:text-dark-text-alt">Wrong</p>
          <p className="text-3xl font-bold text-light-incorrect dark:text-dark-incorrect">{wrongAnswers}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <button
          onClick={onRestart}
          className="w-full md:w-auto px-8 py-3 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg text-lg hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors duration-300"
        >
          Restart Quiz
        </button>
        <button
          onClick={copyResultsToClipboard}
          className="w-full md:w-auto px-8 py-3 bg-light-bg-alt dark:bg-dark-bg-alt border border-light-border dark:border-dark-border font-bold rounded-lg text-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-300"
        >
          Share Score
        </button>
      </div>


      {/* Review Answers */}
      <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Review Your Answers</h3>
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                  <ReviewItem key={index} question={question} userAnswer={userAnswers[index]} />
              ))}
          </div>
      </div>
    </div>
  );
};
