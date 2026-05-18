const axios = require('axios');

const buildEmployeePrompt = (employees) => {
  const employeeList = employees.map((employee, index) => {
    const skills = Array.isArray(employee.skills) && employee.skills.length
      ? employee.skills.join(', ')
      : 'No skills listed';

    return `${index + 1}. Name: ${employee.name}, Department: ${employee.department}, Skills: ${skills}, Performance Score: ${employee.performanceScore}/100, Experience: ${employee.experience} years`;
  }).join('\n');

  return `You are an expert HR consultant AI. Analyze the following employees and provide:
1. Promotion Recommendation: who should be promoted and why.
2. Employee Ranking: rank them 1 to N based on performance score, experience, and skills.
3. Training Suggestions: what skills each employee should develop.
4. AI Feedback: personalized feedback for each employee.

Employee Data:
${employeeList}

Use clear headings and a professional tone.`;
};

const getRecommendation = async (req, res, next) => {
  try {
    const { employees } = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'Employee data is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'OpenRouter API key is not configured' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct-v0.3',
        messages: [{ role: 'user', content: buildEmployeePrompt(employees) }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'Employee Analytics AI',
        },
        timeout: 30000,
      }
    );

    const recommendation = response.data?.choices?.[0]?.message?.content;

    if (!recommendation) {
      return res.status(502).json({ message: 'AI provider returned an empty response' });
    }

    res.json({ recommendation });
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message || error.response?.data?.message;
    if (providerMessage) {
      return res.status(error.response?.status || 502).json({ message: providerMessage });
    }
    next(error);
  }
};

module.exports = { getRecommendation };
