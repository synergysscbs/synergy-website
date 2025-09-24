const dotenv = require("dotenv");
const path = require("path");

// Explicit path to .env file
const envPath = path.join(__dirname, ".env");
console.log("Looking for .env file at:", envPath);
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.log("No local .env loaded. Relying on process.env.");
} else {
  console.log("✅ .env file loaded successfully");
}

// ------------------- Imports ------------------- //
const express = require("express");
const nodemailer = require("nodemailer");
const session = require("express-session");
const RedisStoreFactory = require("connect-redis").default;
const IORedis = require("ioredis");
const flash = require("connect-flash");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const http = require("http");

// ------------------- App & Config ------------------- //
const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

// Trust proxy in production (Render, Heroku, etc.)
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ------------------- Security ------------------- //
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for now (enable once CSP is properly configured)
    crossOriginEmbedderPolicy: false,
  })
);

// ------------------- Logging, Compression & Parsing ------------------- //
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ------------------- Static Files ------------------- //
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: NODE_ENV === "production" ? "30d" : 0,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// ------------------- Session + Flash ------------------- //
let redisClient = null;
const SESSION_SECRET = process.env.SESSION_SECRET || "please_set_a_secret";

function createSessionMiddleware() {
  const redisUrl = process.env.REDIS_URL || null;

  if (redisUrl) {
    try {
      redisClient = new IORedis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
      });

      redisClient.on("error", (err) => {
        console.error("Redis client error:", err);
      });

      const RedisStore = RedisStoreFactory;
      const store = new RedisStore({ client: redisClient });

      console.log("✅ Using Redis session store");

      return session({
        store,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
      });
    } catch (err) {
      console.error("❌ Redis init failed:", err);
    }
  }

  console.warn(
    "⚠️ REDIS_URL not set. Falling back to in-memory session store (not recommended for production)."
  );
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

app.use(createSessionMiddleware());
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// ------------------- Rate Limiting ------------------- //
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "⚠️ Too many messages sent. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// ------------------- View Engine ------------------- //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------- Nodemailer ------------------- //
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) console.error("❌ SMTP error:", error.message);
    else console.log("✅ SMTP server ready");
  });
} else {
  console.warn("⚠️ Email not configured. Contact form will not work.");
}

// ------------------- Routes ------------------- //
app.get("/health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => res.render("Homepage"));

app.get("/contact", (req, res) => {
  res.render("contact", { errors: {}, oldData: {} });
});

app.get("/events", (req, res) => res.render("events"));
app.get("/events/Vincenza6_0", (req, res) => res.render("Vincenza6_0"));
app.get("/events/CBS", (req, res) => res.render("CBS"));
app.get("/events/catalyst", (req, res) => res.render("catalyst"));

app.get("/initiatives", (req, res) => res.render("Initiatives"));

app.get("/project", (req, res) => res.render("Project"));
app.get("/project/zypp", (req, res) => res.render("zypp"));
app.get("/project/slp", (req, res) => res.render("slp"));
app.get("/project/John-Jacobs", (req, res) => res.render("John-Jacobs"));

app.get("/publications", (req, res) => res.render("Publications"));
app.get("/publications/industryreports", (req, res) =>
  res.render("industryreports")
);

app.get("/team", (req, res) => res.render("Team"));

// ------------------- Contact Form (POST) ------------------- //
app.post(
  "/contact",
  contactLimiter,
  [
    body("firstName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters.")
      .escape(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("phone")
      .optional({ checkFalsy: true })
      .isMobilePhone()
      .withMessage("Please enter a valid phone number."),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters.")
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const oldData = req.body;

    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => (errorObj[err.param] = err.msg));
      return res.render("contact", { errors: errorObj, oldData });
    }

    if (!transporter) {
      req.flash(
        "error_msg",
        "❌ Email service unavailable. Please contact us directly."
      );
      return res.redirect("/contact");
    }

    const { firstName, email, phone, message } = req.body;

    const mailOptions = {
      from: `"${firstName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong> ${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      req.flash("success_msg", "✅ Thank you! Your message has been sent.");
      res.redirect("/contact");
    } catch (err) {
      console.error("❌ Email send error:", err);
      req.flash(
        "error_msg",
        "❌ Failed to send message. Please try again later."
      );
      res.redirect("/contact");
    }
  }
);

// ------------------- Error Handling ------------------- //
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).send("Something went wrong!");
});

app.use((req, res) => res.status(404).send("Page not found"));

// ------------------- Start Server ------------------- //
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (NODE_ENV=${NODE_ENV})`);
});

// ------------------- Graceful Shutdown ------------------- //
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);

  server.close(async (err) => {
    if (err) {
      console.error("Error shutting down HTTP server:", err);
      process.exit(1);
    }
    console.log("✅ HTTP server closed.");

    try {
      if (redisClient) {
        await redisClient.quit();
        console.log("✅ Redis client closed.");
      }
    } catch (e) {
      console.error("⚠️ Error closing Redis:", e);
    }

    process.exit(0);
  });

  setTimeout(() => {
    console.warn("⏳ Forced shutdown after 10s");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
