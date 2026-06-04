@echo off
echo DSA Visualizer - Compiling...
if not exist "out" mkdir out
javac -d out src\dsavisualizer\Main.java src\dsavisualizer\MainFrame.java src\dsavisualizer\HomePanel.java src\dsavisualizer\sorting\SortingPanel.java src\dsavisualizer\searching\SearchingPanel.java src\dsavisualizer\stack\StackPanel.java src\dsavisualizer\queue\QueuePanel.java
if %errorlevel% neq 0 (
    echo Compilation Failed! Java JDK install karo: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo Compiled! Running...
java -cp out dsavisualizer.Main
pause
