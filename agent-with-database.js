import "dotenv/config"
import mongoose from "mongoose"
import { Agent, run, tool } from "@openai/agents"
import {z} from "zod"
import nodemailer from "nodemailer";

//making connection with database
const connectDb = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
}

//create tool
const connectToDatabase = tool({
    name: "get_collection_data",

    description:
        "Fetch all documents from a MongoDB collection.",

    parameters: z.object({
        collection: z.string()
    }),

    execute: async ({ collection }) => {
        const data = await mongoose.connection.db
            .collection(collection)
            .find({})
            .limit(20)
            .toArray();

        return data;
    }
});



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

//creating send mail tool START ***********************
const sendMail = tool({
    name:"send_email",
    description:"Sends email to user",
    parameters: z.object({
        email: z.string().describe("email on which email have to send"),
        subject: z.string().describe("subject eof the mail, according to the content"),
        message: z.string().describe("content of the mail, according to the requirement of user"),
    }),
    execute: async function({email,subject,message}){
        try {
            const info = await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: email,
              subject,
              text: message,
            });
      
            return `Email sent successfully. Message ID: ${info.messageId}`;
          } catch (error) {
            console.error(error);
            return `Failed to send email: ${error.message}`;
          }
    }
})
//creating send mail tool END ***********************

//create Agent
const agent = new Agent({
    name:"coding expert agent",
    instructions: `
    You are a database assistant.
    
    When the user asks for data,
    use the get_collection_data tool.
    
    When the user asks to email the data,
    use the send_email tool.
    `,
    model:"gpt-4o-mini",
    tools: [connectToDatabase,sendMail]
})

//run agent
async function main(query=""){
    const result = await run(agent,query)
    console.log(result.finalOutput);
}

//call main 
async function start() {

    await connectDb();

    await main(
        "Get all users from the users collection and send all the user details to my email souravchauhan1964@gmail.com"
    );

}

start();
