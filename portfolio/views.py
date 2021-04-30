from django.shortcuts import render
import smtplib
import os

EMAIL_ADDRESS = os.environ.get('LEARN_GUITAR_USER')
EMAIL_PASS = os.environ.get('LEARN_GUITAR_PASS')

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