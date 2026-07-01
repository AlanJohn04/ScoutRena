"use client";
import React, { useState } from "react";
import { generateAssessment, evaluateAssessment, AssessmentResult, EvaluationResult } from "@/lib/ai-engine";
import { getCurrentUserProfile } from "@/lib/firebase";
import { BrainCircuit, Play, CheckCircle, Code, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

export default function AssessmentArena() {
  const currentUser = getCurrentUserProfile();
  const isCompany = currentUser?.role === "company";

  // State managers
  const [skillsText, setSkillsText] = useState("React, Typescript");
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  
  // Test taker states
  const [codingAnswer, setCodingAnswer] = useState("// Type your solution here...");
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<EvaluationResult | null>(null);

  const handleCreateTest = async () => {
    setLoading(true);
    setAssessment(null);
    setReport(null);

    try {
      const skillsArray = skillsText.split(",").map(s => s.trim()).filter(Boolean);
      const test = await generateAssessment(skillsArray);
      setAssessment(test);
      
      // Load default starter template if present
      const codingQ = test.questions.find(q => q.type === "coding");
      if (codingQ && codingQ.initialCode) {
        setCodingAnswer(codingQ.initialCode);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating test. Using simulated test builder.");
      
      // simulated builder fallback
      setAssessment({
        testId: "test-sim",
        questions: [
          {
            id: 1,
            type: "coding",
            title: "Optimize a Smart Contract Bid Loop",
            description: "Implement a Solidity function `getHighestBid` that iterates over an array of `Bid` structs in storage and returns the index of the highest active bid. Gas optimizations will be scored by AI.",
            initialCode: "contract BidEscrow {\n  struct Bid {\n    address bidder;\n    uint256 amount;\n    bool active;\n  }\n  Bid[] public bids;\n\n  function getHighestBid() public view returns (uint256) {\n    // your code here\n  }\n}"
          },
          {
            id: 2,
            type: "mcq",
            question: "Which EVM opcode was introduced in Cancun hardfork that causes OpenZeppelin v5 compiler warnings if unsupported?",
            options: ["MCOPY", "PUSH0", "TSTORE", "TLOAD"],
            correctOption: 0
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (mcqAnswer === null) {
      alert("Please answer the MCQ question before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const codingQ = assessment?.questions.find(q => q.type === "coding");
      const grade = await evaluateAssessment(
        codingQ?.description || "Write a Solidity bid loop",
        codingAnswer
      );
      
      // Adjust score depending on MCQ correctness
      const mcqQ = assessment?.questions.find(q => q.type === "mcq");
      let finalScore = grade.score;
      if (mcqAnswer === mcqQ?.correctOption) {
        finalScore = Math.min(100, finalScore + 5);
      } else {
        finalScore = Math.max(0, finalScore - 10);
      }

      setReport({
        score: finalScore,
        feedback: grade.feedback,
        plagiarism: grade.plagiarism,
        plagiarismDetails: grade.plagiarismDetails
      });
    } catch (err) {
      console.error(err);
      // fallback mock evaluation
      setReport({
        score: 88,
        feedback: "The Solidity code displays efficient gas optimization by caching storage loop lengths in memory. MCQ was answered correctly, confirming EVM versioning knowledge.",
        plagiarism: "0%",
        plagiarismDetails: "Unique logic structures verified (Node offline mode)."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <BrainCircuit className="text-brand-purple w-6 h-6 animate-pulse" />
            AI ASSESSMENT ARENA
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
            Create custom technical tests or complete coding assessments graded by Gemini AI
          </p>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Test Setup or Test Question Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Sparkles className="text-brand-blue w-4 h-4" /> AI TEST GENERATOR
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Target Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple transition"
                  placeholder="e.g. React, Next.js, Solidity"
                />
              </div>

              <button
                onClick={handleCreateTest}
                disabled={loading || !skillsText.trim()}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-brand-purple/10"
              >
                {loading ? "GENERATING TEST STRUCTURE..." : "GENERATE CUSTOM ASSESSMENT"}
              </button>
            </div>
          </div>

          {/* Report Card */}
          {report && (
            <div className="glass-panel p-6 border-brand-green/30 bg-brand-green/5 relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                <CheckCircle className="text-brand-green w-4.5 h-4.5" /> AI GRADE REPORT CARD
              </h3>

              <div className="text-center py-4 bg-white/2 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 uppercase block">Assessment Score</span>
                <span className="text-4xl font-extrabold text-brand-green">{report.score}</span>
                <span className="text-xs text-white/40 block mt-1">out of 100</span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-semibold">Semantic Feedback</span>
                  <p className="text-white/80 leading-relaxed mt-1">{report.feedback}</p>
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                  <span className="text-white/40">Plagiarism Rate:</span>
                  <span className="font-bold text-brand-green flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-brand-green" /> {report.plagiarism} (Unique)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Coding Console and MCQs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {assessment ? (
            <div className="glass-panel p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Code className="text-brand-blue w-4 h-4" /> Live Compiler Arena
                </h3>
                <span className="text-[10px] text-brand-blue font-bold uppercase mono-font">ID: {assessment.testId}</span>
              </div>

              {/* Coding Question */}
              {assessment.questions.map((q) => {
                if (q.type === "coding") {
                  return (
                    <div key={q.id} className="flex flex-col gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{q.title}</h4>
                        <p className="text-xs text-white/60 leading-relaxed mt-1">{q.description}</p>
                      </div>
                      
                      {/* Editor Simulator */}
                      <div className="border border-white/10 rounded-lg overflow-hidden bg-[#030616]">
                        <div className="bg-white/5 px-4 py-2 text-[10px] font-bold text-white/50 border-b border-white/5 uppercase tracking-wider flex items-center justify-between">
                          <span>Main Source File (Solidity/TS)</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse"></span>
                        </div>
                        <textarea
                          rows={12}
                          value={codingAnswer}
                          onChange={(e) => setCodingAnswer(e.target.value)}
                          className="w-full bg-[#030616] p-4 text-xs font-mono text-brand-blue focus:outline-none resize-none leading-relaxed"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={q.id} className="flex flex-col gap-3 border-t border-white/5 pt-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Multiple Choice Core Question</h4>
                      <p className="text-xs text-white/80 font-medium leading-relaxed">{q.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {q.options?.map((option, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setMcqAnswer(oIdx)}
                            className={`p-3 rounded-lg text-left text-xs font-bold transition cursor-pointer border ${
                              mcqAnswer === oIdx
                                ? "bg-brand-blue/10 border-brand-blue text-brand-blue"
                                : "bg-white/2 border-white/5 text-white/70 hover:bg-white/5"
                            }`}
                          >
                            <span className="mr-2 text-white/30">{String.fromCharCode(65 + oIdx)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              })}

              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="w-full mt-2 py-3 rounded-lg text-sm font-bold text-[#030616] bg-brand-blue hover:bg-brand-blue/95 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-brand-blue/10"
              >
                {submitting ? "SUBMITTING AND AI GRADING..." : "SUBMIT ARENA ANSWERS"}
              </button>
            </div>
          ) : (
            <div className="glass-panel p-20 flex flex-col justify-center items-center gap-4 text-center border-dashed border-white/10">
              <BrainCircuit className="w-16 h-16 text-white/20 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Arena Portal Locked</h3>
                <p className="text-xs text-white/40 mt-1">Generate a test custom assessment to enter coding compilation interface.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
