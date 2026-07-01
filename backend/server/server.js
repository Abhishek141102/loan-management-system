require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const settingsRoutes = require("./routes/settingsRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // RBAC - NEW

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("I Loan Backend Running");
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes); // RBAC - NEW

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
