from agents import search_agents,reader_agent,writer_chain,critic_chain

def run_research(topic:str)->dict:
    """Run the complate research workflow."""

    print("Step 1/4: Searching the web...")

    search_response=search_agents.invoke(
        {
            "messages":[
                {
                    "role":"user",
                    "content":f"Find 5 useful soureces abput:{topic}",
                }
            ]
        }
    )

    search_results=search_response["messages"][-1].content

    print("Step 2/4: Reading the source...")

    reader_response=reader_agent.invoke(
        {
            "messages":[
                {
                   "role": "user",
                    "content": (
                        "Read and summarize these research sources. "
                        "Use scrape_url for the URLs provided. "
                        "Preserve the source URLs and distinguish "
                        "page content from unverified claims.\n\n"
                        f"{search_results}" 
                    ),
                }
            ]
        }
    )
    findings=reader_response["messages"][-1].content

    print("Step 3/4: Writing the report...")

    report =writer_chain.invoke(
        {
            "topic":topic,
            "findings":findings,
        }
    )

    print("step 4/4: Reviewing the report...")

    
    review = critic_chain.invoke(
        {
            "topic": topic,
            "findings":findings,
            "report":report,
        }
    )


    return {
         "topic": topic,
        "search_results": search_results,
        "findings": findings,
        "report": report,
        "review": review,
    }