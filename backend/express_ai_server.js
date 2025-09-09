import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post("/api/explain-roi", async (req, res) => {
  try {
    // Support both naming conventions for flexibility
    const { 
      cap_rate, capRate,
      cash_on_cash, cashOnCash,
      noi, 
      dscr, 
      npv, 
      irr, 
      terminal_value, terminalValue 
    } = req.body;

    // Use the provided values or fallback to alternative naming
    const capRateValue = cap_rate ?? capRate;
    const cashOnCashValue = cash_on_cash ?? cashOnCash;
    const terminalValueValue = terminal_value ?? terminalValue;

    // Validate required fields
    if (capRateValue === undefined || cashOnCashValue === undefined || noi === undefined || dscr === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: cap_rate, cash_on_cash, noi, dscr' 
      });
    }

    const prompt = `
    Write a professional real estate investment analysis explanation.
    Format with subtitles:
    - Cap Rate
    - Cash-on-Cash Return
    - DSCR
    - NOI
    - Terminal Value
    - Overall Assessment

    Data:
    Cap Rate: ${(capRateValue * 100).toFixed(2)}%
    Cash-on-Cash: ${(cashOnCashValue * 100).toFixed(2)}%
    NOI: ₦${noi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    DSCR: ${dscr.toFixed(2)}
    ${npv ? `NPV: ₦${npv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
    ${irr ? `IRR: ${(irr * 100).toFixed(2)}%` : ''}
    ${terminalValueValue ? `Terminal Value: ₦${terminalValueValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
    `;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a professional real estate investment advisor with expertise in ROI analysis. Provide clear, actionable insights." 
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    res.json({ 
      explanation: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    
    // Provide fallback explanation with available data
    const fallbackData = req.body;
    const capRate = fallbackData.cap_rate ?? fallbackData.capRate;
    const cashOnCash = fallbackData.cash_on_cash ?? fallbackData.cashOnCash;
    const dscr = fallbackData.dscr;
    
    res.status(500).json({ 
      error: 'Failed to generate AI explanation',
      fallback: true,
      explanation: `Investment Analysis:
• Cap Rate: ${capRate ? (capRate * 100).toFixed(2) + '%' : 'N/A'} - ${capRate > 0.05 ? 'Above average' : 'Below average'}
• Cash-on-Cash: ${cashOnCash ? (cashOnCash * 100).toFixed(2) + '%' : 'N/A'} - ${cashOnCash > 0.08 ? 'Strong returns' : 'Needs improvement'}
• DSCR: ${dscr ? dscr.toFixed(2) : 'N/A'} - ${dscr > 1.2 ? 'Healthy debt coverage' : 'Weak debt coverage'}

Recommendation: ${cashOnCash > 0.08 && dscr > 1.2 ? 'Consider this investment' : 'Review terms or consider alternatives'}`
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    service: "AI Explanation Service",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "AI Explanation Service", 
    endpoints: ["/api/explain-roi", "/health"],
    version: "1.0.0"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Express AI server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Explanation: http://localhost:${PORT}/api/explain-roi`);
});
