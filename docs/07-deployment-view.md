# 7. Deployment View

The application is deployed as a web platform accessible through standard browsers.

## 7.1 Infrastructure

- **Frontend**: Deployed as a NextJS application
  - Static assets served from CDN
  - Server-side rendering for dynamic content

- **Backend**: API routes within NextJS
  - RESTful API endpoints for claims, policies, and customers
  - Documented with Swagger/OpenAPI

- **Data Storage**: In-memory JavaScript arrays (simulated database)
  - Note: In a production environment, this would be replaced with a real database

## 7.2 Deployment Process

1. Build NextJS application
2. Deploy static assets to CDN
3. Deploy server components
4. Configure API endpoints
5. Verify system operation

## 7.3 Runtime Requirements

- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Internet connectivity
- No authentication required in the current prototype state
