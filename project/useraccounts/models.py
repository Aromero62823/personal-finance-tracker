from django.db import models
from django.conf import settings

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='username',
        on_delete=models.CASCADE
    )
    # added the transaction choices
    transaction_choices = [
        ('income', 'Income'),
        ('expense', 'Expense')
    ]
    
    transaction_type = models.CharField(max_length=7, null=False, choices=transaction_choices, default='income')
    
    amount = models.FloatField(null=False)
    date = models.DateField()
    message = models.TextField(max_length=300)