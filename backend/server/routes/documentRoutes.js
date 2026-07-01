const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer"); // npm install multer
const db = require("../config/db");

const {
  getDocuments,
  verifyDocument,
  rejectDocument,
} = require("../controllers/documentController");

const router = express.Router();

// ─── MULTER SETUP ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, PNG allowed"));
    }
  },
});

// ─── ROUTES ───────────────────────────────────────────────

router.get("/", getDocuments);

// ✅ Real file upload — multer file receive karega
router.post("/", upload.single("file"), (req, res) => {
  const { application_id, document_name, document_type } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const file_name = req.file.filename;
  const file_path = `/uploads/${file_name}`;
  const file_type = req.file.mimetype.includes("pdf") ? "pdf" : "image";

  // Pehle check karo — same application_id + document_name ki Pending row exist karti hai kya
  db.query(
    `SELECT id FROM loan_documents
     WHERE application_id = ? AND document_name = ? AND uploaded = 'No' AND status = 'Pending'
     LIMIT 1`,
    [Number(application_id), document_name],
    (err, existingRows) => {
      if (err) { console.log(err); return res.status(500).json(err); }

      if (existingRows.length > 0) {
        // Existing Pending row UPDATE karo — naya INSERT nahi
        db.query(
          `UPDATE loan_documents
           SET file_name = ?, file_path = ?, file_type = ?, document_type = ?,
               uploaded = 'Yes', status = 'Uploaded', uploaded_at = NOW()
           WHERE id = ?`,
          [file_name, file_path, file_type, document_type, existingRows[0].id],
          (err) => {
            if (err) { console.log(err); return res.status(500).json(err); }
            res.status(201).json({ message: "Document uploaded successfully" });
          }
        );
      } else {
        // Pending row nahi — fresh INSERT karo
        db.query(
          `INSERT INTO loan_documents
           (application_id, document_name, document_type, file_name, file_path, file_type, uploaded, status, rejection_reason, uploaded_at)
           VALUES (?, ?, ?, ?, ?, ?, 'Yes', 'Uploaded', '', NOW())`,
          [Number(application_id), document_name, document_type, file_name, file_path, file_type],
          (err) => {
            if (err) { console.log(err); return res.status(500).json(err); }
            res.status(201).json({ message: "Document uploaded successfully" });
          }
        );
      }
    }
  );
});

router.put("/:id/verify", verifyDocument);

router.put("/:id/reject", rejectDocument);

// ✅ Download — disk se actual file bhejo
router.get("/:id/download", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM loan_documents WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "Document not found" });

    const doc = result[0];

    if (doc.uploaded !== "Yes" || !doc.file_name) {
      return res.status(400).json({ message: "No file uploaded for this document" });
    }

    const filePath = path.join(__dirname, "..", "uploads", doc.file_name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${doc.file_name}"`);
    res.sendFile(filePath);
  });
});

module.exports = router;