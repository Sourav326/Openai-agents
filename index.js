import 'dotenv/config'
import { Agent, run } from "@openai/agents";
const agent = new Agent({
    name: "History tutor",//required
    instructions: "You answer history questions clearly and concisely.",//required and it can be a function also not only string
    model: "gpt-4o-mini",//optional
})

const result = await run(agent, "Give details about ramanyan");
console.log(result.finalOutput);