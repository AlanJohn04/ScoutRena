export interface CPIIndex {
  problemSolving: number;
  engineering: number;
  learningAgility: number;
  innovation: number;
  collaboration: number;
  delivery: number;
  domainExpertise: number;
}

export interface ParsedResumeResult {
  cpi: CPIIndex;
  skills: string[];
  ambitionScore: number;
  potentialScore: number;
  feedback: string;
}

export interface AssessmentQuestion {
  id: number;
  type: "coding" | "mcq";
  title?: string;
  description?: string;
  initialCode?: string;
  question?: string;
  options?: string[];
  correctOption?: number;
}

export interface AssessmentResult {
  testId: string;
  questions: AssessmentQuestion[];
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  plagiarism: string;
  plagiarismDetails: string;
}

async function callAiApi(action: string, data: any) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, data }),
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to complete AI request");
    }
    return result.data;
  } catch (error) {
    console.error(`Error in AI action ${action}:`, error);
    throw error;
  }
}

export async function parseResume(resumeText: string): Promise<ParsedResumeResult> {
  return await callAiApi("parseResume", { resumeText });
}

export async function generateAssessment(skills: string[]): Promise<AssessmentResult> {
  return await callAiApi("generateAssessment", { skills });
}

export async function generateInsight(name: string, skills: string[], cpi: number): Promise<{ insight: string }> {
  return await callAiApi("generateInsight", { name, skills, cpi });
}

export async function evaluateAssessment(question: string, submission: string): Promise<EvaluationResult> {
  return await callAiApi("evaluateAssessment", { question, submission });
}
