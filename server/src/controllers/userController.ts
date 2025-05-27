import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const Users = await prisma.users.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(Users);
  } catch (error) {
    res.status(500).json({ message: "Error retreveing Users " });
  }
};

