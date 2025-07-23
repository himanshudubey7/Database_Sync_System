

# 📦 Data Sync CLI

A command-line tool to **synchronize data between a local and cloud MongoDB database**, built with Node.js. It supports one-way sync, bidirectional sync with conflict resolution, and helps maintain consistent data across distributed environments.

---

## 🧠 My Approach to the Solution

To solve this problem efficiently, I broke it down into three key parts:

1. **Understanding the Use Case:**
   I started by identifying the core requirement — ensuring that two MongoDB instances (local and cloud) could be kept in sync without data loss or duplication. I also wanted a developer-friendly interface to control sync direction.

2. **Designing the Sync Logic:**
   I implemented three modes:

   * *Local to Cloud*
   * *Cloud to Local*
   * *Bidirectional with Conflict Handling*
     For conflict resolution, I relied on a trusted metadata field — `updatedAt` — which allowed me to compare versions of records and update only the outdated side.

3. **Building a CLI for Usability:**
   To keep the tool simple yet powerful, I used the `inquirer` package to build an interactive CLI. This made the tool more accessible and provided clear feedback on sync actions and record counts.

This step-by-step approach ensured I had a scalable, testable solution that could be extended in the future with features like logging, filtering by collections, or dry-run previews.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/data-sync-cli.git
cd data-sync-cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Update your `db.js` or `.env` file with the correct MongoDB URIs:

```js
const localUri = "mongodb://127.0.0.1:27017";
const cloudUri = "your-cloud-mongodb-uri";
```

---

## 🧪 Seeding Sample Data

Run the seeding script to populate both local and cloud databases with sample data:

```bash
node seed.js
```

This clears existing records and inserts predefined users into both environments.

---

## 🖥️ Usage

```bash
node cli.js
```

You’ll see:

```
==== Data Sync CLI ====
1. Sync Local → Cloud
2. Sync Cloud → Local
3. Sync with Conflict Resolution
0. Exit
```

Choose the operation by entering a number (1, 2, or 3). The tool will connect to both databases, identify differences, and synchronize accordingly.

---

## 🔄 Conflict Resolution Logic

If a record exists in both local and cloud with different `updatedAt` timestamps, the most recent version is retained.

```js
if (local.updatedAt > cloud.updatedAt) {
  // Push local to cloud
} else {
  // Pull cloud to local
}
```

---

---

## 🛠️ Built With

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Inquirer](https://www.npmjs.com/package/inquirer) – for interactive CLI
* [Dotenv](https://www.npmjs.com/package/dotenv) – for environment config (optional)

---

## 📌 Use Cases

* Keeping dev and prod databases in sync
* Merging remote data with local working copies
* Backing up or restoring data across environments

---


## 🧑‍💻 Author

**Himanshu Dubey**
