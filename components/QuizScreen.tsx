import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, Answer } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (answers: Answer[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect - countdown and auto-advance on timeout
  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(60);
    setSelectedOption(null);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-advance to next question
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or question change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex]);

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      const answer: Answer = {
        question: currentQuestion.question,
        selectedAnswer: selectedOption, // null if no selection was made
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      };
      
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        onFinish(newAnswers);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, currentQuestion, answers, currentQuestionIndex, questions.length, onFinish]);

  const handleNextQuestion = useCallback(() => {
    // Clear timer when manually advancing
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const answer: Answer = {
      question: currentQuestion.question,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };
    
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      onFinish(newAnswers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, currentQuestion, answers, currentQuestionIndex, questions.length, onFinish]);


  const handleOptionSelect = (option: string) => {
    if (selectedOption === null) { // Allow selection only once
        setSelectedOption(option);
    }
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="p-4 md:p-8 bg-light-bg-alt dark:bg-dark-bg-alt rounded-lg shadow-xl">
      {/* Progress Bar and Question Counter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-light-text-alt dark:text-dark-text-alt">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${timeLeft <= 10 ? 'text-red-500 dark:text-red-400' : 'text-light-primary dark:text-dark-primary'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <svg className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 dark:text-red-400' : 'text-light-primary dark:text-dark-primary'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2.5">
          <div
            className="bg-light-primary dark:bg-dark-primary h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold leading-tight">{currentQuestion.question}</h2>
        <p className="text-sm text-light-text-alt dark:text-dark-text-alt mt-2">Topic: {currentQuestion.topic}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`
                w-full p-4 rounded-lg text-left text-lg
                transition-all duration-200 border-2
                ${isSelected 
                  ? 'bg-light-primary dark:bg-dark-primary text-white border-light-primary-hover dark:border-dark-primary-hover'
                  : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border'
                }
                ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="text-right">
        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className="px-8 py-3 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg text-lg disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};
