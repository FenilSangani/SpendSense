const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const query = { userId: req.user._id };

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.startDate) {
      query.date = query.date || {};
      query.date.$gte = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      query.date = query.date || {};
      query.date.$lte = new Date(req.query.endDate);
    }

    if (req.query.search) {
      query.note = { $regex: req.query.search, $options: "i" };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching transactions",
    });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide type, amount, and category",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      note: note || "",
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Add transaction error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error adding transaction",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this transaction",
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating transaction",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this transaction",
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting transaction",
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const totals = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    for (let i = 0; i < totals.length; i++) {
      if (totals[i]._id === "income") {
        totalIncome = totals[i].totalAmount;
      } else if (totals[i]._id === "expense") {
        totalExpense = totals[i].totalAmount;
      }
    }

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const monthlyBreakdown = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown,
        monthlyBreakdown,
      },
    });
  } catch (error) {
    console.error("Get summary error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching summary",
    });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
