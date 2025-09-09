import fetch from "node-fetch";

const API_BASE = "http://localhost:3001";

async function testAIServer() {
  console.log("🧪 Testing AI Explanation Server...\n");

  // Test 1: Health check
  try {
    console.log("1. Testing health check...");
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
  }

  // Test 2: AI Explanation with your format
  try {
    console.log("\n2. Testing AI explanation with your format...");
    const testMetrics = {
      capRate: 0.06,
      cashOnCash: 0.08,
      noi: 120000,
      dscr: 1.25,
      terminalValue: 850000
    };

    const response = await fetch(`${API_BASE}/api/explain-roi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testMetrics),
    });

    const data = await response.json();
    console.log("✅ AI Explanation Response:");
    console.log("Status:", response.status);
    console.log("Explanation:", data.explanation);
    console.log("Timestamp:", data.timestamp);
  } catch (error) {
    console.log("❌ AI explanation test failed:", error.message);
  }

  // Test 3: AI Explanation with existing format
  try {
    console.log("\n3. Testing AI explanation with existing format...");
    const testMetrics = {
      cap_rate: 0.06,
      cash_on_cash: 0.08,
      noi: 120000,
      dscr: 1.25,
      npv: 45000,
      irr: 0.12,
      terminal_value: 850000
    };

    const response = await fetch(`${API_BASE}/api/explain-roi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testMetrics),
    });

    const data = await response.json();
    console.log("✅ AI Explanation Response (existing format):");
    console.log("Status:", response.status);
    console.log("Explanation:", data.explanation);
  } catch (error) {
    console.log("❌ AI explanation test (existing format) failed:", error.message);
  }

  // Test 4: Error handling
  try {
    console.log("\n4. Testing error handling...");
    const invalidMetrics = {
      capRate: 0.06,
      // Missing required fields
    };

    const response = await fetch(`${API_BASE}/api/explain-roi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidMetrics),
    });

    const data = await response.json();
    console.log("✅ Error handling test:");
    console.log("Status:", response.status);
    console.log("Error:", data.error);
  } catch (error) {
    console.log("❌ Error handling test failed:", error.message);
  }

  console.log("\n🎉 Testing complete!");
}

// Run tests
testAIServer().catch(console.error);
