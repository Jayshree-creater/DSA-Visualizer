# 🧠 DSA Visualizer — Java Swing Project

## Placement-Ready Java Desktop Application

### 📦 Features
- **📊 Sorting Visualizer** — Bubble Sort, Selection Sort, Insertion Sort (animated bars!)
- **🔍 Binary Search** — Step-by-step visualization with log
- **📚 Stack** — Push, Pop, Peek with animation (LIFO)
- **🔄 Queue** — Enqueue, Dequeue, Peek with animation (FIFO)

---

## 🚀 Kaise Run Karein?

### Step 1: Java JDK Install Karo
Download karo: https://www.oracle.com/java/technologies/downloads/
(JDK 17 ya 21 — dono chalega)

### Step 2: Project Run Karo

#### Windows:
```
run_windows.bat pe double-click karo
```

#### Mac / Linux:
```bash
chmod +x run_mac_linux.sh
./run_mac_linux.sh
```

#### Ya manually:
```bash
mkdir out
javac -d out src/dsavisualizer/*.java src/dsavisualizer/**/*.java
java -cp out dsavisualizer.Main
```

---

## 📁 Project Structure
```
DSAVisualizer/
├── src/
│   └── dsavisualizer/
│       ├── Main.java              ← Entry point
│       ├── MainFrame.java         ← Main window + navigation
│       ├── HomePanel.java         ← Home screen
│       ├── sorting/
│       │   └── SortingPanel.java  ← Bubble, Selection, Insertion Sort
│       ├── searching/
│       │   └── SearchingPanel.java ← Binary Search
│       ├── stack/
│       │   └── StackPanel.java    ← Stack operations
│       └── queue/
│           └── QueuePanel.java    ← Queue operations
├── run_windows.bat
├── run_mac_linux.sh
└── README.md
```

---

## 🛠️ Technologies Used
- Java 17+ / 21
- Java Swing (built-in UI)
- Core Java: OOPs, Arrays, Stack, Queue, LinkedList, Threads, Timer
- Event Listeners, Graphics2D, CardLayout

---

## 💼 Interview Mein Kya Bolein?
> "Maine Core Java aur Swing se ek DSA Visualizer desktop application banaya jisme sorting algorithms (Bubble, Selection, Insertion), Binary Search, Stack aur Queue ko animated visual representation ke saath dikhaya. Isme multi-threading use ki animation ke liye aur OOPs concepts jaise inheritance, encapsulation use kiye."

---

## 📸 GitHub Pe Kaise Upload Karein?
```bash
git init
git add .
git commit -m "DSA Visualizer - Java Swing Project"
git remote add origin <your-github-url>
git push -u origin main
```

Made with ❤️ using Core Java & Swing
