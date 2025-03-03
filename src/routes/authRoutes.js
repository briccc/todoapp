import express from 'express'
import bcrypt from  'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPass = bcrypt.hashSync(password, 8)
    try {
        //insert user
        const user = await prisma.user.created({
            data: {
                username,
                password: hashedPass
            }
        })
        
        //associate todo
        const defaultTodo = `Hello. Add a todo app`
        await prisma.todo.create({
            data:{
                task: defaultTodo,
                userId: user.id
            }
        })
    
        //token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(!user){
            return res.status(404).send({ message: 'User not found'})
        }

        const passwordisValid = bcrypt.compareSync(password, user.password)
        if(!passwordisValid){
            return res.status(401).send({ message: 'Credentials not valid' })
        }
        
        console.log(user) 

        //token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router