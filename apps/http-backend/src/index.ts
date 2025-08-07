import express from "express";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import auth from "./middleware";
import {CreateUserSchema,RoomSchema,SigninSchema }  from "@repo/common-zod/types"
import { prismaclient} from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
const SALT_ROUNDS = 10;
app.use(express.json());
// 
app.get("/" ,(req:Request,res:Response) => {
    res.send("Hello world");
})

// DO ZOD VALIDATION IN BOTH OF THEM
app.post("/signup", async (req:Request,res:Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const {email,name,password} = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // this u store in the db
    try {
        const user = await prismaclient.user.create({
            data: {
                email: email,
                // TODO: Hash the pw
                password: hashedPassword,
                name: name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }


    // insert it into the db


})

app.post("/signin", async (req:Request,res:Response) => {
    const validation = SigninSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid Credentials",
      errors: validation.error.flatten(),
    });
    return;
  }

  const { email, password } = validation.data;

  try {
    const user = await prismaclient.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string);

    res.status(200).json({
      message: "Signin successful",
      token,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error during signin",
    });
    return;
  }

});

/*the user will be able to create a room,  */
app.post("/room", auth, async (req:Request,res:Response) => {
    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.json({
            message:"Incorrect inputs "
        })
        return ;
    }

    //@ts-ignore
    const userid = req.userId;
    try {
        const room = await prismaclient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userid
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})


app.get("/chats/:roomId", async (req:Request,res:Response) => {
  try{
    const room = Number(req.params.roomId);

  await prismaclient.chat.findMany({
    where:{
      roomId:room
    },
    orderBy: {
      id: "desc"
    },
    take: 1000
  })
  }
  catch(e)
  {
    res.json({
      "messages":[]
    })
  }
  
})
app.listen(5000, () => {
    console.log("greetings u are connected now !");
})