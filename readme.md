# Sorry, this readme in progress

## Introduction
You can download mvp presentation.
* [Keynote version](/presentation.key).
* [Pdf version](/presentation.pdf).


## Quick start guide

#### 0. Launch the server.
Go to https://github.com/gustarus/exam-server to see details.

#### 1. Clone the project.
```bash
mkdir exam-client
cd exam-client
git clone https://github.com/gustarus/exam-client.git
cd client
```

#### 2. Use needed node version.
```bash
nvm use
```

#### 3. Install dependencies.
```bash
npm i
```

#### 4. Launch the project. Use **one** of following commands.
```bash
# launch development version
npm run start

# launch proxy version with compression
# anybody can access to the app via url with your ip and listening port
npm run proxy
```

#### 5. Open the project page.
```
open http://localhost:8080
```
