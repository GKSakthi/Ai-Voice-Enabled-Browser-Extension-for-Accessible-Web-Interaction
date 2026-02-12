from flask import Flask, jsonify
from flask_cors import CORS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)

r = sr.Recognizer()
mic = sr.Microphone()

@app.route("/listen")
def listen():
    try:
        with mic as source:
            print("🎤 Listening...")
            r.energy_threshold = 300
            r.dynamic_energy_threshold = True
            r.adjust_for_ambient_noise(source, duration=1)

            audio = r.listen(source, timeout=6, phrase_time_limit=5)

        text = r.recognize_google(audio).lower()
        print("🗣️ You said:", text)

        # Ignore noise
        if len(text.strip()) < 3:
            return jsonify({"intent": "NO_SPEECH"})

        # -------- SCROLL --------
        if "scroll down" in text:
            return jsonify({"intent": "SCROLL_DOWN"})

        if "scroll up" in text:
            return jsonify({"intent": "SCROLL_UP"})

        # -------- OPEN WEBSITE --------
        if text.startswith("open"):
            site = text.replace("open", "").strip()
            return jsonify({"intent": "OPEN", "site": site})

        # -------- SEARCH --------
        if text.startswith("search"):
            query = text.replace("search", "").strip()
            return jsonify({"intent": "SEARCH", "query": query})

        # -------- TYPE --------
        if text.startswith("type"):
            content = text.replace("type", "").strip()
            return jsonify({"intent": "TYPE", "text": content})

        # -------- CLICK --------
        if text.startswith("click"):
            target = text.replace("click", "").strip()

            number_map = {
                "one": "1",
                "two": "2",
                "three": "3",
                "four": "4",
                "five": "5"
            }

            for word, digit in number_map.items():
                if word in target:
                    target = target.replace(word, digit)

            return jsonify({"intent": "CLICK", "target": target})

        # -------- UNKNOWN --------
        return jsonify({"intent": "UNKNOWN"})

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"intent": "NO_SPEECH"})

if __name__ == "__main__":
    app.run(port=5000)
