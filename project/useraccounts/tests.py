from django.test import TestCase
from django.contrib.auth.models import User
from .models import Transaction

# Test Case to test the API in retreiving the income/expense totals
class APITotals(TestCase):
    # Instantiating the process to insert dummy data to test totals returned via API call
    def setUp(self):
        self.user = User.objects.create_user(username='test123', password='123')
        self.client.login(username='test123', password='123')
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='food', recurring=False, date='2026-10-15', amount=30.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=20.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='personal', recurring=False, date='2026-10-15', amount=100.00, message="")

        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=300.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='passive', recurring=False, date='2026-10-15', amount=10.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='portfolio', recurring=True, date='2026-10-15', amount=50.00, message="")

    # Testing if the Expense Total is being returned as the exact calculated amount and the reponse code via API call
    def test_total_expense_api(self):
        response = self.client.get('/api/totalExpense/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['total expense'], 150.00)

    # Testing the Income API to return the exact amount for the total
    def test_total_income_api(self):
        response = self.client.get('/api/totalIncome/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['total income'], 360.00)

# Testing the returned dictionary amounts via the API in regards to the KMeans algorithm's (Small, Medium, Large) cluster values
class KMeansTestCase(TestCase):
    def setUp(self):
        # Setting up multiple transactions that can belong to multiple clusters and every category has at least 3 entries
        self.user = User.objects.create_user(username='test123', password='123')
        self.client.login(username='test123', password='123')
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='food', recurring=False, date='2026-10-15', amount=30.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=10.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=10.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='personal', recurring=False, date='2026-10-15', amount=100.00, message="")

        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=300.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=300.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='passive', recurring=False, date='2026-10-15', amount=10.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='portfolio', recurring=True, date='2026-10-15', amount=50.00, message="")

    # Testing the API's expense dictionaries in relation to the cluster values returned by the KMeans algorithm
    def test_insights_expense_api(self):
        response = self.client.get('/api/fetchTransactionInsights/')
        self.assertEqual(response.status_code, 200)

        # Instantiating these values to reduce variable re-instansiation redundancy
        small = response.json()['small_exp']
        medium = response.json()['medium_exp']
        large = response.json()['large_exp']

        # Rest cases for the small expense
        self.assertEqual(small['size'], 'Small')
        self.assertEqual(small['instances'], 2)
        self.assertEqual(small['amount'], 20.00)
        self.assertEqual(small['center'], [10.00])
        self.assertEqual(small['percent'], 13.33)

        # Test cases for the medium expense
        self.assertEqual(medium['size'], 'Medium')
        self.assertEqual(medium['instances'], 1)
        self.assertEqual(medium['amount'], 30.00)
        self.assertEqual(medium['center'], [30.00])
        self.assertEqual(medium['percent'], 20.00)

        # Test cases for the large expense
        self.assertEqual(large['size'], 'Large')
        self.assertEqual(large['instances'], 1)
        self.assertEqual(large['amount'], 100.00)
        self.assertEqual(large['center'], [100.00])
        self.assertEqual(large['percent'], 66.67)

    # Testing the API's income dictionaries in relation to the cluster values returned by the KMeans algorithm
    def test_insights_income_api(self):
        response = self.client.get('/api/fetchTransactionInsights/')
        self.assertEqual(response.status_code, 200)

        # Instantiating these values to reduce variable re-instansiation redundancy
        small = response.json()['small_inc']
        medium = response.json()['medium_inc']
        large = response.json()['large_inc']

        # Rest cases for the small income
        self.assertEqual(small['size'], 'Small')
        self.assertEqual(small['instances'], 1)
        self.assertEqual(small['amount'], 10.00)
        self.assertEqual(small['center'], [10.00])
        self.assertEqual(small['percent'], 1.52)

        # Test cases for the medium income
        self.assertEqual(medium['size'], 'Medium')
        self.assertEqual(medium['instances'], 1)
        self.assertEqual(medium['amount'], 50.00)
        self.assertEqual(medium['center'], [50.00])
        self.assertEqual(medium['percent'], 7.58)

        # Test cases for the large income
        self.assertEqual(large['size'], 'Large')
        self.assertEqual(large['instances'], 2)
        self.assertEqual(large['amount'], 600.00)
        self.assertEqual(large['center'], [300.00])
        self.assertEqual(large['percent'], 90.91)

class SubWeightTestCase(TestCase):
    # Instantiating the process to insert dummy data to test totals returned via API call
    def setUp(self):
        self.user = User.objects.create_user(username='test123', password='123')
        self.client.login(username='test123', password='123')
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='food', recurring=False, date='2026-10-15', amount=30.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='financial', recurring=False, date='2026-10-15', amount=20.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='expense', subtransaction_type='personal', recurring=False, date='2026-10-15', amount=100.00, message="")

        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='earned', recurring=False, date='2026-10-15', amount=300.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='passive', recurring=False, date='2026-10-15', amount=10.00, message="")
        Transaction.objects.create(user=self.user, transaction_type='income', subtransaction_type='portfolio', recurring=True, date='2026-10-15', amount=50.00, message="")

    def test_subweight_amounts(self):
        response = self.client.get('/api/subWeights/')
        # print(response.json()['subweights'])
        self.assertEqual(response.status_code, 200)
        sub = response.json()['subweights']

        # assertion test cases to match values via their respective categories (will return rounded by 2 decimal points)
        # Income:
        self.assertEqual(sub['earned'][0], 83.33)
        self.assertEqual(sub['passive'][0], 2.78)
        self.assertEqual(sub['portfolio'][0], 13.89)

        # Expense
        self.assertEqual(sub['financial'][0], 13.33)
        self.assertEqual(sub['personal'][0], 66.67)
        self.assertEqual(sub['housing'][0], 0.00)
        self.assertEqual(sub['transportation'][0], 0.00)
        self.assertEqual(sub['food'][0], 20.00)

        # Assertion Test cases to match values in correspondence to the grand total of transactions entered
        # Income:
        self.assertEqual(sub['earned'][1], 58.82)
        self.assertEqual(sub['passive'][1], 1.96)
        self.assertEqual(sub['portfolio'][1], 9.80)

        # Expense
        self.assertEqual(sub['financial'][1], 3.92)
        self.assertEqual(sub['personal'][1], 19.61)
        self.assertEqual(sub['housing'][1], 0.00)
        self.assertEqual(sub['transportation'][1], 0.00)
        self.assertEqual(sub['food'][1], 5.88)
