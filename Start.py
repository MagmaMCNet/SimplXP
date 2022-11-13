import requests as Request
import json, time, os, dotenv

env_file = dotenv.find_dotenv()
dotenv.load_dotenv(env_file)

file_r = open("python.json", )
data = json.load(file_r)
file_r.close()
if (data["Branch"]  == "main"):
    print("Currently Stable Does Support AutoUpdater")
elif (data["Branch"] == "beta"):
    print("Checking For Updates")
    V = json.loads(Request.get("https://raw.githubusercontent.com/SMLkaiellis08/Leveling-XP-discord-bot/beta/python.json").json)  # type: ignore
    if (float(V) > float(data["Version"])):
        print("Update Available", data["BetaUrl"])
        time.sleep(1.5)
    else:
        print("No Updates Found Starting As Normal")
        time.sleep(1)

if (not data["HasRan"]):
    os.system("cls")
    time.sleep(0.5)
    print("First Time Setup")
    Token = input("Bot Token: ")
    dotenv.set_key(env_file, "TOKEN", Token)
    os.system("npm i")
    
    data["HasRan"] = True
    
    file_w = open("python.json", "w")
    json.dump(data, file_w, indent=4)
    file_w.close();
    time.sleep(0.5)
    os.system("cls")

os.system("npm run start")