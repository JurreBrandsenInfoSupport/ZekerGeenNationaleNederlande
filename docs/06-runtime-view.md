# 6. Runtime View

## 6.1 Key Scenarios

### Scenario: Viewing Claims Dashboard
1. User accesses the system
2. System displays recent claims data from the in-memory storage
3. User can filter or sort claims as needed
4. Visual charts present claim statistics and trends

### Scenario: Adding a New Policy
1. User navigates to policy management
2. User selects customer (existing or creates new)
3. User fills policy details through form interface
4. System validates and stores the new policy in memory
5. Confirmation notification is displayed

### Scenario: Processing a Claim
1. User reviews claim details
2. User updates claim status through interface
3. System records changes to the in-memory data store
4. Dashboard statistics update accordingly

## 6.2 Important Processes

### Data Flow Process
1. User interacts with the UI
2. Client-side logic processes user actions
3. For data requests: API calls retrieve data from in-memory storage
4. For data modification: API calls update the in-memory data store
5. UI updates to reflect the new state

### API Request Flow
1. User action triggers API request
2. Request is routed to appropriate API endpoint (claims, policies, customers)
3. Server processes request, applies business logic
4. Data is retrieved from or written to in-memory storage
5. Response is returned to client
6. UI updates with success/error notification
