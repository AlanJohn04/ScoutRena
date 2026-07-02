import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Create helper to return a simulated response if API key is not configured
const getMockResponse = (action: string, data: any) => {
  if (action === "parseResume") {
    return {
      cpi: {
        problemSolving: 82,
        engineering: 88,
        learningAgility: 80,
        innovation: 80,
        collaboration: 85,
        delivery: 75,
        domainExpertise: 60,
      },
      skills: ["React", "TypeScript", "Node.js", "Docker", "MongoDB", "Solidity"],
      ambitionScore: 84,
      potentialScore: 89,
      feedback: "Strong candidate with solid foundations in frontend and web3. Adding Cloud Native tools like Kubernetes would boost value by another 15%."
    };
  } else if (action === "generateAssessment") {
    return {
      testId: "test-" + Math.random().toString(36).substring(2, 9),
      questions: [
        {
          id: 1,
          type: "coding",
          title: "Implement a Redux-like State Store",
          description: "Write a simple createStore function in TypeScript that manages state. It should take a reducer and return an object with getState, dispatch, and subscribe methods.",
          initialCode: "function createStore(reducer) {\n  // your code here\n}"
        },
        {
          id: 2,
          type: "mcq",
          question: "Which of the following is true about Soulbound Tokens (SBTs)?",
          options: [
            "They can be traded on secondary markets",
            "They are non-transferable ERC-721 tokens",
            "They are used only as governance tokens",
            "They have no token ID"
          ],
          correctOption: 1
        }
      ]
    };
  } else if (action === "generateInsight") {
    const studentName = data.name || "Candidate";
    const skillsList = data.skills ? data.skills.join(", ") : "your skills";
    return {
      insight: `Hey ${studentName}! Your market valuation is showing a strong upward trend because your projects in ${skillsList} perfectly match current hiring demand in AI and smart contract development. Adding AWS or Docker will likely increase your valuation by 18% based on the ScoutRena Demand Index.`
    };
  } else if (action === "evaluateAssessment") {
    return {
      score: 87,
      feedback: "Great code organization and understanding of closure. Could optimize state subscription cleaning mechanism.",
      plagiarism: "0%",
      plagiarismDetails: "Unique implementation verified by ScoutRena Code Guard."
    };
  }
  return {};
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Using mock data.");
      return NextResponse.json({ success: true, isMock: true, data: getMockResponse(action, data) });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    let prompt = "";
    if (action === "parseResume") {
      prompt = `
        Analyze the following candidate resume text:
        "${data.resumeText}"
        
        Generate a Candidate Potential Index (CPI) score (out of 100) along with scores (0-100) for these 7 categories:
        1. Problem Solving (Analytical Thinking) (weight 20)
        2. Engineering (Code Quality/Architecture) (weight 20)
        3. Learning Agility (weight 15)
        4. Innovation (Product Sense) (weight 10)
        5. Collaboration (Teamwork) (weight 15)
        6. Delivery (Execution Speed) (weight 10)
        7. Domain Expertise (weight 10)
        
        Also extract key technical skills.
        Provide a concise AI feedback advice for the candidate.
        
        Return ONLY a raw JSON object matching this schema:
        {
          "cpi": {
            "problemSolving": number,
            "engineering": number,
            "learningAgility": number,
            "innovation": number,
            "collaboration": number,
            "delivery": number,
            "domainExpertise": number
          },
          "skills": string[],
          "ambitionScore": number,
          "potentialScore": number,
          "feedback": string
        }
      `;
    } else if (action === "generateAssessment") {
      prompt = `
        Generate a technical interview assessment for the following skills: "${data.skills.join(", ")}".
        The assessment should contain exactly 1 Coding challenge and 1 Multiple Choice Question.
        
        Return ONLY a raw JSON object matching this schema:
        {
          "testId": string,
          "questions": [
            {
              "id": 1,
              "type": "coding",
              "title": string,
              "description": string,
              "initialCode": string
            },
            {
              "id": 2,
              "type": "mcq",
              "question": string,
              "options": string[],
              "correctOption": number
            }
          ]
        }
      `;
    } else if (action === "generateInsight") {
      prompt = `
        Generate a personalized, Blue Lock inspired talent market insight for a student named "${data.name}" who has these skills: "${data.skills.join(", ")}" and a current CPI score of ${data.cpi}.
        Tell them why their market value increased or how they can increase it further (e.g. by learning Docker or Kubernetes). Keep it motivational, dynamic, and focused on hiring market data.
        
        Return ONLY a raw JSON object matching this schema:
        {
          "insight": string
        }
      `;
    } else if (action === "evaluateAssessment") {
      prompt = `
        Evaluate this candidate's test submission.
        Question: "${data.question}"
        User Code Submission: "${data.submission}"
        
        Provide a score out of 100, detailed feedback, and plagiarism estimation.
        
        Return ONLY a raw JSON object matching this schema:
        {
          "score": number,
          "feedback": string,
          "plagiarism": string,
          "plagiarismDetails": string
        }
      `;
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await model.generateContent(prompt);
    const text = response.response.text() || "";
    const parsedData = JSON.parse(text);

    return NextResponse.json({ success: true, isMock: false, data: parsedData });
  } catch (error: any) {
    console.error("AI API route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
