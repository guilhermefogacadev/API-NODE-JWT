import express from "express"
import {PrismaClient} from "@prisma/client"

const router= express.Router()
const prisma= new PrismaClient()

router.get("/listarUsuarios",async (req,res)=>{
    try {
        const users = await prisma.user.findMany({omit:{password:true}})
        if(!users){
            return res.status(404)
        }
        res.status(200).json({message: "Usuários listados com sucesso",users})
    } catch (error) {
        res.status(500).json({message:"Falha no Servidor"})
    }
})

export default router