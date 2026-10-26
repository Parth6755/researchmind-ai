import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from tavily import TavilyClient
from urllib.parse import urlparse
 
load_dotenv()

TAVILY_API_KEY=os.getenv("TAVILY_API_KEY")
tavily_client=TavilyClient(api_key=TAVILY_API_KEY)

def web_search(query:str, max_result:int=5) -> str:
    """Search the web and return relevant titles, URLs, and snippets."""
    response=tavily_client.search(
        query=query,
        max_results=max_result,
    )

    results=response.get("results",[])

    if not results:
        return "No search result found"

    formatted_result=[]

    for index,result in enumerate(results,start=1):
        title=result.get("titile","untitled")
        url=result.get("url","")
        snippet=result.get("content","No description available")

        formatted_result.append(
            f"Source {index}\n"
            f"Tiltle: {title}\n"
            f"URL : {url}\n"
            f"Snipeent: {snippet}\n"
        )
    return "\n".join(formatted_result)

def scrape_url(url: str)->str:
    """ Download a webpage and extrect its readable text.""" 

    parsed_url=urlparse(url)

    if parsed_url.scheme not in ("http","https") or not parsed_url.hostname:
        return "Error: Please provide a valid HTTP or HTTPS URL."

    try:
        response=requests.get(url,timeout=10)
        response.raise_for_status()

        soup=BeautifulSoup(response.text,"html.parser")

        for element in soup( ["scipt"],["style"],["nav"],["footer"]):
            element.decompose()

        text=soup.get_text(separator=" ",strip=True)

        if not text:
            return " There is no text in the webpage"  

        return text[:3000] 
    except requests.RequestException as error:
        return f"Could not retrive webpage: {error}"

    
