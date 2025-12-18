
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LESSONS } from './constants';
import { Lesson, QueryResult, ChatMessage } from './types';
import { getTutorFeedback, chatWithTutor } from './geminiService';
import { 
  Play, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Database,
  Info,
  Send,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trophy,
  Layers,
  Zap,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tutorFeedback, setTutorFeedback] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [wasCorrect, setWasCorrect] = useState(false);

  const currentLesson = LESSONS[currentLessonIndex];
  const chatEndRef = useRef<HTMLDivElement>(null);

  const groupedLessons = useMemo(() => {
    return {
      Beginner: LESSONS.filter(l => l.difficulty === 'Beginner'),
      Intermediate: LESSONS.filter(l => l.difficulty === 'Intermediate'),
      Advanced: LESSONS.filter(l => l.difficulty === 'Advanced'),
    };
  }, []);

  useEffect(() => {
    const startSnippet = currentLesson.expectedQuery.split(' ')[0] + ' ';
    setSqlQuery(startSnippet);
    setQueryResult(null);
    setTutorFeedback(null);
    setWasCorrect(false);
  }, [currentLessonIndex]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    
    setIsExecuting(true);
    setTutorFeedback(null);
    setQueryResult(null);

    try {
      const evaluation = await getTutorFeedback(
        sqlQuery, 
        currentLesson.task, 
        currentLesson.schema, 
        currentLesson.expectedQuery,
        currentLesson.initialData
      );
      
      setTutorFeedback(evaluation.feedback);
      setWasCorrect(evaluation.isCorrect);

      setQueryResult({
        columns: evaluation.columns || [],
        rows: evaluation.rows || [],
        error: evaluation.rows.length === 0 && !evaluation.isCorrect ? "Query produced no data. Double check your filters!" : undefined
      });

      if (evaluation.isCorrect && !completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }
    } catch (err) {
      console.error(err);
      setQueryResult({ columns: [], rows: [], error: "The SQL engine encountered a temporary delay." });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetLesson = () => {
    const startSnippet = currentLesson.expectedQuery.split(' ')[0] + ' ';
    setSqlQuery(startSnippet);
    setQueryResult(null);
    setTutorFeedback(null);
    setWasCorrect(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMsg = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await chatWithTutor(chatMessages, userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Skelly is currently unavailable. Try again in a moment." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < LESSONS.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Intermediate': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Advanced': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'Beginner': return <Zap size={14} className="text-blue-500" />;
      case 'Intermediate': return <Layers size={14} className="text-purple-400" />;
      case 'Advanced': return <Trophy size={14} className="text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0c10] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`bg-[#11141b] border-r border-gray-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">SQL Academy</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Beginner Mastery</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {(Object.entries(groupedLessons) as [string, Lesson[]][]).map(([difficulty, lessons]) => (
            <div key={difficulty} className="space-y-2">
              <div className="flex items-center justify-between px-2 mb-3">
                <div className="flex items-center gap-2">
                  {getDifficultyIcon(difficulty)}
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{difficulty}</h3>
                </div>
                <span className="text-[9px] font-bold text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{lessons.length}</span>
              </div>
              <div className="space-y-1">
                {lessons.map((lesson) => {
                  const lessonIdx = LESSONS.findIndex(l => l.id === lesson.id);
                  const isActive = currentLessonIndex === lessonIdx;
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(lessonIdx)}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 border-blue-600/30 shadow-inner' 
                          : 'hover:bg-gray-800/50 text-gray-500 hover:text-gray-300 border-transparent'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle size={16} className="text-blue-500 shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 border-2 rounded-full shrink-0 ${isActive ? 'border-blue-500' : 'border-gray-700'}`} />
                      )}
                      <span className="truncate text-xs font-semibold">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 bg-gray-900/40 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</span>
            <span className="text-[10px] font-bold text-blue-500">{Math.round((completedLessons.length / LESSONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${(completedLessons.length / LESSONS.length) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 bg-[#11141b]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
            >
              <BookOpen size={18} />
            </button>
            <div className="h-6 w-px bg-gray-800 mx-2" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white truncate max-w-[250px]">{currentLesson.title}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getDifficultyColor(currentLesson.difficulty)}`}>
                {currentLesson.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-[#0a0c10] p-1 rounded-lg border border-gray-800">
                <button 
                  onClick={goToPrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="p-1.5 hover:bg-gray-800 rounded-md disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="px-3 flex items-center text-[11px] font-mono text-gray-500">
                  {currentLessonIndex + 1} / {LESSONS.length}
                </div>
                <button 
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === LESSONS.length - 1}
                  className="p-1.5 hover:bg-gray-800 rounded-md disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
             </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Instructions */}
          <section className="w-full lg:w-[380px] border-r border-gray-800 flex flex-col bg-[#0a0c10] overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles size={16} />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Concepts</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {currentLesson.description}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 rounded-2xl shadow-xl shadow-blue-900/10">
                <h3 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                   Assignment
                </h3>
                <p className="text-gray-100 text-sm font-medium leading-relaxed">
                  {currentLesson.task}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Table Schema</h3>
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800/50 font-mono text-[11px] text-blue-300/80 leading-relaxed overflow-x-auto">
                  {currentLesson.schema}
                </div>
              </div>

              {tutorFeedback && (
                <div className={`p-5 rounded-2xl border transition-all animate-in zoom-in-95 duration-300 ${
                  wasCorrect 
                    ? 'bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5' 
                    : 'bg-amber-500/5 border-amber-500/20 shadow-lg shadow-amber-500/5'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {wasCorrect 
                      ? <CheckCircle size={16} className="text-blue-500" />
                      : <Info size={16} className="text-amber-400" />
                    }
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Skelly's Verdict</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {tutorFeedback}
                  </p>
                  {wasCorrect && currentLessonIndex < LESSONS.length - 1 && (
                    <button 
                      onClick={goToNextLesson}
                      className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                      Next Lesson <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Code/Output */}
          <section className="flex-1 flex flex-col bg-[#05070a] overflow-hidden">
            <div className="h-1/2 flex flex-col border-b border-gray-800">
              <div className="bg-gray-800/20 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">EDITOR_V1.sql</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleResetLesson}
                    title="Clear query"
                    className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-500 transition-colors"
                  >
                    <RefreshCcw size={16} />
                  </button>
                  <button 
                    onClick={handleRunQuery}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-blue-600/20"
                  >
                    {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                    Execute
                  </button>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full h-full bg-transparent p-8 font-mono text-blue-400 focus:outline-none resize-none spellcheck-false text-lg leading-relaxed selection:bg-blue-500/30"
                  spellCheck={false}
                  placeholder="-- Start writing your SQL..."
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-gray-800/20 px-6 py-3 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Execution_Log</span>
                {queryResult && !queryResult.error && queryResult.rows.length > 0 && (
                  <span className={`text-[9px] font-black uppercase tracking-widest ${wasCorrect ? 'text-blue-500' : 'text-amber-400'}`}>
                    {wasCorrect ? 'Result: Passed' : 'Result: Logical Error'} • {queryResult.rows.length} rows
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto p-6 bg-[#05070a]">
                {isExecuting ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                      <Loader2 size={32} className="animate-spin text-blue-500 relative" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Running Script...</p>
                  </div>
                ) : queryResult ? (
                  queryResult.error ? (
                    <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl max-w-2xl mx-auto mt-4">
                      <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-black text-[10px] text-red-500 uppercase tracking-widest mb-1">Runtime Exception</h4>
                        <p className="text-sm text-red-200/60 leading-relaxed italic">{queryResult.error}</p>
                      </div>
                    </div>
                  ) : queryResult.rows.length > 0 ? (
                    <div className="border border-gray-800 rounded-2xl overflow-hidden shadow-2xl bg-[#11141b]/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-800/40">
                            {queryResult.columns.map(col => (
                              <th key={col} className="p-4 text-[10px] font-black text-gray-500 border-b border-gray-800 uppercase tracking-widest">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {queryResult.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-500/5 transition-colors group">
                              {queryResult.columns.map(col => (
                                <td key={col} className="p-4 text-[13px] text-gray-300 font-mono group-hover:text-blue-300 transition-colors">
                                  {row[col] === null || row[col] === undefined ? <span className="text-gray-600 italic">null</span> : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-800 gap-4 opacity-50">
                      <Database size={48} className="text-gray-700" />
                      <p className="text-xs font-bold uppercase tracking-widest text-center px-12 leading-relaxed">Query returned 0 rows</p>
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-800 gap-4 opacity-20">
                    <Database size={64} />
                    <p className="text-xs font-bold uppercase tracking-widest">Awaiting Command</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Skelly Bot Chat */}
      <aside className="w-80 bg-[#11141b] border-l border-gray-800 flex flex-col hidden xl:flex">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-blue-500">Skelly Bot</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0a0c10]/50 custom-scrollbar">
          {chatMessages.length === 0 && (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-gray-800/50 rounded-[40px] flex items-center justify-center mx-auto border border-gray-800/50 shadow-2xl relative">
                <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                <Sparkles size={36} className="text-blue-500 relative" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tutoring Module</h4>
                <p className="text-[11px] text-gray-500 font-medium px-8 leading-relaxed">
                  "Confused? Ask about specific keywords like 'WHERE' or 'JOIN', or request a hint for the current task."
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center px-4">
                {['Need a hint', 'Explain WHERE', 'SQL syntax tips'].map(suggest => (
                  <button 
                    key={suggest}
                    onClick={() => { setUserInput(suggest); handleSendMessage(); }}
                    className="text-[10px] font-black bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl text-gray-500 uppercase tracking-widest transition-all"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div 
                className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-600/10' 
                    : 'bg-[#1a1f29] text-gray-300 rounded-bl-none border border-gray-800 shadow-xl'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-start gap-3">
              <div className="bg-[#1a1f29] p-4 rounded-2xl rounded-bl-none border border-gray-800">
                <Loader2 size={16} className="animate-spin text-blue-500" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-5 bg-[#11141b] border-t border-gray-800">
          <div className="relative group">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query Skelly..."
              className="w-full bg-[#0a0c10] border border-gray-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-600 transition-all shadow-inner"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isChatLoading || !userInput.trim()}
              className="absolute right-3 top-2.5 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 rounded-xl text-white transition-all transform active:scale-90 shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
