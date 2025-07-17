import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET= process.env.JWT_SECRET

const router = express.Router()
const prisma = new PrismaClient()
router.post('/cadastro', async(req, res) => {

    try {
        const user = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password,salt)

        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password:hashPassword,
        }
        })
        res.status(201).json(userDB)
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde" })
    }

})

router.post('/login', async(req, res) => {
    const userInfo = req.body
    try{
        const user = await prisma.user.findUnique({where:{email:userInfo.email}})
        if(!user){
            return res.status(404).json({message: "Usuário não encontrado"})
        }
        const isMatch =  await bcrypt.compare(userInfo.password,user.password)
        if(!isMatch){
            return res.status(400).json({message: "Senha Inválida"})
        }
        const token= jwt.sign({id:user.id},JWT_SECRET,{expiresIn:'1m'})
        return res.status(200).json(token)

    }catch(err){
        res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde" })
    }
})


export default router