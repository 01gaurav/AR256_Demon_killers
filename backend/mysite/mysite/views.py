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
@api_view(['POST'])
def sendEmailFP(request):
    q=request.data
    x=record.find_one({"_id":q['email']})
    if(x!=None):
        try:
            otp=generateOTP()
            print(request.data['email'],otp)
            # sendEmail(request.data['email'],otp)
            send_mail('Verificaton for signup', otp, 'sihkkr2020@gmail.com', [request.data['email']])
            return JsonResponse({"status":hashlib.md5(otp.encode()).hexdigest()},status=200)
        except Exception as e:
            return JsonResponse({"status": "an error occured :(","e":e},status=500)
    else:
        return JsonResponse({"status":'not registerd'},status=200)


@api_view(['POST'])
def FP(request):
    q=request.data
    record.update_many( {"_id":q['email']}, { "$set":{  "password":q['password']} } ) 
    return JsonResponse({"status":'done'},status=200)



@api_view(['POST'])
def Query(request):
    q=request.data
    y=request.data['token']
    y=jwt.decode(y, 'mks')
    y1=record.find_one({"_id":y['email']})
    z=y1['query']
    z.append([q['msg'],q['name'],q['email'],datetime.datetime.now().isoformat()])
    record.update_many( {"_id":y['email']}, { "$set":{  "query":z} } ) 
    return JsonResponse({"status":'done'},status=200)





@api_view(['POST'])
def login(request):
    try:
        q=request.data
        print(q)
        y=jwt.encode({"email":q['email']},"mks")
        x=record.find_one({"_id":q['email'],"password":q['password']})
        print(y.decode('UTF-8'),x,q,jwt.decode(y.decode('UTF-8'), 'mks'))
        if(x!=None):
            return JsonResponse({"status": "True","token":y.decode('UTF-8')},status=200)
        else:
            return JsonResponse({"status": "False"},status=200)
    except Exception as e:
        return JsonResponse({"status": "an error occured :(","e":e},status=500)
