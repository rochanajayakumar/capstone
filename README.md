# Capstone Project

This project was implemented using AWS Lambda and Serverless framework with a React frontend. This application allows freelance instructors to add dance classes that they are planning on teaching. 

The project utilizes the following server components: DynamoDb, S3, and SES

After logging in, you can add the list of classes that the instructor is planning on teaching for the week and upload a picture to show where the class is being taught. You can also add your email to get information about the studio. 

Please see CapstoneImages folder for deployment pictures. 

# NOTES ABOUT LIMITATIONS WITH SES EMAIL FEATURE:
## Assumptions: 
 * Be sure to enter email address with valid domain (i.e google, etc). 
## Receiving emails 
 * You must FIRST enter your email address to be VERIFIED 
 * Check spam folder for potential verifiation email 
 * Follow steps in verficiation email to verify your address within SES 
 * CLEAR email address and RETYPE your email address to receive welcome distro email

# Future Improvements 

* Remove the double email login - have it setup so emails are stored in a AWS Database (i.e. Dynamo DB) and use this distro list to send out. Or research other methods to work around this in AWS 
* Update React components with table to enter location, time, instructor of dance class
* Create more pages to showcase studio 
* Send emails for each class as a reminder for instructors 

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```


