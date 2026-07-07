import "dotenv/config"
import { Agent, run } from "@openai/agents";
import {z} from "zod"


//structured object we want in output
const calenderEvent = z.object({
    name:z.string().describe("name of the event"),
    date:z.string().describe("perticular date of the event as per calender"),
    participants: z.array(z.string()),
})


//Agent
const agent = new Agent({
    name:"Calender Extractor",
    instructions:"Extract calender events from the text",
    model:"gpt-4o-mini",
    outputType:calenderEvent
})

async function main(query=""){
    const result = await run(agent,query)
    console.log(result.finalOutput);
}

main("Dinner with priya and sam on comming friday")