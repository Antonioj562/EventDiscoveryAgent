import streamlit as st
import requests

st.title("🎟 Event Discovery Agent")

session_id = st.text_input("Session ID", value="demo-user")

query = st.text_input("What events are you interested in?")

if st.button("Get Recommendations"):
    res = requests.post(
        "http://127.0.0.1:8000/events/recommend",
        json={"session_id": session_id, "text": query}
    )

    data = res.json()

    st.subheader("Recommendations")

    for e in data.get("recommendations", []):
        st.write(f"**{e['name']}** - {e['description']}")

    st.subheader("Explanation")
    st.write(data.get("explanation", ""))


# Feedback buttons
st.subheader("Give Feedback")

event_text = st.text_input("Event description to give feedback on")

feedback = st.selectbox(
    "Feedback type",
    ["interested", "not_interested", "attended"]
)

if st.button("Submit Feedback"):
    requests.post(
        "http://127.0.0.1:8000/events/feedback",
        json={
            "session_id": session_id,
            "event_text": event_text,
            "feedback": feedback
        }
    )

    st.success("Feedback saved!")