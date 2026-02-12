AI Voice Enabled Browser Extension for Accessible Web Interaction
Overview

The AI Voice Enabled Browser Extension is a Chrome extension that allows users to interact with the web using voice commands. It uses Speech-to-Text technology and Natural Language Processing (NLP) to understand user commands and perform browser actions such as opening websites and searching online.

This project improves accessibility and provides a hands-free browsing experience, especially helpful for users with physical limitations.

Features
Voice command recognition using microphone
Speech-to-Text conversion using Web Speech API
NLP-based command interpretation
Open websites using voice commands
Perform web searches using voice input
Hands-free browser navigation
Accessible web interaction


Technologies Used

JavaScript
HTML
CSS
Web Speech API (Speech Recognition)
Chrome Extension API
Natural Language Processing (NLP)
Flask (Backend for command processing)
REST API


Project Architecture

User provides voice input through microphone
Web Speech API converts speech into text
NLP module processes and identifies the command intent
Backend (Flask) processes the command
Chrome Extension executes the requested browser action

Installation Guide
Step 1: Clone the Repository
git clone https://github.com/GKSakthi/Ai-Voice-Enabled-Browser-Extension-for-Accessible-Web-Interaction.git

Step 2: Open Chrome Extensions
Go to:
chrome://extensions/

Step 3: Enable Developer Mode
Turn ON Developer Mode (top right corner)

Step 4: Load Extension
Click Load unpacked
Select the project folder

Step 5: Extension Ready
Your extension is now installed and ready to use.

Example Voice Commands

Open Website Commands

"Open YouTube"
"Open Google"
"Open Gmail"
"Open Facebook"
"Open Instagram"

Search Commands

"Search Artificial Intelligence"
"Search latest technology news"
"Search weather today"
Scrolling Commands
"Scroll down"
"Scroll up"
"Scroll to top"
"Scroll to bottom"
Voice Typing
Speak normally to type in text fields
Example: Click on search box and speak your query

Use Cases

Assistive technology for accessibility
Hands-free browser control
Improve user productivity
Helpful for physically challenged users
Voice-controlled web interaction

Project Structure

Ai-Voice-Enabled-Browser-Extension/
│
├── manifest.json
├── popup.html
├── popup.js
├── style.css
├── background.js
├── app.py
└── README.md

Future Enhancements

Support multiple languages
Improve NLP accuracy
Add more browser commands
Add voice feedback system
Integrate advanced AI models


Author

Sakthivel Raj G
Information Technology Student
2026 Graduate
GitHub: https://github.com/GKSakthi

License
This project is developed for educational and research purposes.
