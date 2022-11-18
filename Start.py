import requests as Request
import json, time, os, dotenv, sys, shutil, pathlib

if getattr(sys, 'frozen', False):
    if (not os.path.exists(".env")):
        shutil.copy(os.path.join(os.path.dirname(__file__))+"\\json\\", "json\\")
    
    shutil.copy(os.path.join(os.path.dirname(__file__))+"\\src\\", "src\\")
    shutil.copyfile(os.path.join(os.path.dirname(__file__))+"\\package.json", "package.json")
    os.chdir(pathlib.Path(sys.executable).parent)


if (not os.path.exists(".env")):
    with open(".env", "w") as f:
        f.write("");
env_file = dotenv.find_dotenv()
dotenv.load_dotenv(env_file)

file_r = open("JSON/python.json", )
data = json.load(file_r)
file_r.close()
if (data["Branch"]  == "Stable"):
    print("Checking For Updates")
    V = json.loads(str(Request.get(data["RawStableUrl"]+"/JSON/python.json").text))["Version"]
    if (float(V) > float(data["Version"])):
        print("Update Available", data["StableUrl"])
        time.sleep(1)
    else:
        print("No Updates Found Starting As Normal")
        time.sleep(0.5)
elif (data["Branch"] == "beta"):
    print("Checking For Updates")
    V = json.loads(str(Request.get(data["RawBetaUrl"]+"/JSON/python.json").text))["Version"]
    if (float(V) > float(data["Version"])):
        print("Update Available", data["BetaUrl"])
        time.sleep(1)
    else:
        print("No Updates Found Starting As Normal")
        time.sleep(0.5)

if (not data["HasRan"]):
    os.system("cls")
    time.sleep(0.5)
    print("--------First Time Setup--------")
    dotenv.set_key(env_file, "TOKEN", input("Bot Token: "))
    dotenv.set_key(env_file, "XPMULTIPLIER", input("Xp Multipler [5, 10, 20, ..]: "))
    dotenv.set_key(env_file, "REPLIT", input("Running On Replit [yes/no]: "))
    dotenv.set_key(env_file, "PORT", input("Port: "))
    data["HasRan"] = True
    
    file = open("JSON/python.json", "w")
    json.dump(data, file, indent=4)
    file.close()
    
    os.system("cls")
    os.system("npm install dotenv")
    os.system("npm install express")
    os.system("npm install chalk@4.1.2")
    os.system("npm install ts-node --global")
    os.system("npm install discord.js@13.10.4")
    os.system("npm install chalk-animation@1.6.0")
    os.system("cls")
print("Starting")
os.system("npm run start")
print("Stopped")
print("Press Any Key To Exit")
os.system('pause > null')