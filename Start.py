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
    V = json.loads(str(Request.get("https://raw.githubusercontent.com/SMLkaiellis08/Leveling-XP-discord-bot/Beta/python.json").text))["Version"]
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
    dotenv.set_key(env_file, "TOKEN", input("Bot Token: "))
    r = input("Are You Running This On Replit? [yes/no]: ")
    dotenv.set_key(env_file, "REPLIT",r)
    if (r == "yes"):
        open("ReplitServer.js", "w").write("""const express=require('express');const server=express();server.all('/',(req, res)=> {res.send('Your Bot Is Running');});function StartRepl(){server.listen(5000, ()=>{console.log("Server is Ready!");});}module.exports = StartRepl;""")
    data["HasRan"] = True
    
    file = open("python.json", "w")
    json.dump(data, file, indent=4)
    file.close()
    
    os.system("cls")
    time.sleep(0.5)
    os.system("npm i")
    time.sleep(0.5)
    os.system("cls")

os.system("npm run start")