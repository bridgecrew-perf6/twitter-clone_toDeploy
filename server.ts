import dotenv from 'dotenv'
dotenv.config()

import './core/db'

import express from 'express'

import {passport} from './core/passport'

import { UserCtrl } from './controllers/UserController'
import { registerValidations } from './validations/register'
import { TweetsCtrl } from './controllers/TweetsController'
import { createTweetValidations } from './validations/createTweet'


const app = express()

app.use(express.json())
app.use(passport.initialize())

app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt', {session: false}), UserCtrl.getUserInfo)
app.get('/users/:id', UserCtrl.show)

app.get('/tweets', TweetsCtrl.index)
app.get('/tweets/:id', TweetsCtrl.show)
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete)
app.patch('/tweets/:id', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.update)
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.create)

app.get('/auth/verify', registerValidations, UserCtrl.verify)
app.post('/auth/register', registerValidations, UserCtrl.create)
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)

const PORT = process.env.PORT

app.listen(PORT, (): void => {
    console.log(`Server has been started at ${PORT} port`)
})