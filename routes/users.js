const express = require('express');
const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcrypt')

const router = express.Router();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        validate: {
          validator: validator.isEmail,
          message: 'Invalid email address'
        }
      },
      password: {
        type: String,
        required: true,
        minlength: 8
      }
});

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});


  


router.post('/', async (req, res) => {
const { name, email, password } = req.body;
 // Validar datos del formulario
 if (!name || !email || !password) {
    return res.status(400).send('LLena todos los campos');
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send('Correo electronico invalido');
  }
  if (password.length < 8) {
    return res.status(400).send('La contraseña debe de ser mínimo de 8 caracteres');
  }
const hashedPassword = await bcrypt.hash(password, 12); 
  const newUser = new User({name, email, password: hashedPassword });
  await newUser.save();
  res.redirect('/users');
});

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
    const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).send('Correo electronico invalido');
  }
  if (password.length < 8 && password.length >0  ) {
    return res.status(400).send('La contraseña debe de ser mínimo de 8 caracteres');
  }
  const hashedPassword = await bcrypt.hash(password, 12); 
  await User.findByIdAndUpdate(req.params.id, {name, email, password: hashedPassword });
  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
