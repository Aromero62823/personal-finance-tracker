from django.db import models
from django.conf import settings

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='username',
        on_delete=models.CASCADE
    )
    # Identifying Transactions (Income/Expenses)
    transaction_choices = [
        ('income', 'Income'),
        ('expense', 'Expense')
    ]

    # Sub categories that identify income/expense transaction further
    transaction_sub_choices = [
        ('food', 'Food'),
        ('housing', 'housing'),
        ('personal', 'Personal'),
        ('transportation', 'Transportation'),
        ('financial', 'Financial'),
        ('earned', 'Earned'),
        ('portfolio', 'Portfolio'),
        ('passive', 'Passive')
    ]

    # valid ranges for recurring transactions
    date_ranges = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('annually', 'Annually')
    ]
    
    transaction_type = models.CharField(max_length=7, null=False, choices=transaction_choices, default='income')
    subtransaction_type = models.CharField(max_length=14, null=True, choices=transaction_sub_choices)
    recurring = models.BooleanField(blank=False, null=False, default=False)
    recurring_type = models.CharField(max_length=8, null=True, choices=date_ranges)
    amount = models.FloatField(null=False)
    date = models.DateField(null=False)
    message = models.TextField(max_length=300)