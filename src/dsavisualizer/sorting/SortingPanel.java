package dsavisualizer.sorting;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.Random;

public class SortingPanel extends JPanel {

    private int[] array;
    private int[] colorState;
    private static final int BAR_COUNT = 30;
    private Timer timer;
    private boolean isSorting = false;

    private JLabel statusLabel;
    private JLabel stepLabel;
    private JSlider speedSlider;
    private JComboBox<String> algoBox;
    private JButton startBtn, resetBtn, newArrayBtn;

    private int stepCount = 0;
    private SortThread sortThread;

    private static final Color BG = new Color(18, 18, 30);
    private static final Color BAR_DEFAULT = new Color(99, 102, 241);
    private static final Color BAR_COMPARE = new Color(239, 68, 68);
    private static final Color BAR_SORTED = new Color(16, 185, 129);
    private static final Color BAR_MIN = new Color(245, 158, 11);

    public SortingPanel() {
        setBackground(BG);
        setLayout(new BorderLayout(10, 10));
        setBorder(new EmptyBorder(15, 20, 15, 20));
        array = new int[BAR_COUNT];
        colorState = new int[BAR_COUNT];
        generateArray();
        add(createTopPanel(), BorderLayout.NORTH);
        add(createBarPanel(), BorderLayout.CENTER);
        add(createControlPanel(), BorderLayout.SOUTH);
    }

