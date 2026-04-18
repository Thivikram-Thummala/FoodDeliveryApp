import userModel from "../models/userModel.js";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import jwt from "jsonwebtoken"
passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// creating webtoken (use a fallback secret for local dev if JWT_SECRET not set)
const createToken = (id) => {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    return jwt.sign({ id }, secret, { expiresIn: '7d' });
}

const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!validateEmail(email)) {
        return res.json({ success: false, message: "Invalid email format" });
    }
    try {
        const emailExists = await userModel.findOne({ email });
        const userExists= await userModel.findOne({username})
        if (emailExists) {
            return res.json({ success: false, message: "Email is already used" });
        } 
        else if(userExists){
            return res.json({ success: false, message: "UserName already Exists" });
        }else {
            const newUser = new userModel({
                username: username, 
                email: email
            });

            userModel.register(newUser, password, async (err, user) => {
                if (err) {
                    console.error('Registration Error:', err);
                    return res.json({ success: false, message: "Registration failed", error: err });
                }

                 // ✅ Just create token and return — no need to re-authenticate
                const token = createToken(user._id);
                // return basic user info along with token so frontend can set user state
                const safeUser = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    cartData: user.cartData || {}
                };
                return res.json({ success: true, message: 'Registration successful', token, user: safeUser });
                
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
const loginUser = async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return res.json({ success: false, message: "Authentication failed", error: err });
        }
        if (!user) {
            return res.json({ success: false, message: info?.message || "Invalid username or password" });
        }

        // ✅ No req.logIn needed for JWT
        const token = createToken(user._id);
        const safeUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            cartData: user.cartData || {}
        };
        return res.json({ success: true, message: "Login successful", token, user: safeUser });

    })(req, res, next);
};

const userProfile =async (req,res)=>{
    if(req.isAuthenticated()){
        res.json({ user: req.user });
    }
}


export { loginUser, registerUser ,userProfile };
