from django.shortcuts import render
import smtplib
import os
import json

with open('/etc/config.json') as config_file:
    config = json.load(config_file)

EMAIL_ADDRESS = config.get('EMAIL_USER') 
EMAIL_PASS = config.get('EMAIL_PASS')

# Create your views here.

def home(request):
    if request.method == 'POST':
        name = request.POST['name']
        sender = request.POST['email']
        contents = request.POST['message']
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASS)
            subject = f'Portfolio Contact Form From: {name}'
            body = contents

            msg = f'Subject: {subject}\n\n{body}'
            smtp.sendmail(EMAIL_ADDRESS, 'andy.little@hotmail.co.uk', f'{msg}\nSender: {sender}')

    return render(request, 'portfolio/index.html')
