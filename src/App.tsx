import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart as PieChartIcon, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Plus,
  Minus,
  X,
  Menu,
  Home,
  Target,
  HelpCircle,
  Smartphone,
  Mic,
  RefreshCw,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import confetti from 'canvas-confetti';
import { useStore } from './store/useStore';
import { generateFinancialAdvice, analyzeFinancialHealth } from './services/gemini';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { cn } from './lib/utils';

// --- Components ---

const Splash = ({ onNext }: { onNext: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
      <div className="absolute top-10 left-10 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
    </div>

    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="mb-12 relative"
    >
      <div className="w-32 h-32 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 animate-float">
        <TrendingUp className="text-white w-16 h-16" />
      </div>
      <div className="absolute -inset-6 bg-orange-200/30 blur-2xl rounded-full animate-pulse" />
    </motion.div>
    
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="max-w-md z-10"
    >
      <h1 className="text-6xl font-black gradient-text mb-4 leading-tight tracking-tighter">FinAid Buddy</h1>
      <p className="text-slate-400 font-black mb-8 tracking-[0.2em] uppercase text-xs">India's #1 Financial Guide 🇮🇳</p>
      <h2 className="text-2xl font-bold mb-8 text-slate-800 leading-snug">Empowering students and families to build a secure future.</h2>
      
      <div className="space-y-4">
        <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-3 group text-lg">
          Start My Journey <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-slate-400 text-sm font-medium italic">"Bachat hi pragati ki seedhi hai" — Saving is the ladder to progress.</p>
      </div>
    </motion.div>

    <div className="absolute bottom-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
      Trusted by 10,000+ Families
    </div>
  </div>
);

const Questionnaire = ({ onFinish }: { onFinish: () => void }) => {
  const { userData, setUserData } = useStore();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const totalSteps = 5;

  const nextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeFinancialHealth(userData);
        setUserData({ 
          healthScore: analysis.score, 
          personalizedTips: analysis.tips,
          socialMotto: analysis.motto,
          onboarded: true
        });
        onFinish();
      } catch (e) {
        console.error(e);
        setUserData({ onboarded: true });
        onFinish();
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const updateExpense = (category: string, amount: number) => {
    const newExpenses = (userData.expenses || []).map(e => 
      e.category === category ? { ...e, amount } : e
    );
    setUserData({ expenses: newExpenses });
  };

  const totalExpenses = (userData.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
  const isOverspending = totalExpenses > (userData.monthlyIncome || 0) && (userData.monthlyIncome || 0) > 0;

  return (
    <div className="min-h-screen bg-white p-6 pb-32">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={prevStep} className={cn("p-2 rounded-full hover:bg-slate-100 transition-colors", step === 1 && "invisible")}>
            <ArrowLeft size={24} className="text-slate-400" />
          </button>
          <div className="flex gap-1.5">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-2 w-10 rounded-full transition-all duration-500",
                  i + 1 <= step ? "bg-orange-500 shadow-lg shadow-orange-100" : "bg-slate-100"
                )} 
              />
            ))}
          </div>
          <div className="text-xs font-black text-slate-300 tracking-tighter">{step}/{totalSteps}</div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
                <TrendingUp className="absolute inset-0 m-auto text-orange-500 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-3 gradient-text">Analyzing Your Finances...</h2>
              <p className="text-slate-500 font-medium">Our AI is crafting your personalized roadmap to freedom 🇮🇳</p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">Tell us about yourself 👩🎓💼</h2>
                    <p className="text-slate-400 font-medium">This helps us tailor the advice for you.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {['Student/Non-Working', 'Working'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setUserData({ incomeType: type as any })}
                        className={cn(
                          "p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group",
                          userData.incomeType === type 
                            ? "border-orange-500 bg-orange-50 shadow-xl shadow-orange-100" 
                            : "border-slate-100 hover:border-orange-200 hover:bg-slate-50"
                        )}
                      >
                        <div className="font-black text-xl mb-1">{type}</div>
                        <div className="text-sm text-slate-500 font-medium">
                          {type === 'Working' ? 'Daily wage, salary, or small business' : 'College student or looking for work'}
                        </div>
                        {userData.incomeType === type && (
                          <CheckCircle2 className="absolute top-6 right-6 text-orange-500" size={24} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">Monthly Income? 💰</h2>
                    <p className="text-slate-400 font-medium">How much do you earn or have for the month?</p>
                  </div>
                  <div className="p-10 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-[3rem] text-center border border-orange-100 shadow-inner">
                    <div className="text-5xl font-black text-orange-600 mb-6 tracking-tighter">₹{(userData.monthlyIncome || 0).toLocaleString()}</div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100000" 
                      step="500"
                      value={userData.monthlyIncome || 0}
                      onChange={(e) => setUserData({ monthlyIncome: parseInt(e.target.value) })}
                      className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">
                      <span>₹0</span>
                      <span>₹1,00,000+</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[5000, 10000, 25000, 50000].map(val => (
                      <button 
                        key={val}
                        onClick={() => setUserData({ monthlyIncome: val })}
                        className="py-4 rounded-2xl border border-slate-200 hover:bg-orange-50 hover:border-orange-200 font-black text-slate-700 transition-all"
                      >
                        ₹{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">Where does it go? 💸</h2>
                    <p className="text-slate-400 font-medium">Drag the sliders or type your monthly spends.</p>
                  </div>
                  
                  {isOverspending && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-4 text-red-600 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle size={24} />
                      </div>
                      <div className="text-sm font-black leading-tight">Over-spending Alert! <br/><span className="text-xs opacity-70">You are spending ₹{totalExpenses - (userData.monthlyIncome || 0)} extra.</span></div>
                    </motion.div>
                  )}

                  <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                    {(userData.expenses || []).map((expense) => (
                      <div key={expense.category} className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                            {expense.category.split(' ').pop()}
                          </div>
                          <div className="font-black text-slate-700">{expense.category.split(' ')[0]}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateExpense(expense.category, Math.max(0, expense.amount - 500))}
                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-20 text-center font-black text-slate-800 tabular-nums">₹{expense.amount}</div>
                          <button 
                            onClick={() => updateExpense(expense.category, expense.amount + 500)}
                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">Biggest Worry? 🤔</h2>
                    <p className="text-slate-400 font-medium">What keeps you up at night regarding money?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Rent hike? 🏠', 'Medical emergency? 🏥', 'Education fees? 📚', 'Debt/Loans? 💳', 'Family support? 👨👩👧'].map((worry) => (
                      <button
                        key={worry}
                        onClick={() => setUserData({ biggestWorry: worry })}
                        className={cn(
                          "p-5 rounded-2xl border-2 text-left transition-all font-black text-slate-700",
                          userData.biggestWorry === worry 
                            ? "border-orange-500 bg-orange-50 shadow-lg shadow-orange-100" 
                            : "border-slate-100 hover:border-orange-200"
                        )}
                      >
                        {worry}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Or tell us in your own words..."
                    className="w-full p-6 rounded-[2rem] border border-slate-200 h-40 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-medium text-slate-700 bg-slate-50"
                    value={userData.biggestWorry}
                    onChange={(e) => setUserData({ biggestWorry: e.target.value })}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">Your Goals? 🎯</h2>
                    <p className="text-slate-400 font-medium">What are we saving for?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['Emergency Fund', 'New Phone', 'Family Help', 'Wedding', 'Education', 'Business'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          const newGoals = (userData.goals || []).includes(goal)
                            ? userData.goals.filter(g => g !== goal)
                            : [...(userData.goals || []), goal];
                          setUserData({ goals: newGoals });
                        }}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 text-center transition-all font-black text-slate-700",
                          (userData.goals || []).includes(goal) 
                            ? "border-orange-500 bg-orange-50 shadow-lg shadow-orange-100" 
                            : "border-slate-100 hover:border-orange-200"
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  <div className="pt-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex justify-between mb-4">
                      <span className="font-black text-slate-500 uppercase text-xs tracking-widest">Timeline</span>
                      <span className="text-orange-600 font-black">{userData.timeline} Months</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="24" 
                      value={userData.timeline}
                      onChange={(e) => setUserData({ timeline: parseInt(e.target.value) })}
                      className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnalyzing && (
          <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
            <button 
              onClick={nextStep} 
              className="btn-primary w-full max-w-md mx-auto flex items-center justify-center gap-3 text-lg"
            >
              {step === totalSteps ? 'See My Plan ✨' : 'Next Step'} <ArrowRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userData, resetData } = useStore();
  const [activeTab, setActiveTab] = useState('insights');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff9933', '#ffffff', '#138808'],
          zIndex: 9999
        });
      } catch (e) {
        console.error("Confetti error:", e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const totalExpenses = (userData.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
  const surplus = (userData.monthlyIncome || 0) - totalExpenses;
  const saveRate = (userData.monthlyIncome || 0) > 0 ? (surplus / userData.monthlyIncome) * 100 : 0;

  const chartData = (userData.expenses || []).filter(e => e.amount > 0).map(e => ({
    name: e.category.split(' ')[0],
    value: e.amount
  }));

  const COLORS = ['#ff9933', '#ffcc00', '#138808', '#000080', '#ff6666', '#9933ff', '#33ccff', '#666666'];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const stream = await generateFinancialAdvice(userData, userMsg, history);
      
      let fullText = '';
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        fullText += chunk.text;
        setChatMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, text: fullText }];
        });
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having a bit of trouble right now. Please try again later! 🙏" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(255, 153, 51);
    doc.text("FinAid Buddy - Financial Plan", 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    doc.setDrawColor(255, 153, 51);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, 55);
    doc.setFontSize(12);
    doc.text(`Monthly Income: ₹${(userData.monthlyIncome || 0).toLocaleString()}`, 25, 65);
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 25, 75);
    doc.text(`Monthly Surplus: ₹${surplus.toLocaleString()}`, 25, 85);
    doc.text(`Health Score: ${userData.healthScore || 0}/100`, 25, 95);

    doc.setFontSize(16);
    doc.text("Personalized Advice", 20, 115);
    doc.setFontSize(10);
    (userData.personalizedTips || []).forEach((tip, i) => {
      doc.text(`• ${tip}`, 25, 125 + (i * 8));
    });

    doc.setFontSize(16);
    doc.text("Expense Breakdown", 20, 170);
    doc.setFontSize(12);
    (userData.expenses || []).forEach((e, i) => {
      doc.text(`${e.category}: ₹${e.amount.toLocaleString()}`, 25, 180 + (i * 10));
    });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`"${userData.socialMotto}"`, 105, 280, { align: 'center' });

    doc.save("FinAid_Buddy_Plan.pdf");
  };

  const startVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white p-8 pb-16 rounded-b-[4rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100/20 rounded-full -ml-32 -mt-32 blur-3xl" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-black gradient-text tracking-tighter">Namaste, Buddy! 🙏</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Your Financial Health</p>
          </div>
          <button 
            onClick={() => resetData()}
            className="p-3 bg-red-50 rounded-2xl text-red-500 shadow-sm hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Restart</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-[2.5rem] text-white shadow-2xl shadow-orange-200 flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] opacity-80 mb-1 font-black uppercase tracking-[0.2em]">Monthly Surplus</div>
              <div className="text-4xl font-black tracking-tighter">₹{surplus.toLocaleString()}</div>
            </div>
            <div className="text-[10px] mt-4 flex items-center gap-1.5 font-black bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
              <TrendingUp size={12} /> {saveRate.toFixed(0)}% Save Rate
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-[0.2em]">Health Score</div>
              <div className="flex items-end gap-1">
                <div className="text-4xl font-black text-slate-800 tracking-tighter">{userData.healthScore || 0}</div>
                <div className="text-xs text-slate-300 mb-1.5 font-bold">/100</div>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${userData.healthScore || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 -mt-10 space-y-8 relative z-10">
        {/* Social Motto Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-5 rounded-[2rem] text-white shadow-2xl flex items-center gap-5 border border-slate-800"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
            <Award size={24} className="text-white" />
          </div>
          <p className="text-sm font-bold italic leading-relaxed">"{userData.socialMotto || 'Financial freedom for every Indian family.'}"</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          {['insights', 'goals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="font-black mb-6 flex items-center gap-3 text-slate-800 uppercase text-xs tracking-[0.2em]">
                  <PieChartIcon size={20} className="text-orange-500" /> Spending Analysis
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                        itemStyle={{ fontWeight: '900', color: '#1e293b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{entry.name}</span>
                        <span className="text-sm font-black text-slate-800 tracking-tighter">₹{entry.value.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="font-black mb-6 flex items-center gap-3 text-slate-800 uppercase text-xs tracking-[0.2em]">
                  <TrendingUp size={20} className="text-orange-500" /> AI Personalized Tips
                </h3>
                <div className="space-y-4">
                  {(userData.personalizedTips?.length > 0 ? userData.personalizedTips : [
                    "Track every rupee spent this week.",
                    "Set aside ₹500 for emergencies.",
                    "Look for local government schemes.",
                    "Avoid unnecessary subscriptions."
                  ]).map((tip, i) => (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex items-start gap-4 p-5 bg-orange-50/50 rounded-3xl border border-orange-100/50 group hover:bg-orange-50 transition-all"
                    >
                      <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={18} className="text-white" />
                      </div>
                      <span className="text-sm font-black text-slate-700 leading-relaxed">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {(userData.goals || []).map((goal, i) => (
                <div key={goal} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Target size={32} />
                    </div>
                    <div>
                      <div className="font-black text-xl text-slate-800">{goal}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Target: {userData.timeline} Months</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-orange-600 tracking-tighter">₹{(surplus * userData.timeline).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Projected Savings</div>
                  </div>
                </div>
              ))}
              {(userData.goals || []).length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <Target size={64} className="mx-auto mb-6 text-slate-200" />
                  <p className="text-slate-400 font-bold">No goals set yet. Let's add some!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chat Toggle */}
      <button 
        onClick={() => setShowChat(true)}
        className="fixed bottom-28 right-8 w-20 h-20 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40 hover:scale-110 transition-transform active:scale-95 group"
      >
        <MessageCircle size={36} />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black">1</div>
        <div className="absolute -inset-2 bg-orange-400/20 blur-xl rounded-full group-hover:bg-orange-400/40 transition-all" />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-200">FB</div>
                <div>
                  <div className="font-black text-slate-800">FinAid Buddy AI</div>
                  <div className="text-[10px] text-green-600 font-black flex items-center gap-1.5 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                <X size={28} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
              {chatMessages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-inner">
                    <MessageCircle size={48} />
                  </div>
                  <h3 className="font-black text-2xl mb-3 text-slate-800 tracking-tighter">Ask me anything, Buddy!</h3>
                  <p className="text-slate-400 font-medium px-12 leading-relaxed">"How can I save ₹500 more?" or "Tell me about PMJDY scheme."</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={i} 
                  className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-gradient-to-tr from-orange-600 to-orange-500 text-white rounded-tr-none shadow-orange-100" 
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  )}>
                    <div className="prose prose-sm prose-slate max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1.5 shadow-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex gap-3 pb-10">
              <button 
                onClick={startVoiceInput}
                className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-orange-50 hover:text-orange-500 transition-all active:scale-95"
              >
                <Mic size={24} />
              </button>
              <input 
                type="text" 
                placeholder="Type your question..."
                className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-slate-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-30">
        <button onClick={() => setActiveTab('insights')} className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'insights' ? "text-orange-500 scale-110" : "text-slate-300 hover:text-slate-400")}>
          <Home size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setActiveTab('goals')} className={cn("flex flex-col items-center gap-1.5 transition-all", activeTab === 'goals' ? "text-orange-500 scale-110" : "text-slate-300 hover:text-slate-400")}>
          <Target size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest">Goals</span>
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { userData } = useStore();
  const [view, setView] = useState<'splash' | 'questionnaire' | 'dashboard'>('splash');

  // Sync view with onboarded state
  useEffect(() => {
    if (userData.onboarded) {
      setView('dashboard');
    } else {
      setView('splash');
    }
  }, [userData.onboarded]);

  const nextView = () => {
    if (view === 'splash') setView('questionnaire');
    else if (view === 'questionnaire') setView('dashboard');
  };

  const prevView = () => {
    if (view === 'dashboard') setView('questionnaire');
    else if (view === 'questionnaire') setView('splash');
  };

  return (
    <div className="font-sans relative">
      {/* Global Navigation Arrows */}
      <div className="fixed top-6 left-6 right-6 flex justify-between z-[60] pointer-events-none">
        {view !== 'splash' && (
          <button 
            onClick={prevView} 
            className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl pointer-events-auto text-slate-800 hover:bg-white transition-all active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        {view !== 'dashboard' && (
          <button 
            onClick={nextView} 
            className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl pointer-events-auto text-slate-800 hover:bg-white transition-all active:scale-90 ml-auto"
          >
            <ArrowRight size={24} />
          </button>
        )}
      </div>

      {view === 'splash' && <Splash onNext={() => setView('questionnaire')} />}
      {view === 'questionnaire' && (
        <Questionnaire onFinish={() => setView('dashboard')} />
      )}
      {view === 'dashboard' && <Dashboard />}
    </div>
  );
}
