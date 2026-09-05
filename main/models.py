from django.db import models

class ContactRequest(models.Model):
    employer_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=150, blank=True)
    project_desc = models.TextField(blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employer_name} - {self.phone}"