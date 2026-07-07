import 'dotenv/config'
import { Agent, run } from "@openai/agents";
const agent = new Agent({
    name: "History tutor",
    instructions:
        "You answer history questions clearly and concisely.",
    model: "gpt-5.5",
})

const result = await run(agent, "Give details about ramanyan");
console.log(result.finalOutput);