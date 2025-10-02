export const analyzeTasksWithAI = async (tasks, userName) => {
  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return getMockAnalysis(tasks, userName);
    }

    const prompt = `Analyze these tasks for ${userName} and provide productivity insights:

Tasks:
${tasks.map(t => `- ${t.title} (${t.status}): ${t.description}`).join("\n")}

Provide:
1. Overview with counts
2. Recommendations
3. Priority suggestions
4. Productivity tips`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      getMockAnalysis(tasks, userName)
    );
  } catch (error) {
    console.error("Gemini Analysis error:", error);
    return getMockAnalysis(tasks, userName);
  }
};

const getMockAnalysis = (tasks, userName) => {
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  return `📊 AI Task Analysis for ${userName}:

🎯 Overview: You have ${tasks.length} tasks total
   • ${pending} pending
   • ${inProgress} in progress
   • ${completed} completed

💡 Recommendations:
${pending > 5
    ? "⚠️ You have many pending tasks. Consider prioritizing the top 3 most important ones."
    : "✅ Your pending tasks are manageable."}

${inProgress > 3
    ? "⚠️ Too many tasks in progress. Focus on completing 1-2 before starting new ones."
    : "✅ Good focus on current tasks."}

🔥 Suggested Focus: ${tasks[0]?.title || "Add your first task to get started!"}

💪 Productivity Tip: Break large tasks into smaller subtasks for better progress tracking.

📈 Completion Rate: ${
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
  }%`;
};
