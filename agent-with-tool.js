import "dotenv/config"
import { Agent,run,tool} from "@openai/agents";
import {z} from "zod"
import axios from "axios";

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



//creating agent START *****************************
const agent = new Agent({
    name:"Weather Agent",//required
    instructions:"You are an expert weather agent that helps user to tell weather reports",//required
    model:"gpt-4o-mini",//optional
    tools:[getWeatherTool]//optional, takes array of tools
})
//creating agent END *****************************

//calling the agent
async function main(query=""){
    const result = await run(agent,query)//run used to run the agent , takes agent details, user input
    console.log(result.finalOutput);
}
 main("what is the weather of himachal,delhi, mumbai,gurgaon today?")
