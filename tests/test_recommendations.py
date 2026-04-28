from backend.services.recommendation_service import recommend_events

def test_basic_recommendation():
    user_input = {
        "text": "I like indie concerts"
    }

    result = recommend_events(user_input)
    assert "recommendations" in result
    assert isinstance(result["recommendations"], list)
