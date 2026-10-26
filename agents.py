from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from tools import web_search,scrape_url
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


llm=ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
)

search_agents=create_agent(
    model=llm,
    tools=[web_search],
    system_prompt=(
        "You are research search agent."
        "use the web_search tool to investigate the user question"
        "identify relevant sources and report their title,URLs"
        "and key findings, never invent source or urls"
    ),
)

reader_agent=create_agent(
    model=llm,
    tools=[scrape_url],
    system_prompt=(
        "You are a research reading agent. "
        "Use the scrape_url tool to read the webpage provided by the user. "
        "Summarize its main arguments, evidence, and key findings. "
        "Distinguish information found on the page from anything you cannot verify."
    ),
)

writer_prompt=ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "you are scientific research writer,"
            "write clear, structure report using only the"
            "Provided research finding,Preserve source URLs"
            "and never invent evidence or citations."
        ),
        (
            "human",
            "Research topic: {topic}\n\n"
            "Research findings:\n{findings}\n\n"
            "Write a report with these sections:\n"
            "1. Introduction\n"
            "2. Key Findings\n"
            "3. Discussion\n"
            "4. Conclusion\n"
            "5. Sources",
        ),
    ]
)

writer_chain=writer_prompt| llm | StrOutputParser()

critic_prompt=ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a rigorous research report reviewer. "
            "Evaluate reports for factual support, source quality, "
            "citation accuracy, clarity, and completeness. "
            "Do not assume claims are true merely because they appear "
            "in the report. Identify unsupported claims and explain "
            "what needs verification. Do not invent sources.",
        ),
        (
            "human",
            "Research topic: {topic}\n\n"
            "Research findings provided to the writer:\n{findings}\n\n"
            "Report to review:\n{report}\n\n"
            "Provide:\n"
            "1. Overall score out of 10\n"
            "2. Strengths\n"
            "3. Issues and unsupported claims\n"
            "4. Citation and source-quality assessment\n"
            "5. Specific improvements",
        )
    ]
)

critic_chain= critic_prompt|llm|StrOutputParser()