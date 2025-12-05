from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
 
from app.database import get_db

from app.models import Word, PracticeSession

from app.schemas import ValidateSentenceRequest, ValidateSentenceResponse

from app.utils import mock_ai_validation
 
router = APIRouter()
 
 
@router.post("/validate-sentence", response_model=ValidateSentenceResponse)

def validate_sentence(

    request: ValidateSentenceRequest,

    db: Session = Depends(get_db)

):

    """

    Receive user sentence and validate it (mock AI)

    Save results to database

    """

    word = db.query(Word).filter(Word.id == request.word_id).first()

    if not word:

        raise HTTPException(

            status_code=404,

            detail=f"Word with id {request.word_id} not found"

        )
 
    # Run mock AI validation

    validation_result = mock_ai_validation(

        request.sentence,

        word.word,

        word.difficulty_level

    )
 
    # Persist practice session

    session_entry = PracticeSession(

        word_id=word.id,

        user_sentence=request.sentence,

        score=validation_result["score"],

        feedback=validation_result["suggestion"],

        corrected_sentence=validation_result["corrected_sentence"],

    )
 
    db.add(session_entry)

    db.commit()
 
    return ValidateSentenceResponse(**validation_result)
 