# Secret Santa Game

built this for a coding challenge. its a web app where you upload your company's employee list (csv) and it randomly assigns everyone a secret santa partner.

the tricky part was making sure:
- nobody gets assigned to themselves
- nobody gets the same person they had last year
- everyone gives exactly one gift and receives exactly one

## what i used

- node + express for the backend
- mongodb for storing employees and assignments
- react (vite) for the frontend
- jest for tests

## how it works

you upload a csv with employee names and emails. the app parses it, stores the data, and runs a shuffle-based algorithm to pair everyone up. you can also upload last year's assignments so it avoids repeating the same pairs. once done you can download the results as a new csv.

the algorithm uses fisher-yates shuffle — basically it shuffles the employee list and maps each person to the shuffled position. if someone ends up with themselves or with their previous year match, it reshuffles and tries again. with 15 people it usually works on the first or second try.

## folder structure

secret-santa/
├── server/
│ ├── src/
│ │ ├── config/ # db connection
│ │ ├── models/ # employee + assignment schemas
│ │ ├── services/ # core logic (3 classes)
│ │ │ ├── csvHandler.js # reads csv files
│ │ │ ├── santaEngine.js # the assignment algorithm
│ │ │ └── fileExporter.js # writes output csv
│ │ ├── controllers/ # handles api requests
│ │ ├── routes/ # api endpoints
│ │ └── middleware/ # error handling, file upload
│ ├── tests/ # jest tests
│ ├── uploads/ # uploaded csv files land here
│ └── output/ # generated csv files go here
│
├── client/
│ └── src/
│ ├── components/ # upload box, results table, loader
│ ├── helpers/ # axios api calls
│ └── App.jsx
│
└── README.md


## Architecture & Design

### Modularity

The codebase follows separation of concerns:

- **CSVHandler** (class) - responsible only for reading/parsing CSV files
- **SantaEngine** (class) - contains the core assignment algorithm
- **FileExporter** (class) - handles CSV output generation
- **Controllers** - handle HTTP requests and responses
- **Models** - define database schemas
- **Middleware** - cross-cutting concerns like error handling and file uploads

### Algorithm

The assignment algorithm uses a **Fisher-Yates shuffle** approach:
1. Create a shuffled copy of the employee list (these become receivers)
2. Map each employee (giver) to the corresponding shuffled position (receiver)
3. Validate that no one is assigned to themselves
4. Validate that no assignment matches the previous year
5. If validation fails, reshuffle and retry (up to 100 attempts)

This approach guarantees that each person gives exactly one gift and receives exactly one gift (a valid derangement).

## Prerequisites

- Node.js v16 or higher
- MongoDB (running locally or a cloud instance)
- npm

## Installation & Setup

### 1. Clone the repository

git clone https://github.com/YOUR_USERNAME/secret-santa.git
cd secret-santa