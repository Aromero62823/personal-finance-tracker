# Personal Finance Tracker - Application

Having trouble managing your money? Checks disappearing after unnecessary constant shopping sprees? This application may be for you! Be warned! This is my first application utilizing the skills acquired from the IBM Full Stack Developer Certification Course offered on Coursera.  I hope it may aid in your financial endeavors!

## DEMO LINK:
https://personal-finance-tracker-pi8z.onrender.com/

## What does the app do?
The goal of the application is supposed to display most/all of my skills learned from the IBM Full Stack Developer Course offered by Coursera. The core function of this application is to aid in monitoring your finances, more specifically transactions that identify as either Income or Expense. Expense being what you spent(financial loss), and Income being what you earned(financial gain). User authentication has also been added as you can register/login to the app itself in order to access data pertaining to the logged-in user. The registration process is straight-forward and simple, allowing for quick and easy access! After logging in, you would be redirected to the dashboard, which is also displaying your navigation bar that will redirect you to the transaction, logout, history, or home(default) route. If you are a new user, you would input your financial data(non-sensitive) into the transaction page, after inserting your data, you may edit/update/delete your previous records on this page. After data has been sent to the database(after successfully submitting your first ever financial transaction), the homepage tab should be showing data reflecting your transactions and grouping them by the transaction_type variable  from the Transaction Model, color coding them by red(Expense) and blue(Income). After using the application, you may logout and return to the login page.

## What is the app useful for?
I developed this app with the idea of an application that can aid with people who don't take their financial expenses seriously. The idea was to formulate a much simpler approach by developing an application meant for people who want to track certain expenses to induce healthy habits. How does this simple app do that? You shouldn't go into something new without taking 'small steps'. Developing something new takes initiative, and taking that initiative should be relatively simple and easy. 

For example, maybe you feel like saving money this week, you usually spend on takeout, concerts, going out with friends, etc. You end up spending way more than what you saved! You look at your dashboard and see that you spent 100 dollars more than usual, after deciding you are going to be much more disciplined in your spending, you decide to log this upcoming week reflecting that change. You see that you end up saving money, rather than going overboard as usual. Doing this daily weekly, monthly, maybe even annually could make you into a much more financially responsible person. You could save pennies, dollars, or even hundreds of dollars if you start small!

I think financial stability is an essential step for anyone wanting to become responsibly independent. It's not much but it is a start!

## How to get started
### Setting up the application:
  1. Clone the repository
  2. Navigate to the cloned directory
  3. Activate the virtual environment
  4. Run command in terminal: pip install -r requirements.txt ---> This will install all necessary python packages
  5. Run command: npm install ---> This will install all necessary js packages
  6. cd into the main project/ folder
  7. Run command: python manage.py makemigrations ---> will create the migrations folder to perform migration
  8. Run command: python manage.py migrate ---> will migrate all models and translate them into a SQLite3 database(especially from the app/ directory)
  9. Run command: python manage.py runserver ---> this will start the web server on port 8000 on your local machine
  10. On your preferred web browser, go to: localhost:8000/

### While in the application:
  1. Register if you do not have an account ---> first and last name aren't required but password and username are!
<img width="1491" height="958" alt="registration_page" src="https://github.com/user-attachments/assets/fdfb2ef4-b613-4831-bf07-c24c7640302d" />
  3. Login with credentials
<img width="1587" height="966" alt="login_page" src="https://github.com/user-attachments/assets/58e15e80-ccbe-45be-b6e6-8acd1691d5e4" />
  5. You will notice that the homepage and the history page are empty, enter a transaction to parameterise both pages
<img width="1856" height="866" alt="empty_home" src="https://github.com/user-attachments/assets/9ff3b5f0-d97d-42d8-a295-7f9a0fba1b18" />

### Pages:
  Home: Displays a graph that reflects your total transactions, Empty if no transactions are entered by the user(new user or filtered to a date where no transactions correlate to that date(month/year))
<img width="1855" height="793" alt="home_filled" src="https://github.com/user-attachments/assets/0ce60bde-1716-4cbe-9878-9e1b0a60f711" />

  Add a Transaction: Add a transaction by; specifying type(Income/Expense), Amount, Date of transaction, and an optional message.
<img width="1847" height="811" alt="transaction" src="https://github.com/user-attachments/assets/76d0d1a3-1af0-4767-b880-c95c5be9f72d" />

  History: Where you may edit previous, view total, or delete transactions.
<img width="1851" height="650" alt="history_filled" src="https://github.com/user-attachments/assets/0fd9ed68-27cf-40ee-8346-718feb982332" />
<img width="1858" height="876" alt="history_edit" src="https://github.com/user-attachments/assets/64e018b5-d9dd-4a5b-a6a7-93cb6aa573b9" />

  
## Where to get help and provide feedback
Help/Feedback:
Click on the 'Issues' tab located on the main project page, click on 'feedback' and provide any issues, concerns, or general feedback of this application.

## Who maintains and contributes to this project?
Angel Romero (Myself). I will maintain and contribute to this project as often as I could, please feel free to fork or clone this project to contribute if you would like!
