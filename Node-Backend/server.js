
// ***********
import express from "express";
import cors from "cors";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import expressSession from "express-session";
import passport from "passport";
import authMiddleware from "./middleware/auth.js";
import User from "./models/userModel.js";
import orderRouter from "./routes/orderRoute.js";
import connectDb from "./config/mongodb.js";
// import foodDb from "./config/mongodb.js";
// for webtoken
import "dotenv/config"

const app = express();
const port =process.env.PORT|| 4000;


// Middleware setup
app.use(express.json());
// Simple request logger to help debug requests not reaching server
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

const allowedOrigins=[
  "http://localhost:5173",
  "http://localhost:5174",
  "https://fooddeliveryapp-admin-5fn3.onrender.com",
  'https://fooddeliveryapp-frontend-oh6b.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser requests (no origin) and any localhost origin
    if (!origin || origin.startsWith('http://localhost') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// app.use(express.urlencoded({ extended: true }));

// setup for db connection
connectDb();
// Session configuration with MongoStore
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "Anything",
  cookie: { secure: false }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user.id); // Save user.id to the session
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user); // Retrieve user object from the database based on user.id stored in session
  });
});


// Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order",orderRouter);
// foodDb()
// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});



