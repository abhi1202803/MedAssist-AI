from fastapi import APIRouter
from pydantic import BaseModel
from gpt_handler import rag_chain
from utils.response import success_response, error_response

router = APIRouter()


class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    query: str
    answer: str


@router.post("/result", response_model=QueryResponse)
async def find_result(request: QueryRequest):
    """
        Endpoint to get the medical response for a user query.
    """
    try:
        query_text = request.query
        
        result = await rag_chain.ainvoke({"input": query_text})

        if isinstance(result, dict) and "answer" in result:
            answer = result["answer"]
        else:
            answer = str(result)

        if not answer:
            answer = "No answer could be generated at this time, Due to server error."

        
        return QueryResponse(query=query_text, answer=answer)

    except Exception as e:
        return error_response(f"Error: {str(e)}")
    
