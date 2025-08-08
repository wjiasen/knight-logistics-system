# Knight Logistics Backend

This is the backend Express.js server for Knight AU's logistics system, integrated with SF Express API.

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Install dependencies:

```
npm install
```

3. Start the server:

```
npm start
```

## API

### POST /api/order/create

Creates a new order in SF Express (sandbox).

Request Body Example:

```json
{
  "orderId": "TEST001",
  "sender": {
    "company": "Knight AU",
    "contact": "John",
    "tel": "0400000000",
    "address": "Suite 310/166 Glebe Point Rd NSW"
  },
  "receiver": {
    "contact": "Li Si",
    "tel": "13800138000",
    "address": "北京市朝阳区三里屯"
  },
  "cargo": [
    { "name": "奶粉", "count": 2 }
  ],
  "weight": 1.5
}
```
