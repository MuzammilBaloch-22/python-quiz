
import React, { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import type { Question, Answer } from './types';
import { QUESTIONS } from './constants/questions';

type QuizState = 'home' | 'active' | 'results';
type Theme = 'light' | 'dark';

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Apply theme class to the root element
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const startQuiz = useCallback(() => {
    // Key logic: Randomly select 50 unique questions for the quiz attempt.
    const shuffledQuestions = shuffleArray(QUESTIONS);
    const selectedQuestions = shuffledQuestions.slice(0, 50);

    // Key logic: For each selected question, shuffle its options.
    const preparedQuestions = selectedQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    
    setQuestions(preparedQuestions);
    setUserAnswers([]);
    setQuizState('active');
  }, []);

  const handleQuizFinish = useCallback((answers: Answer[]) => {
    setUserAnswers(answers);
    setQuizState('results');
  }, []);

  const restartQuiz = () => {
    setQuizState('home');
  };

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen font-sans transition-colors duration-300">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-light-primary dark:text-dark-primary">
            Python Quiz Master
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-light-bg-alt dark:bg-dark-bg-alt hover:opacity-80 transition-opacity"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        <main>
          {quizState === 'home' && <HomeScreen onStartQuiz={startQuiz} />}
          {quizState === 'active' && (
            <QuizScreen questions={questions} onFinish={handleQuizFinish} />
          )}
          {quizState === 'results' && (
            <ResultsScreen
              questions={questions}
              userAnswers={userAnswers}
              onRestart={restartQuiz}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
