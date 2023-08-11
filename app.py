
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from geopy.geocoders import Nominatim
from flask  import Flask, render_template,jsonify,request

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL': ''
})

app = Flask(__name__)

def locate(lat,lon):
    cord = [lat,lon]    
    geoLoc = Nominatim(user_agent="GetLoc")
    locname = geoLoc.reverse(cord)
    add = locname.address
    return add
lis =[]
coord=[]
@app.route("/", methods=["POST","GET"])
def index():
    coords = db.reference("Device-Locations").get()
    if request.method == "POST":
        dat = request.get_json()
        device = db.reference("AQMS-Values").child(dat['AQMSID']).get()
        return jsonify(device)
        
    
    return render_template("index.html",data = "Hi")
@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/location", methods=["POST"])
def get():
    data = request.get_json()
    # add = locate(data["lat"],data["long"])
    return jsonify({'address': "address"})

@app.route("/deploy",methods=["POST"])
def deploy():
    sub = request.get_json()
    add = locate(sub["lat"],sub["long"])
    myadd = add.split(",")
    def int_filter( someList ):
        for v in someList:
            try:
                int(v)
                continue # Skip these
            except ValueError:
                yield v # Keep these    
    myadd = (list(int_filter(myadd)))
    city= myadd[-3]
    state= myadd[-2]
    country= myadd[-1]
    payload = {
        "AQMSID": sub["Aqmsid"],
        "latitude":sub["lat"],
        "longitude":sub["long"],
        "city":"city",
        "state":"state",
        "country":"country",
        "address":"add"
    }
    payload2 = {
       "AIRQ": "0",
       "PM2_5" : "0"
    }
    db.reference('AQMS-Values').child(sub["Aqmsid"]).set(payload2)
    db.reference('Device-Locations').child(sub["Aqmsid"]).set(payload)  
    return "success"

@app.route("/data", methods=["POST"])
def data():
    data =request.get_json()
    db.reference("AQMS-Values").child(data['AQMSID']).update({
        'AIRQ': str(data['AIRQ']),
        'PM2_5': str(data['PM2_5'])
    })
    return "Successfully updated"

if  __name__ == "__main__":
    app.run(debug=True)