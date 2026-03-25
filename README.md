# Cloud Computing Group Project: Highly Available F1 Ticket Booking System

## Executive Summary
This repository contains the source code, configuration files, and architectural documentation for a highly available, fault-tolerant web application designed to manage ticket reservations for the Formula 1 2026 season. 

The primary objective of this project is to demonstrate the practical application of core cloud computing principles, specifically focusing on multi-tier application design, horizontal scaling, and managed database services within the Amazon Web Services (AWS) ecosystem.

## 1. Cloud Infrastructure & Architecture
The application shifts away from single-point-of-failure hosting by utilizing a distributed cloud architecture. The deployment environment leverages the following AWS services:

* **Amazon EC2 (Elastic Compute Cloud):** Serves as the primary computing environment. Multiple EC2 instances running an Apache/PHP web server stack are deployed to host the application's business logic and presentation layers.
* **Application Load Balancer (ALB):** Operates at Layer 7 of the OSI model to distribute incoming HTTP traffic intelligently across multiple healthy EC2 instances residing in different Availability Zones. 
* **Auto Scaling Group (ASG):** Provides intrinsic fault tolerance. The ASG is configured with a desired capacity of two instances. It continuously monitors instance health and will automatically provision a replacement instance if an existing server experiences a failure or termination.
* **Amazon RDS (Relational Database Service):** A managed MySQL database instance (`f1db`) utilized for persistent data storage. It separates the database tier from the compute tier, ensuring data integrity even if the web servers are replaced.

## 2. Codebase Structure & Component Analysis
The repository follows a standard three-tier web application architecture (Presentation, Application, and Data layers).

### 2.1 Presentation Layer (Front-End)
* **`f1-frontend.html`**: The primary user interface. It contains the structural markup for the data submission form, the dynamic data display table, and embedded CSS. It also features a programmatic countdown timer calculating the time remaining until the final race of the season.
* **`script.js`**: The client-side logic handler. It executes asynchronous JavaScript (AJAX) via the Fetch API to communicate with the backend without requiring page reloads. It handles form validation, DOM manipulation for the countdown timer, and the dynamic rendering of database records upon window load.
* **Static Assets**: Includes `Background.png` and `f1.jpg` for UI enhancement.

### 2.2 Application / Business Logic Layer (Back-End)
* **`action.php`**: Acts as the centralized API endpoint and request router. It distinguishes between HTTP `POST` requests (for data ingestion) and HTTP `GET` requests (for data retrieval). It processes incoming JSON payloads and enforces data sanitization using `htmlentities()` to mitigate cross-site scripting (XSS) vulnerabilities.
* **`health.html`**: A critical infrastructure integration file. It contains a simple text string utilized exclusively by the AWS Application Load Balancer's Target Group to perform periodic health checks, ensuring traffic is only routed to responsive instances.

### 2.3 Data Access Layer (Database)
* **`db.php`**: Manages the secure connection to the AWS RDS MySQL endpoint. It utilizes the `mysqli` extension to execute queries. Notably, it includes a `verifyContestTable()` function that programmatically checks for the existence of the `BOOKINGS` table and creates the required schema on initialization, preventing application failure on a fresh database deployment.

## 3. Application Data Flow
The lifecycle of a user transaction follows these steps:
1.  **Client Request:** The user accesses the application via the Application Load Balancer's public DNS record.
2.  **Traffic Routing:** The ALB verifies target health via `health.html` and forwards the request to an available EC2 instance.
3.  **Initialization:** Upon loading `f1-frontend.html`, `script.js` immediately triggers a `GET` request to `action.php`.
4.  **Data Retrieval:** `action.php` queries the RDS instance via `db.php`, retrieves all existing booking records as an associative array, and returns them to the client as a JSON response.
5.  **Data Ingestion:** When a user submits a new booking, `script.js` validates the input and sends a `POST` request. The backend sanitizes the inputs and executes an `INSERT` SQL statement to the RDS database.
6.  **State Update:** The database returns a success confirmation, prompting the frontend JavaScript to append the new record directly into the Document Object Model (DOM).

## 4. Assessment Criteria Addressed
* **Fault Tolerance in Design:** Achieved via the Auto Scaling Group, which autonomously replaces terminated instances without manual intervention.
* **High Availability:** Achieved by deploying instances across multiple Availability Zones behind an Application Load Balancer.
* **Front-End Development:** Demonstrated through responsive HTML/CSS and asynchronous JavaScript data handling.
* **Back-End Database Design:** Demonstrated via a normalized relational database structure securely hosted on AWS RDS and accessed via parameterized PHP scripts.
