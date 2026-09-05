from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactRequest


def home(request):
    return render(request, 'index.html')

@csrf_exempt
def contact_submit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'method not allowed'}, status=405)
    data = json.loads(request.body)
    if not data.get('employerName') or not data.get('phone'):
        return JsonResponse({'error': 'فیلدهای اجباری خالی است'}, status=400)
    ContactRequest.objects.create(
        employer_name=data.get('employerName'),
        company_name=data.get('companyName', ''),
        project_desc=data.get('projectDesc', ''),
        phone=data.get('phone'),
        email=data.get('email', ''),
    )
    return JsonResponse({'ok': True})