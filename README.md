# 🎯Backend for Frontend (BFF) Pattern using ExpressJS & TypeScript

## 📌 Overview
This repository demonstrates a clean implementation of the Backend for Frontend (BFF) architectural pattern using ExpressJS with TypeScript. The demo simulates two client applications—Web and Mobile—each with tailored backend responses to improve UX and performance. It uses mock data from User and Order modules to orchestrate a dashboard experience suited for each client type. By separating BFF layers for both clients, developers gain flexibility in customizing business logic, response shapes, and interaction workflows.

## ❗ Problem
- Traditional APIs often return verbose data not optimized for specific client experiences.

- Mobile applications suffer performance penalties due to excess payloads or irrelevant fields.

- Reusing one backend across multiple platforms can lead to messy client-side logic and conditional rendering.

- Lack of aggregation logic at the backend forces clients to stitch data themselves, increasing complexity.

- Testing and iterating features rapidly is harder without a mock-driven, client-focused backend structure.

## 📦 Use Case
This demo showcases a dashboard aggregation use case combining data from User Profile and Order Service.

For the Web Client, the dashboard presents a detailed view: user information with preferences, order history with statuses, and metadata for filtering and analysis. It emphasizes completeness and contextual richness to support complex UI components.

For the Mobile Client, the BFF returns a compact summary: basic user info with avatar and subscription plan, alongside minimal order data (ID, status, amount). This minimizes payload size and supports quicker interactions over constrained networks. Each BFF layer applies formatting, filtering, and structuring logic specifically for its target interface—allowing frontends to consume clean, relevant data without additional transformations.

## ✅ Benefits
- Tailors data formatting and structure to match client-specific UI needs.

- Improves response times and reduces payload overhead, especially for Mobile users.

- Separates business logic cleanly between client types, simplifying code maintenance.

- Shields frontend developers from upstream API changes via abstraction.

- Enables better scalability by decoupling request orchestration from service implementations.

## 🚀 Installation

### 🐳 Install Docker Desktop
- Download and install Docker: [Docker Desktop](https://www.docker.com/products/docker-desktop/)


### 💾 Setup Redis Using Docker

```bash
docker pull redis
docker run --name my-redis -d -p 6379:6379 redis
```

#### 📦 Project Setup
- Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-directory>
``` 
- 🧰 Setup `util` Service
    - Move into the util solution and create an .env file:
    ```bash
    NODE_ENV=development

    # Redis
    REDIS_HOST = 127.0.0.1
    #Local Docker
    #DB_HOST=host.docker.internal
    #REDIS_USERNAME = username
    #REDIS_PASSWORD = password
    REDIS_DB = 0
    REDIS_PORT = 6379

    ```
    - Install dependencies:
    ```bash
    npm i
    ```
    - Build the utility package:
    ```bash
    npm run build
    ```
    - Link the package:
    ```bash
    npm link
    ```
- 🌐 Setup `api` Service
    - Move into the api solution and create an .env file:
    ```bash
    NODE_ENV=development
    PORT=3000

    # Logging
    LOG_FORMAT=dev
    LOG_DIR=logs

    # CORS Config
    ORIGIN=*
    CREDENTIALS=true

    # Redis
    REDIS_HOST = 127.0.0.1
    #Local Docker
    #DB_HOST=host.docker.internal
    #REDIS_USERNAME = username
    #REDIS_PASSWORD = password
    REDIS_DB = 0
    REDIS_PORT = 6379

    # Rate Limiter
    RATE_LIMITER=1000
    ```
    - Install dependencies:
    ```bash
    npm i
    ```
    - Link the `util` package:
    ```bash
    npm link <utilurl>
    ```
    - Build the Api service:
    ```bash
    npm run build
    ```
    - Run the API in development mode:
    ```bash
    npm run dev:api
    ```
    - Run the BullMq Consumer Worker
    ```bash
    npm run dev:bullmq
    ```
📌 Note: 
- Execute the following script step by step, ensuring that each service runs in its own separate process
```
npm run dev:api
npm run dev:bullmq
```

- This demo uses [Pipeline Workflow](https://github.com/KishorNaik/Sol_pipeline_workflow_expressJs) provides a structured approach to executing sequential operations, ensuring safe execution flow, error resilience, and efficient logging.

#### Source Code

- Api
    - User Module
        - Contracts
        https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/users/apps/features/v1/getUserById/contracts/index.ts

        - Query and Query Handler
        https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/users/apps/features/v1/getUserById/query/index.ts

        - Query Services
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/tree/main/api/src/modules/domain/users/apps/features/v1/getUserById/query/services

        - Integration Event (Subscribe) [bullmq] 
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/users/apps/features/v1/getUserById/events/subscribe/index.ts
        
        - User.Module.ts
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/users/users.Module.ts 

    - Order Module
        - Contracts
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/orders/apps/features/v1/getOrdersByUserId/contracts/index.ts
        
        - Query and Query Handler
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/orders/apps/features/v1/getOrdersByUserId/query/index.ts
        
        - Query Services
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/tree/main/api/src/modules/domain/orders/apps/features/v1/getOrdersByUserId/query/services
        
        - Integration Event (Subscribe) [bullmq] 
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/orders/apps/features/v1/getOrdersByUserId/events/subscribe/index.ts

        - Order.Module.ts
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/domain/orders/orders.Module.ts

    - Dashboard Module
        - Contracts
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/contracts/index.ts

        - Query and Query Handler
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/query/index.ts

        - Query Services
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/tree/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/query/services
        
        - Endpoints
            - web
                - endpoint
                    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/web/index.ts
                - endpoint services
                    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/web/services/map/index.ts
                - curl
                    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/web/api.http

            - mobile
                - endpoint
                    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/mobile/index.ts
                - endpoint services
                     https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/mobile/services/map/index.ts
                - curl
                    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/apps/features/v1/fetchDashboardData/endpoints/mobile/api.http
        - Dashboard.Module.ts
            https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/bff/dashboards/dashboard.Module.ts

- app.Module.ts
    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/modules/app.Module.ts
    
- Server.ts
    https://github.com/KishorNaik/Backend_For_Frontend_Pattern_ExpressJs_Typescript/blob/main/api/src/server.ts