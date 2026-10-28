from django.test import TestCase
from django.contrib.auth.models import User
from .models import Transaction

# Create your tests here.
# Test Case to test the API in retreiving the expenses
class ExpenseTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test123', password='123')
        self.client.login(username='test123', password='123')
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='food', recurring=False, date='2026-10-15', amount=30.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=20.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=10.00, message="")

    def test_total_expense_api(self):
        response = self.client.get('/api/totalExpense/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['total expense'], 50.00)

# Test Case to test the API in retreiving the income
class IncomeTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test123', password='123')
        self.client.login(username='test123', password='123')
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='food', recurring=False, date='2026-10-15', amount=30.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=20.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=10.00, message="")

    def test_total_income_api(self):
        response = self.client.get('/api/totalIncome/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['total income'], 10.0)

