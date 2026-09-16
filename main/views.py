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

def robots_txt(request):
    from django.http import HttpResponse
    content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://www.behroozsanat.ir/sitemap.xml\n"
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


def sitemap_xml(request):
    from django.http import HttpResponse
    content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" \
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" \
        "<url><loc>https://www.behroozsanat.ir/</loc></url>" \
        "</urlset>"
    return HttpResponse(content, content_type="application/xml; charset=utf-8")
