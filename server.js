import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import User from './Models/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from 'cors'
import Survey from './Models/Survey.js';
const app = express()
dotenv.config()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
const secret = 'tarsh123';

const auth = async (req, res, next) => {
  try {
    const token = JSON.parse(req.headers.authorization);
    // console.log(token);



    const decodedData = jwt.verify(token, secret);
    //  console.log(decodedData);

    req.email = decodedData?.email;
    req.id = decodedData?.id
    req.name = decodedData?.name
    next();
  } catch (error) {
    console.log(error);
  }
};

app.post('/signup', async (req, res) => {
  const { name, email, password, phone, address, userLevel } = req.body
  // console.log(req.body);
  try {
    const olduser = await User.findOne({ email: email })
    if (olduser) {
      res.status(400).json({ status: false, message: 'Email already registered' })
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({ name, email, address, phone, password: hashedPassword, userLevel })
      const token = jwt.sign({ email: newUser.email, id: newUser._id, name: newUser.name }, secret, { expiresIn: "3650d" });
      res.status(201).json({ id: newUser._id, token, following: newUser.following });

    }
  } catch (error) {
    console.log(error);
  }
}
)

app.get('/', (req, res) => {
  res.json({ hello: 'hello' })
})
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id, name: oldUser.name }, secret, { expiresIn: "3650d" });

    res.status(200).json({ id: oldUser._id, following: oldUser.following, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
})

app.post('/add-survey', auth, async (req, res) => {
  // console.log(req.body);
  const { survey, title, desc, link } = req.body
  // console.log(req.name);
  try {
    const newSurvey = await Survey.create({ userId: req.id, questions: survey, description: desc, title, link, userName: req.name })
    res.status(201).json({ newSurvey });
  } catch (error) {
    console.log(error);
    res.json({ error })
  }
})
app.get('/members', auth, async (req, res) => {
  try {
    const members = await User.find({ userLevel: 1 })
    // console.log(members);
    res.status(201).json({ members });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
})
app.post('/unfollow', auth, async (req, res) => {
  // console.log("unfollow");
  try {
    const newUser = await User.updateOne({ email: req.email }, { $pull: { following: { $in: req.body.id } } })
    res.status(201).json({ success: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
})
app.post('/follow', auth, async (req, res) => {
  // console.log(req.body);
  // console.log("follow");
  try {
    const newUser = await User.updateOne({ email: req.email }, { $push: { following: req.body.id } })
    // console.log(newUser);
    res.status(201).json({ success: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
})
app.get('/surveys', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email })
    // console.log(user.following);
    const surveys = await Survey.find({ userId: { $in: [...user.following] } })
    // console.log(surveys);
    res.status(201).json({ surveys });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
})
app.get('/member/query', auth, async (req, res) => {
  // console.log(req.query);
  const { name } = req.query
  const nameRegEx = new RegExp(`${name}`, "gi")
  // console.log(nameRegEx);
  try {
    const users = await User.find(
      {
        name: { $regex: nameRegEx },
        userLevel:1
      }
    )
    // console.log(users);
    res.status(201).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
})
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
