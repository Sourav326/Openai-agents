import "dotenv/config"
import { Agent,run,tool} from "@openai/agents";
import {z} from "zod"
import axios from "axios";
import nodemailer from "nodemailer";

//creating tool START ************************************
const getWeatherTool = tool({
    name:"Get Weather",
    description: "Returns the current weather information for the given city",
    parameters: z.object({
        city:z.string().describe('name of the city'),
    }),
    execute: async function ({city}){
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`
        const response  = await axios.get(url);
        return `The weather of ${city} is ${response.data}`
    },
})
//creating tool END ************************************


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

//creating send mail tool START ***********************
const sendMail = tool({
    name:"Send Email",
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



//creating agent START *****************************
const agent = new Agent({
    name:"Weather Agent",//required
    instructions:"You are an expert weather agent that helps user to tell weather reports",//required
    model:"gpt-4o-mini",//optional
    tools:[getWeatherTool,sendMail]//optional, takes array of tools
})
//creating agent END *****************************

//calling the agent
async function main(query=""){
    const result = await run(agent,query)//run used to run the agent , takes agent details, user input
    console.log(result.finalOutput);
}
 main("what is the weather of himachal,delhi,dhradun today? and than send the each city weather details on my email id souravchauhan1964@gmail.com, make the mail content attractive and also send me some history of each city")
