Assignment 1 - Web Server - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name:** Yik Yu Cheng
- **Student number:** 11709596
- **Application name:** Image Recognition
- **Two line description:** An application that allows users to upload image and the objects in the image will be recognised. The history of uploaded images and results will be shown to users.


Core criteria
------------------------------------------------

### Docker image

- **ECR Repository name:** 11709596-assignment1-frontend, 
11709596-assignment1-backend 
- **Video timestamp:**
- **Relevant files:** 
    - /cab432/Dockerfile
    - /cab432_server/Dockerfile

### Docker image running on EC2

- **EC2 instance ID:** i-018f4563a8f199a65
- **Video timestamp:**

### User login functionality

- **One line description:** A hard-coded list of username and password. JWT is used for login session management.
- **Video timestamp:**
- **Relevant files:** 
    - /cab432_server/routes/user.js
    - /cab432_server/authorize.js

### User dependent functionality

- **One line description:** Uploaded images and generated object prediction result are stored in user-specific directory for users to view.
- **Video timestamp:**
- **Relevant files:**
    - /cab432_server/routes/upload.js 9
    - /cab432_server/routes/prediction_result.js 26
    - /cab432_server/routes/prediction_history.js 16

### Web client

- **One line description:** Single page application with two routes using React
- **Video timestamp:**
- **Relevant files:**
    - /cab432/components/Login.js
    - /cab432/components/Main.js

### REST API

- **One line description:** REST API with endpoints and HTTP methods (GET: getting user info, fetching prediction history; POST: token retrival for login, uploading image to server, uploading prediction result to server).
- **Video timestamp:** 
- **Relevant files:**
    - /cab432/components/Main.js 21
    - /cab432/components/PredictionHistory.js 16
    - /cab432/components/ImageRecognition.js 48 84
    - /cab432/components/Login.js 67

### Two kinds of data

#### First kind

- **One line description:** JSON data of prediction result (predicted object and conprobability)
- **Type:** Structured data without ACID requirements
- **Rationale:** Each indivisual entry links to specific user and image
- **Video timestamp:**
- **Relevant files:**
    - /cab432_server/predictions
    - /cab432_server/routes/prediction_result.js 26
    - /cab432/components/ImageRecognition.js 84

#### Second kind

- **One line description:** Image files
- **Type:** Unstructured
- **Rationale:** Images do not need to be stored in database
- **Video timestamp:**
- **Relevant files:**
  - /cab432_server/uploads
  - /cab432_server/routes/upload.js 9
  - /cab432/components/ImageRecognition.js 41

### CPU intensive task

- **One line description:** Image uploading and object detection
- **Video timestamp:** 
- **Relevant files:**
    - /cab432/components/ImageRecognition.js 41 72

### CPU load testing method

- **One line description:** Manually uploading large-sized image file
- **Video timestamp:** 
- **Relevant files:**
    - /

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** Using middleware for handling JWT authorization
- **Video timestamp:**
- **Relevant files:**
    - /cab432_server/authorize.js


### Use of external API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /


### Extensive web client features

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /


### Sophisticated data visualisations

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /


### Additional kinds of data

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /


### Significant custom processing

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /


### Live progress indication

- **One line description:** Not attempted
- **Video timestamp:** 
- **Relevant files:**
    - /


### Infrastructure as code

- **One line description:** Docker compose is used for building cotainers to link frontend and backend at local test phase and on EC2
- **Video timestamp:** 
- **Relevant files:**
    - /docker-compose.yml
    - /home/ubuntu/docker-compose.yml


### Other

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - /

