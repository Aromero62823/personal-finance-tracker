from django.db import models
from django.conf import settings

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='username',
        on_delete=models.CASCADE
    )
    transaction_type = models.CharField(max_length=20, null=False)
    amount = models.FloatField(null=False)
    date = models.DateField()
    message = models.TextField(max_length=300)