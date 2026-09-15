from crewai import Agent

from app.config.llm import llm


theme_agent = Agent(
    role="Customer Feedback Theme Analyst",

    goal=(
        "Identify the main themes and recurring topics "
        "present in customer feedback."
    ),

    backstory=(
        "You are an expert customer feedback analyst. "
        "You carefully analyze large amounts of user feedback "
        "to identify common topics, recurring concerns, and "
        "patterns. You group related feedback into meaningful "
        "themes without confusing themes with individual "
        "pain points or feature requests."
    ),

    llm=llm,

    verbose=True
)