    private JPanel createTopPanel() {
        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 5));
        top.setBackground(BG);
        JLabel title = new JLabel("📊 Sorting Visualizer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(new Color(99, 102, 241));
        top.add(title);
        top.add(Box.createHorizontalStrut(20));
        JLabel algoLabel = new JLabel("Algorithm:");
        algoLabel.setForeground(Color.WHITE);
        algoLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        top.add(algoLabel);
        algoBox = new JComboBox<>(new String[]{"Bubble Sort", "Selection Sort", "Insertion Sort"});
        algoBox.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        algoBox.setBackground(new Color(40, 40, 60));
        algoBox.setForeground(Color.WHITE);
        top.add(algoBox);
        return top;
    }

    private JPanel createBarPanel() {
        JPanel panel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawBars((Graphics2D) g);
            }
        };
        panel.setBackground(new Color(22, 22, 38));
        panel.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        return panel;
    }

    private void drawBars(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        int panelWidth = getWidth() - 40;
        int panelHeight = getHeight() - 180;
        if (panelWidth <= 0 || panelHeight <= 0) return;
        int barWidth = (panelWidth - (BAR_COUNT + 1) * 3) / BAR_COUNT;
        int maxVal = 100;
        for (int i = 0; i < array.length; i++) {
            int barHeight = (int) ((array[i] / (double) maxVal) * (panelHeight - 40));
            int x = 20 + i * (barWidth + 3);
            int y = panelHeight - barHeight;
            Color barColor;
            switch (colorState[i]) {
                case 1: barColor = BAR_COMPARE; break;
                case 2: barColor = BAR_SORTED; break;
                case 3: barColor = BAR_MIN; break;
                default: barColor = BAR_DEFAULT;
            }
            GradientPaint gp = new GradientPaint(x, y, barColor.brighter(), x, y + barHeight, barColor.darker());
            g.setPaint(gp);
            g.fillRoundRect(x, y, barWidth, barHeight, 4, 4);
            if (barWidth > 15) {
                g.setColor(Color.WHITE);
                g.setFont(new Font("Segoe UI", Font.BOLD, 9));
                g.drawString(String.valueOf(array[i]), x + barWidth / 2 - 5, y - 3);
            }
        }
        drawLegend(g, panelHeight + 10);
    }

    private void drawLegend(Graphics2D g, int y) {
        int x = 20;
        drawLegendItem(g, x, y, BAR_DEFAULT, "Normal");
        drawLegendItem(g, x + 100, y, BAR_COMPARE, "Comparing");
        drawLegendItem(g, x + 220, y, BAR_MIN, "Min/Pivot");
        drawLegendItem(g, x + 340, y, BAR_SORTED, "Sorted");
    }

    private void drawLegendItem(Graphics2D g, int x, int y, Color color, String label) {
        g.setColor(color);
        g.fillRoundRect(x, y, 15, 15, 4, 4);
        g.setColor(Color.WHITE);
        g.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        g.drawString(label, x + 20, y + 12);
    }

    private JPanel createControlPanel() {
        JPanel control = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 8));
        control.setBackground(new Color(22, 22, 38));
        control.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(50, 50, 80), 1),
            new EmptyBorder(10, 10, 10, 10)
        ));
        JLabel speedLabel = new JLabel("Speed:");
        speedLabel.setForeground(Color.WHITE);
        speedLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        control.add(speedLabel);
        speedSlider = new JSlider(1, 10, 5);
        speedSlider.setBackground(new Color(22, 22, 38));
        speedSlider.setForeground(Color.WHITE);
        speedSlider.setPreferredSize(new Dimension(120, 30));
        control.add(speedSlider);
        control.add(Box.createHorizontalStrut(10));
        newArrayBtn = createButton("🎲 New Array", new Color(99, 102, 241));
        newArrayBtn.addActionListener(e -> {
            if (!isSorting) { generateArray(); repaint(); stepCount = 0; updateStatus("Ready!"); updateStep(); }
        });
        control.add(newArrayBtn);
        startBtn = createButton("▶ Start", new Color(16, 185, 129));
        startBtn.addActionListener(e -> startSorting());
        control.add(startBtn);
        resetBtn = createButton("⟳ Reset", new Color(239, 68, 68));
        resetBtn.addActionListener(e -> resetSorting());
        control.add(resetBtn);
        control.add(Box.createHorizontalStrut(20));
        statusLabel = new JLabel("Ready! Algorithm choose karo aur Start karo.");
        statusLabel.setForeground(new Color(160, 160, 200));
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        control.add(statusLabel);
        stepLabel = new JLabel("Steps: 0");
        stepLabel.setForeground(new Color(245, 158, 11));
        stepLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        control.add(stepLabel);
        return control;
    }

    private JButton createButton(String text, Color color) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(Color.WHITE);
        btn.setBackground(color);
        btn.setBorder(BorderFactory.createEmptyBorder(8, 18, 8, 18));
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void generateArray() {
        Random rand = new Random();
        for (int i = 0; i < BAR_COUNT; i++) {
            array[i] = rand.nextInt(90) + 10;
            colorState[i] = 0;
        }
    }

    private void startSorting() {
        if (isSorting) return;
        isSorting = true;
        startBtn.setEnabled(false);
        newArrayBtn.setEnabled(false);
        stepCount = 0;
        String algo = (String) algoBox.getSelectedItem();
        sortThread = new SortThread(algo);
        sortThread.start();
    }

    private void resetSorting() {
        if (sortThread != null) sortThread.interrupt();
        isSorting = false;
        startBtn.setEnabled(true);
        newArrayBtn.setEnabled(true);
        generateArray();
        stepCount = 0;
        updateStatus("Reset! New array ready.");
        updateStep();
        repaint();
    }

    private void updateStatus(String msg) {
        SwingUtilities.invokeLater(() -> statusLabel.setText(msg));
    }

    private void updateStep() {
        SwingUtilities.invokeLater(() -> stepLabel.setText("Steps: " + stepCount));
    }

    void doSleep() {
        try {
            int delay = 550 - (speedSlider.getValue() * 50);
            Thread.sleep(Math.max(delay, 50));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void swap(int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        stepCount++;
    }

    class SortThread extends Thread {
        String algo;
        SortThread(String algo) { this.algo = algo; }

        @Override
        public void run() {
            try {
                switch (algo) {
                    case "Bubble Sort": bubbleSort(); break;
                    case "Selection Sort": selectionSort(); break;
                    case "Insertion Sort": insertionSort(); break;
                }
                for (int i = 0; i < array.length; i++) colorState[i] = 2;
                SwingUtilities.invokeLater(() -> repaint());
                updateStatus("✅ Sorting Complete! Steps: " + stepCount);
            } catch (Exception e) {
                // interrupted
            } finally {
                isSorting = false;
                SwingUtilities.invokeLater(() -> {
                    startBtn.setEnabled(true);
                    newArrayBtn.setEnabled(true);
                });
            }
        }

        void bubbleSort() throws InterruptedException {
            updateStatus("Bubble Sort chal raha hai...");
            int n = array.length;
            for (int i = 0; i < n - 1; i++) {
                for (int j = 0; j < n - i - 1; j++) {
                    if (Thread.interrupted()) return;
                    colorState[j] = 1;
                    colorState[j + 1] = 1;
                    updateStatus("Comparing: " + array[j] + " and " + array[j + 1]);
                    updateStep();
                    SwingUtilities.invokeLater(() -> repaint());
                    SortingPanel.this.doSleep();
                    if (array[j] > array[j + 1]) {
                        swap(j, j + 1);
                        updateStep();
                    }
                    colorState[j] = 0;
                    colorState[j + 1] = 0;
                }
                colorState[n - 1 - i] = 2;
            }
            colorState[0] = 2;
        }

        void selectionSort() throws InterruptedException {
            updateStatus("Selection Sort chal raha hai...");
            int n = array.length;
            for (int i = 0; i < n - 1; i++) {
                int minIdx = i;
                colorState[i] = 3;
                for (int j = i + 1; j < n; j++) {
                    if (Thread.interrupted()) return;
                    colorState[j] = 1;
                    updateStatus("Finding minimum... current min: " + array[minIdx]);
                    updateStep();
                    SwingUtilities.invokeLater(() -> repaint());
                    SortingPanel.this.doSleep();
                    if (array[j] < array[minIdx]) {
                        if (minIdx != i) colorState[minIdx] = 0;
                        minIdx = j;
                        colorState[minIdx] = 3;
                    } else {
                        colorState[j] = 0;
                    }
                }
                swap(i, minIdx);
                colorState[i] = 2;
                colorState[minIdx] = 0;
                updateStep();
                SwingUtilities.invokeLater(() -> repaint());
            }
            colorState[n - 1] = 2;
        }

        void insertionSort() throws InterruptedException {
            updateStatus("Insertion Sort chal raha hai...");
            int n = array.length;
            colorState[0] = 2;
            for (int i = 1; i < n; i++) {
                if (Thread.interrupted()) return;
                int key = array[i];
                int j = i - 1;
                colorState[i] = 1;
                updateStatus("Inserting " + key + " at correct position...");
                SwingUtilities.invokeLater(() -> repaint());
                SortingPanel.this.doSleep();
                while (j >= 0 && array[j] > key) {
                    array[j + 1] = array[j];
                    colorState[j + 1] = 1;
                    colorState[j] = 1;
                    j--;
                    stepCount++;
                    updateStep();
                    SwingUtilities.invokeLater(() -> repaint());
                    SortingPanel.this.doSleep();
                }
                array[j + 1] = key;
                for (int k = 0; k <= i; k++) colorState[k] = 2;
                SwingUtilities.invokeLater(() -> repaint());
            }
        }
    }
}