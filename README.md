# 🧠 DSA Visualizer

An interactive desktop application that visualizes Data Structure algorithms in real-time using Core Java and Swing.

![Java](https://img.shields.io/badge/Java-17+-orange)
![Swing](https://img.shields.io/badge/UI-Java%20Swing-blue)
![Status](https://img.shields.io/badge/Status-Complete-green)

---

## ✨ Features

- **📊 Sorting** — Bubble Sort, Selection Sort, Insertion Sort with animated bars
- **🔍 Binary Search** — Step-by-step visualization with search log
- **📚 Stack** — Push, Pop, Peek with LIFO animation
- **🔄 Queue** — Enqueue, Dequeue with FIFO animation
- **⚡ Speed Control** — Adjust animation speed with slider
- **🎲 Random Array** — Generate new arrays instantly

---

##  Tech Stack

| Technology | Usage |
|---|---|
| Java 17+ | Core language |
| Java Swing | Desktop UI |
| Graphics2D | Bar & box animations |
| Multithreading | Smooth animations without UI freeze |
| CardLayout | Panel navigation |
| Timer | Stack/Queue animations |

---

##  How to Run

### Prerequisites
- Java JDK 17 or 21 — [Download here](https://www.oracle.com/java/technologies/downloads/)

### Windows
Double-click `run_windows.bat`

### Mac / Linux
```bash
chmod +x run_mac_linux.sh
./run_mac_linux.sh
```

### Manual
```bash
mkdir out
javac -d out src/dsavisualizer/Main.java src/dsavisualizer/MainFrame.java src/dsavisualizer/HomePanel.java src/dsavisualizer/sorting/SortingPanel.java src/dsavisualizer/searching/SearchingPanel.java src/dsavisualizer/stack/StackPanel.java src/dsavisualizer/queue/QueuePanel.java
java -cp out dsavisualizer.Main
```

---

## 📁 Project Structure

```plaintext
DSAVisualizer/
│── src/
│   ├── dsavisualizer/
│   │   ├── Main.java
│   │   ├── MainFrame.java
│   │   ├── HomePanel.java
│   │   ├── sorting/
│   │   │   └── SortingPanel.java
│   │   ├── searching/
│   │   │   └── SearchingPanel.java
│   │   ├── stack/
│   │   │   └── StackPanel.java
│   │   ├── queue/
│   │   │   └── QueuePanel.java
│── out/
│   └── dsavisualizer/   (compiled .class files)
│── screenshots/
│   └── sorting.png
│── run_windows.bat
│── run_mac_linux.sh
│── README.md

