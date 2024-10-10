<div align="center">
  <img src="https://dalvacationhome.s3.amazonaws.com/public/images/logo-no-background-color.png" alt="DalVacationHome Logo" width=150 height=150>
</div>

# DalVacationHome

DalVacationHome is a serverless web application designed to streamline the booking and management of vacation homes. This project encompasses modules for user management, virtual assistance, message passing, notifications, and data visualization.

<h2 align="center">💻 Tech Stack</h2>
<p align="center">
    <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
    <img alt="Node" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
    <img alt="AWS" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white">
    <img alt="Google Cloud" src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white">
    <img alt="Firebase" src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase">
</p>

## Modules

### User Management & Authentication

This module manages Users of DalVacationHome and ensures secure access to the application using multi-factor authentication. 

**Key components include:**
- **AWS Cognito**: Manages user authentication and user pool creation.
- **AWS Lambda**: Handles security question validation and Caesar cipher authentication.
- **Amazon DynamoDB**: Stores user details and authentication data.

**Features:**
- **Multi-Factor Authentication (MFA):** Combines three layers of authentication—username/password, security questions, and a custom Caesar cipher—for robust access security.

- **Role-Based Access Control:** Differentiates user access (Guest vs. Agent) based on role, enabling protected routes to pages like room management only for authorized roles (Agent).

- **Session Management:** Stores session tokens in HTTPOnly cookies, preventing client-side access and ensuring secure user sessions.

- **API Gateway Integration:** Secures endpoints via AWS API Gateway and Cognito authorizer, validating JWTs to prevent unauthorized access.


### Virtual Assistant

The virtual assistant is powered by Amazon Lex V1 and provides a natural language interface for users. It assists with website navigation, booking information, and customer feedback. 

**Key components include:**
- **Amazon Lex V1**: Manages natural language processing, recognizing user intents for booking inquiries, login guidance, and general help.
- **AWS Lambda**: Executes functions for booking detail retrieval, user validation, and ticket creation.
- **Amazon DynamoDB**: Stores booking details and supports dynamic data retrieval for user inquiries.
- **AWS Cognito**: Ensures secure user validation, preventing unauthorized access to booking information.


**Features:**
- **Intent Recognition:** Configured Amazon Lex bot with intents like BookingDetailsIntent and HowToRegisterIntent to respond accurately to user inquiries about bookings, registration, and general help.

- **Dynamic Booking Detail Retrieval:** Utilizes AWS Lambda to fetch real-time booking details from DynamoDB, confirming user identities via AWS Cognito for secure data handling.

- **Ticketing System:** SAllows users to create support tickets through natural language, enhancing customer service and issue tracking.

- **Custom Chat Window:** Integrated React-based chat component for seamless interaction across the whole application, providing a unified user experience.

### Message Passing

The Message Passing Module enables customers to raise support tickets via Amazon Lex and connects them to property agents using Google Cloud Pub/Sub. Firebase facilitates real-time chat for seamless, ticket-based customer-agent communication.

**Key components include:**

- **Google Cloud Pub/Sub**: Facilitates asynchronous messaging, allowing customers to publish booking-related concerns that are processed and assigned to random property agents.
- **Google Cloud Functions**: Subscribes to Pub/Sub topics, processes messages, and routes them to a randomly selected property agent.
- **Firebase Real-Time Database**: Creates and maintains a real-time chat between customers and assigned agents, enhancing responsiveness and customer support.

**Features:**

- **Asynchronous Messaging with Google Cloud Pub/Sub**:  Ensures efficient, decoupled communication by allowing customers to publish booking concerns based on reference codes, improving system responsiveness.

- **Agent Assignment via Google Cloud Functions**: Processes messages and dynamically assigns each inquiry to a random property agent, optimizing workload distribution.

- **Real-Time Customer-Agent Chat**: Utilizes Firebase Real-Time Database to create instant, live chat connections for active ticket resolutions, enhancing user support and engagement.

