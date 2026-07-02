
import express ,{Request,Response} from 'express';  
import dotenv from 'dotenv'; 
import { agent } from './agent';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


app.post("/api/chat" , async(req :Request,res :Response) =>{

    const {question} = req.body;
      const answer :string | any =await agent(question)

      res.json({
        success:true,
          message: answer.split("\n")
       
      })


})



app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });