from copy import copy
from pymongo import MongoClient  #for mongodb
import jwt    #for authentication
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_protect,csrf_exempt
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import math,random
from django.core.mail import send_mail
import datetime;
#connecting python with mongodb
client=MongoClient("mongodb+srv://test:test@cluster0-nc9ml.mongodb.net/sih?retryWrites=true&w=majority")
db=client.get_database('sih')
record=db.sih
from rest_framework.decorators import api_view
import hashlib 





def test(request):
    return JsonResponse({'test':'pass'},status=200)
def generateOTP(): 
    digits = "0123456789"
    OTP = "" 
    for i in range(4) : 
        OTP += digits[math.floor(random.random() * 10)] 
    return OTP
def sendMail(to,otp):
    fromaddr = "sihkkr2020@gmail.com"
    toaddr = to
    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = "SUBJECT OF THE MAIL"

    body = otp
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(fromaddr, "demon_killers")
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()
@api_view(['POST'])
def signup(request):
    # print((request))
    if request.method == "POST":
        try:
            # print((request),request.data)
            x=record.insert_one(dict(request.data))
            return JsonResponse({"status": dict(request.data)},status=200)
        except Exception as e:
            return JsonResponse({"status": "email already exist"},status=500)
    else:
        return JsonResponse({"status": "Only post method allowed"},status=500)

@api_view(['POST'])
def sendEmail(request):
    q=request.data
    x=record.find_one({"_id":q['email']})
    if(x==None):
        try:
            otp=generateOTP()
            print(request.data['email'],otp)
            # sendEmail(request.data['email'],otp)
            send_mail('Verificaton for signup', otp, 'sihkkr2020@gmail.com', [request.data['email']])
            return JsonResponse({"status":hashlib.md5(otp.encode()).hexdigest()},status=200)
        except Exception as e:
            return JsonResponse({"status": "an error occured :(","e":e},status=500)
    else:
        return JsonResponse({"status":'already registered'},status=200)