**Diagram**
![Message Passing Architecture Diagram](https://dalvacationhome.s3.amazonaws.com/public/images/message-passing-architecture.png)


### Notifications

User notifications for registration, login, and booking confirmations are handled by AWS SNS and AWS SQS. The module sends real-time updates and manages internal application processes efficiently.

**Key components include:**

- **AWS SNS**: Sends email notifications to users upon successful registration, login, and booking status updates, ensuring timely communication.
- **AWS SQS**: Manages booking requests by queuing them for asynchronous processing, enabling efficient and decoupled handling of requests.
- **AWS Lambda**: Processes booking requests from the SQS queue, handling approvals and triggering SNS to notify users of booking confirmations or rejections.

**Features:**

- **Automated User Notifications with AWS SNS**: Delivers real-time updates to users on critical actions, such as registration, login, and booking confirmations or rejections.
- **Asynchronous Booking Request Management via AWS SQS**: Queues booking requests to reduce system dependencies and ensure reliable, decoupled processing.
- **Streamlined Approval Process with AWS Lambda**: Efficiently processes queued booking requests from SQS and triggers SNS notifications, providing users with timely updates and enhancing system efficiency.

### Web Application Building and Deployment

The front-end is built using React and hosted on Google Cloud Run. Deployment is automated using AWS CloudFormation and GCP Cloud Deployment Manager, ensuring a robust and scalable application infrastructure.

## Steps to Run

Follow these steps to set up and run the DalVacationHome project:

### 1. Upload Lambda Functions to S3

- **Navigate to your S3 bucket**: Choose or create an S3 bucket where the Lambda function zip files will be stored.
- **Upload Lambda ZIP files**: Upload all the Lambda function zip files to the `lambda/` directory within the S3 bucket.

    ```bash
    aws s3 cp path/to/auto-confirm-user-v1.zip s3://your-bucket-name/lambda/auto-confirm-user-v1.zip
    aws s3 cp path/to/user-login-email-password-v1.zip s3://your-bucket-name/lambda/user-login-email-password-v1.zip
    aws s3 cp path/to/user-registeration-v1.zip s3://your-bucket-name/lambda/user-registeration-v1.zip
    ```

- **Update Lambda Configuration in CloudFormation**: In the CloudFormation script (`/iac/DalVacationHome-CF.yaml`), update the `CodeUri` property for each Lambda function to point to the S3 keys of the uploaded zip files.

    ```yaml
    Resources:
      MyLambdaFunction:
        Type: 'AWS::Lambda::Function'
        Properties:
          Code:
            S3Bucket: your-bucket-name
            S3Key: s3Key
          ...
    ```

### 2. Create a Role with Necessary Permissions

- **Create the Role**: Create a new IAM Role or use an existing one with the necessary permissions (e.g., `LabRole`).

    ```bash
    aws iam create-role --role-name LabRole --assume-role-policy-document file://trust-policy.json
    ```

- **Attach Policies**: Attach the necessary policies to the Role to allow Lambda functions to execute.

    ```bash
    aws iam attach-role-policy --role-name LabRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    ```

- **Update Role ARN in CloudFormation**: In the CloudFormation script, update the `Role` property for each Lambda function to include the ARN of the created Role.

    ```yaml
    Resources:
      MyLambdaFunction:
        Type: 'AWS::Lambda::Function'
        Properties:
          Role: arn:aws:iam::123456789012:role/LabRole
          ...
    ```

### 3. Run the CloudFormation Script

- **Navigate to the Infrastructure as Code (IaC) directory**:

    ```bash
    cd /iac
    ```

- **Deploy the CloudFormation stack**: Use the AWS CLI to create or update the stack with the provided CloudFormation template.

    ```bash
    aws cloudformation deploy --template-file DalVacationHome-CF.yaml --stack-name DalVacationHomeStack
    ```

- **Monitor the Deployment**: Check the CloudFormation console to monitor the progress and ensure the stack is created successfully.

### 4. Deploy the Frontend application to CloudRun

- **Build a docker image and push it to the Google Artifact Registry**:

    ```bash
    docker build --platform linux/amd64 -t image .
    ```
    ```bash
    docker tag image us-central1-docker.pkg.dev/my-project-99692-428401/my-repo/image
    ```
    ```bash
    docker push us-central1-docker.pkg.dev/my-project-99692-428401/my-repo/image
    ```
- **Deploy the changes to Google CloudRun**:

    ```bash
    gcloud run deploy my-service \
  --image us-central1-docker.pkg.dev/my-project-99692-428401/my-repo/image2 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
    ```

### 5. Create a Firebase Project 

- **Create a default Firestore database.**
- **Create 2 functions - publishMessage and createChat.**
- **Generate WebApps Client for our frontend and get the keys**

### 6. Create a .env file

- **Create an .env file at `frontend/` and add the following keys**
  ```bash
  REACT_APP_FIREBASE_API_KEY={FIREBASE_API_KEY}
  REACT_APP_FIREBASE_AUTH_DOMAIN={FIREBASE_AUTH_DOMAIN}
  REACT_APP_FIREBASE_PROJECT_ID={FIREBASE_PROJECT_ID}
  REACT_APP_FIREBASE_STORAGE_BUCKET={FIREBASE_STORAGE_BUCKET}
  REACT_APP_FIREBASE_SENDER_ID={FIREBASE_SENDER_ID}
  REACT_APP_FIREBASE_APP_ID={FIREBASE_APP_ID}

  REACT_APP_API_APIGATEWAY_URL={API_APIGATEWAY_URL}
  REACT_APP_API_STAGE=prod

  REACT_APP_LEX_REGION={LEX_REGION}
  REACT_APP_LEX_ACCESS_KEY_ID={LEX_ACCESS_KEY_ID}
  REACT_APP_LEX_SECRET_ACCESS_KEY={SECRET_ACCESS_KEY}
  ```


## Project Architecture

![Project Architecture Diagram](https://dalvacationhome.s3.amazonaws.com/public/images/architecture.png)