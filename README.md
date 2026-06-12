# AutoLedger: Hyperledger Fabric Automotive Dashboard

A premium, multi-organization automotive manufacturing dashboard built on Hyperledger Fabric. This project demonstrates how to manage assets (cars) across three distinct organizations with a modern, high-tech user interface.

## 📂 Directory Structure

For the application to connect to the blockchain, please ensure both your project and `fabric-samples` are placed inside the same root folder (e.g., `KBA-CHF`):

```text
KBA-CHF/
├── fabric-samples/     # Hyperledger Fabric samples and binaries
└── KBA-Automobile/     # This project repository
```
> [!IMPORTANT]
> The application is configured to look for network credentials using relative paths (`../../fabric-samples/`). Placing them inside the same parent directory (`KBA-CHF`) ensures a seamless connection.

## 🚀 Features

- **Multi-Organization Testing**: Switch dynamically between Org 1, Org 2, and Org 3.
- **Full Asset Lifecycle**: Create, Query, and Delete cars on the distributed ledger.
- **LevelDB Compatibility**: Optimized for the default LevelDB state database.
- **Premium UI/UX**: Modern dark mode dashboard with glassmorphism and real-time ledger feedback.

## 🛠️ Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Go](https://golang.org/doc/install) (1.20 or later)
- [Fabric Samples](https://github.com/hyperledger/fabric-samples)
- [JQ](https://stedolan.github.io/jq/)

## 🏗️ Setup Instructions

### 1. Initialize the Network
Start the standard test-network with two organizations and a channel:
```bash
cd ~/fabric-samples/test-network
./network.sh down
./network.sh up createChannel -c autochannel -ca
```

### 2. Add Organization 3
Bring the third organization into the network:
```bash
cd addOrg3
./addOrg3.sh up -c autochannel -ca
```

### 3. Deploy the Chaincode
Deploy the automobile contract to the `autochannel`:
```bash
cd ..
./network.sh deployCC -ccn KBA-Automobile -ccp ../../KBA-Automobile/Chaincode -ccl go -c autochannel
```

## 🏁 Running the Application

### 1. Start the API Server
The Go backend handles communication between the frontend and the Fabric Gateway.
```bash
cd ~/KBA-CHF/KBA-Automobile/Sample App
go run .
```

### 2. Access the Dashboard
Open your browser and go to:
[http://localhost:8080](http://localhost:8080)

## 📖 How to Test

1. **Select Organization**: Use the dropdown at the top to choose which organization identity to use for transactions.
2. **Register Vehicle**: Fill out the form as **Organization 1** to add a new car to the ledger.
3. **Query Ledger**: Enter a Car ID to see its details. This can be done by any organization.
4. **List All Assets**: Click "List All Assets" to view every car registered on the blockchain.
5. **Delete Asset**: While **Organization 1** is selected, a "Delete" option will appear for relevant assets.

## ⚠️ Notes

- **Permissions**: Only Organization 1 has the authority to `CreateCar` and `DeleteCar` as per the chaincode logic.
- **State Database**: This version uses LevelDB. If you switch to CouchDB, you can re-enable advanced features like pagination and complex sorting.
