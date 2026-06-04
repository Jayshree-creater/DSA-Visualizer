#!/bin/bash
echo "DSA Visualizer - Compiling..."
mkdir -p out
javac -d out src/dsavisualizer/Main.java src/dsavisualizer/MainFrame.java src/dsavisualizer/HomePanel.java src/dsavisualizer/sorting/SortingPanel.java src/dsavisualizer/searching/SearchingPanel.java src/dsavisualizer/stack/StackPanel.java src/dsavisualizer/queue/QueuePanel.java
if [ $? -ne 0 ]; then
    echo "Compilation failed! Install JDK first."
    exit 1
fi
echo "Running DSA Visualizer..."
java -cp out dsavisualizer.Main
