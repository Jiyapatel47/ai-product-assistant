from crewai import Agent

from app.config.llm import llm


pain_point_agent = Agent(
    role="Customer Pain Point Analyst",

    goal=(
        "Identify the main problems and pain points "
        "experienced by users from customer feedback."
    ),

    backstory=(
        "You are an expert customer feedback analyst. "
        "You carefully read user feedback, understand the "
        "underlying problems, and identify the issues that "
        "negatively affect the user experience."
    ),

    llm=llm,

    verbose=True
)