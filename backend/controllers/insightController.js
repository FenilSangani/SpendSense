const Transaction = require("../models/Transaction");

const generateInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          insights:
            "You haven't added any transactions yet! Start by adding your income and expenses to get personalized financial insights.",
          mode: "no-data",
        },
      });
    }

    const summary = calculateSpendingSummary(transactions);
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey && openaiApiKey.trim() !== "") {
      const insights = await getOpenAIInsights(summary, openaiApiKey);
      return res.status(200).json({
        success: true,
        data: {
          insights,
          mode: "ai",
          summary,
        },
      });
    } else {
      const insights = generateMockInsights(summary);
      return res.status(200).json({
        success: true,
        data: {
          insights,
          mode: "mock",
          summary,
        },
      });
    }
  } catch (error) {
    console.error("Generate insights error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error generating insights",
    });
  }
};

function calculateSpendingSummary(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};
  const categories = [];

  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];

    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;

      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] = t.amount;
        categories.push(t.category);
      }
    }
  }

  let topCategory = "";
  let topCategoryAmount = 0;

  for (let i = 0; i < categories.length; i++) {
    if (categoryTotals[categories[i]] > topCategoryAmount) {
      topCategory = categories[i];
      topCategoryAmount = categoryTotals[categories[i]];
    }
  }

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    savingsRate,
    categoryTotals,
    categories,
    topCategory,
    topCategoryAmount,
    transactionCount: transactions.length,
  };
}

async function getOpenAIInsights(summary, apiKey) {
  const OpenAI = require("openai");
  const openai = new OpenAI({ apiKey });

  const prompt = `You are a helpful financial advisor. Analyze this spending data and provide 3-5 practical, personalized tips:

Total Income: ₹${summary.totalIncome}
Total Expenses: ₹${summary.totalExpense}
Balance: ₹${summary.balance}
Savings Rate: ${summary.savingsRate}%
Top Spending Category: ${summary.topCategory} (₹${summary.topCategoryAmount})
All Categories: ${JSON.stringify(summary.categoryTotals)}
Total Transactions: ${summary.transactionCount}

Please provide clear, actionable financial advice. Be specific about the categories and amounts. Keep it friendly and encouraging.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are SpendSense AI, a friendly financial advisor that gives practical money-saving tips.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

function generateMockInsights(summary) {
  const tips = [];

  if (summary.savingsRate >= 20) {
    tips.push(
      `Great job! You're saving ${summary.savingsRate}% of your income. Financial experts recommend saving at least 20%, and you're right on track. Keep up the excellent work!`
    );
  } else if (summary.savingsRate >= 10) {
    tips.push(
      `You're currently saving ${summary.savingsRate}% of your income. That's a good start! Try to gradually increase this to 20% by cutting small daily expenses. Even saving an extra ₹100/day adds up to ₹3,000/month.`
    );
  } else if (summary.savingsRate > 0) {
    tips.push(
      `Your savings rate is ${summary.savingsRate}%, which is below the recommended 20%. Consider setting up an automatic transfer to a savings account right after payday — even a small amount helps build the habit.`
    );
  } else {
    tips.push(
      `You're currently spending more than you earn. This is a red flag. Review your expenses below and identify at least 2-3 areas where you can cut back immediately. Building an emergency fund should be your top priority.`
    );
  }

  if (summary.topCategory) {
    const percentage =
      summary.totalExpense > 0
        ? Math.round(
            (summary.topCategoryAmount / summary.totalExpense) * 100
          )
        : 0;

    const categoryAdvice = getCategoryAdvice(summary.topCategory);

    tips.push(
      `Your biggest expense category is "${summary.topCategory}" at ₹${summary.topCategoryAmount.toLocaleString('en-IN')} (${percentage}% of total spending). ${categoryAdvice}`
    );
  }

  if (summary.balance > 0) {
    tips.push(
      `You have a positive balance of ₹${summary.balance.toLocaleString('en-IN')}. Consider investing a portion of this surplus. A good rule of thumb is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and investments.`
    );
  } else if (summary.balance < 0) {
    tips.push(
      `You're currently in a deficit of ₹${Math.abs(summary.balance).toLocaleString('en-IN')}. Focus on reducing discretionary spending first — things like dining out, subscriptions, and entertainment. Track every expense for the next week to find hidden spending leaks.`
    );
  }

  if (summary.categories.length > 5) {
    tips.push(
      `You're spending across ${summary.categories.length} different categories. Consolidated tracking can help you stay in control. Consider setting a monthly limit for each category.`
    );
  }

  tips.push(
    `Pro tip: Review your transactions every Sunday evening. Regular check-ins help maintain budget compliance and identify saving opportunities.`
  );

  return tips.join("\n\n");
}

function getCategoryAdvice(category) {
  const cat = category.toLowerCase();

  if (cat.includes("food") || cat.includes("dining") || cat.includes("restaurant") || cat.includes("grocery")) {
    return "Try meal prepping on weekends — it can cut food costs by 30-40%. Also, making a grocery list before shopping helps avoid impulse buys.";
  }

  if (cat.includes("transport") || cat.includes("travel") || cat.includes("uber") || cat.includes("gas") || cat.includes("fuel")) {
    return "Consider carpooling, using public transit, or biking for short trips. If you drive, apps like GasBuddy can help find cheaper fuel nearby.";
  }

  if (cat.includes("entertainment") || cat.includes("fun") || cat.includes("movie") || cat.includes("game")) {
    return "Look for free or low-cost entertainment options like parks, libraries, or free community events. Review subscriptions you rarely use and cancel them.";
  }

  if (cat.includes("shopping") || cat.includes("clothes") || cat.includes("fashion")) {
    return "Try the 48-hour rule: wait 48 hours before any non-essential purchase over ₹1,000. This simple habit eliminates a lot of impulse buying.";
  }

  if (cat.includes("bill") || cat.includes("utility") || cat.includes("electric") || cat.includes("rent")) {
    return "Review your utility bills and look for better plans. Small changes like LED bulbs, shorter showers, and unplugging devices can reduce bills by 10-15%.";
  }

  if (cat.includes("health") || cat.includes("medical") || cat.includes("gym") || cat.includes("fitness")) {
    return "Health is an investment, not an expense! Compare prices for medications and check if your insurance covers preventive care to reduce out-of-pocket costs.";
  }

  if (cat.includes("education") || cat.includes("course") || cat.includes("book") || cat.includes("tuition")) {
    return "Education is a great investment! Look for free alternatives like YouTube tutorials, Coursera audit options, or your local library for textbooks.";
  }

  if (cat.includes("subscription") || cat.includes("netflix") || cat.includes("spotify")) {
    return "Audit all your subscriptions — the average person pays for 3-4 unused subscriptions. Share family plans where possible to split costs.";
  }

  return "Consider if all spending in this category is necessary. Setting a monthly budget for this category and tracking it can help you stay within limits.";
}

module.exports = { generateInsights };
