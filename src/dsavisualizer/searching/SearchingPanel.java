package dsavisualizer.searching;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.Arrays;

public class SearchingPanel extends JPanel {

    private int[] array;
    private int low, high, mid, target, foundIdx;
    private String state; // "idle", "searching", "found", "notfound"
    private JLabel statusLabel, stepsLabel;
    private JTextField searchField;
    private JButton searchBtn, resetBtn;
    private JTextArea logArea;
    private int stepCount;

    private static final Color BG = new Color(18, 18, 30);
    private static final Color COLOR_LOW = new Color(99, 102, 241);
    private static final Color COLOR_HIGH = new Color(239, 68, 68);
    private static final Color COLOR_MID = new Color(245, 158, 11);
    private static final Color COLOR_FOUND = new Color(16, 185, 129);
    private static final Color COLOR_DEFAULT = new Color(50, 50, 80);

    public SearchingPanel() {
        setBackground(BG);
        setLayout(new BorderLayout(10, 10));
        setBorder(new EmptyBorder(15, 20, 15, 20));

        array = new int[]{2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 89, 95};
        state = "idle";
        low = 0; high = array.length - 1; mid = -1; foundIdx = -1; stepCount = 0;

        add(createTopPanel(), BorderLayout.NORTH);
        add(createMainPanel(), BorderLayout.CENTER);
        add(createControlPanel(), BorderLayout.SOUTH);
    }

    private JPanel createTopPanel() {
        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT));
        top.setBackground(BG);

        JLabel title = new JLabel("🔍 Binary Search Visualizer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(new Color(16, 185, 129));
        top.add(title);

        JLabel note = new JLabel("   (Array sorted hai — Binary Search tabhi kaam karta hai!)");
        note.setFont(new Font("Segoe UI", Font.ITALIC, 13));
        note.setForeground(new Color(120, 120, 160));
        top.add(note);

        return top;
    }

    private JPanel createMainPanel() {
        JPanel main = new JPanel(new BorderLayout(10, 10));
        main.setBackground(BG);

        // Array visualization
        JPanel arrayPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawArray((Graphics2D) g);
            }
        };
        arrayPanel.setBackground(new Color(22, 22, 38));
        arrayPanel.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        arrayPanel.setPreferredSize(new Dimension(0, 220));
        main.add(arrayPanel, BorderLayout.CENTER);

        // Log panel
        logArea = new JTextArea(8, 30);
        logArea.setBackground(new Color(22, 22, 38));
        logArea.setForeground(new Color(160, 200, 160));
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 13));
        logArea.setEditable(false);
        logArea.setText("📋 Search Log:\n─────────────────────\n");
        logArea.setBorder(new EmptyBorder(10, 10, 10, 10));

        JScrollPane scroll = new JScrollPane(logArea);
        scroll.setBackground(new Color(22, 22, 38));
        scroll.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        scroll.setPreferredSize(new Dimension(280, 0));
        main.add(scroll, BorderLayout.EAST);

        return main;
    }

    private void drawArray(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int cellSize = 65;
        int cellHeight = 55;
        int startX = (getWidth() - array.length * cellSize) / 2 - 100;
        int startY = 60;

        // Range indicator bar
        if (!state.equals("idle")) {
            g.setColor(new Color(99, 102, 241, 60));
            g.fillRoundRect(startX + low * cellSize - 3, startY - 8,
                (high - low + 1) * cellSize + 3, cellHeight + 16, 8, 8);
        }

        for (int i = 0; i < array.length; i++) {
            Color cellColor = COLOR_DEFAULT;

            if (state.equals("found") && i == foundIdx) {
                cellColor = COLOR_FOUND;
            } else if (!state.equals("idle")) {
                if (i == mid) cellColor = COLOR_MID;
                else if (i == low) cellColor = COLOR_LOW;
                else if (i == high) cellColor = COLOR_HIGH;
                else if (i >= low && i <= high) cellColor = new Color(60, 60, 100);
                else cellColor = new Color(35, 35, 50);
            }

            int x = startX + i * cellSize;

            // Cell background
            g.setColor(cellColor);
            g.fillRoundRect(x + 3, startY, cellSize - 6, cellHeight, 8, 8);

            // Cell border
            g.setColor(cellColor.brighter());
            g.setStroke(new BasicStroke(2));
            g.drawRoundRect(x + 3, startY, cellSize - 6, cellHeight, 8, 8);

            // Value
            g.setColor(Color.WHITE);
            g.setFont(new Font("Segoe UI", Font.BOLD, 18));
            FontMetrics fm = g.getFontMetrics();
            String val = String.valueOf(array[i]);
            g.drawString(val, x + (cellSize - fm.stringWidth(val)) / 2, startY + 34);

            // Index below
            g.setColor(new Color(120, 120, 160));
            g.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            g.drawString("[" + i + "]", x + (cellSize - 20) / 2, startY + cellHeight + 18);
        }

        // Labels for low, mid, high
        if (!state.equals("idle")) {
            g.setFont(new Font("Segoe UI", Font.BOLD, 12));

            if (low >= 0 && low < array.length) {
                g.setColor(COLOR_LOW);
                g.drawString("LOW", startX + low * cellSize + 15, startY - 15);
            }
            if (high >= 0 && high < array.length) {
                g.setColor(COLOR_HIGH);
                g.drawString("HIGH", startX + high * cellSize + 12, startY - 15);
            }
            if (mid >= 0 && mid < array.length) {
                g.setColor(COLOR_MID);
                g.drawString("MID", startX + mid * cellSize + 18, startY + cellHeight + 35);
            }
        }

        // Legend
        int ly = startY + cellHeight + 55;
        int lx = startX;
        drawLegendItem(g, lx, ly, COLOR_LOW, "LOW pointer");
        drawLegendItem(g, lx + 130, ly, COLOR_MID, "MID element");
        drawLegendItem(g, lx + 260, ly, COLOR_HIGH, "HIGH pointer");
        drawLegendItem(g, lx + 390, ly, COLOR_FOUND, "Found!");
    }

    private void drawLegendItem(Graphics2D g, int x, int y, Color color, String label) {
        g.setColor(color);
        g.fillRoundRect(x, y, 14, 14, 4, 4);
        g.setColor(Color.WHITE);
        g.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        g.drawString(label, x + 18, y + 12);
    }

    private JPanel createControlPanel() {
        JPanel control = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 10));
        control.setBackground(new Color(22, 22, 38));
        control.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 1));

        JLabel searchLabel = new JLabel("Search Value:");
        searchLabel.setForeground(Color.WHITE);
        searchLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        control.add(searchLabel);

        searchField = new JTextField(8);
        searchField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        searchField.setBackground(new Color(40, 40, 60));
        searchField.setForeground(Color.WHITE);
        searchField.setCaretColor(Color.WHITE);
        searchField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(99, 102, 241), 1),
            new EmptyBorder(5, 8, 5, 8)
        ));
        control.add(searchField);

        searchBtn = new JButton("🔍 Search");
        styleButton(searchBtn, new Color(16, 185, 129));
        searchBtn.addActionListener(e -> startSearch());
        control.add(searchBtn);

        resetBtn = new JButton("⟳ Reset");
        styleButton(resetBtn, new Color(239, 68, 68));
        resetBtn.addActionListener(e -> resetSearch());
        control.add(resetBtn);

        control.add(Box.createHorizontalStrut(20));

        statusLabel = new JLabel("Koi bhi number search karo array mein se!");
        statusLabel.setForeground(new Color(160, 160, 200));
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        control.add(statusLabel);

        stepsLabel = new JLabel("Steps: 0");
        stepsLabel.setForeground(new Color(245, 158, 11));
        stepsLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        control.add(stepsLabel);

        return control;
    }

    private void styleButton(JButton btn, Color color) {
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(Color.WHITE);
        btn.setBackground(color);
        btn.setBorder(BorderFactory.createEmptyBorder(8, 18, 8, 18));
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    private void startSearch() {
        String text = searchField.getText().trim();
        if (text.isEmpty()) {
            statusLabel.setText("⚠️ Pehle ek number enter karo!");
            return;
        }
        try {
            target = Integer.parseInt(text);
        } catch (NumberFormatException e) {
            statusLabel.setText("⚠️ Sirf number enter karo!");
            return;
        }

        // Reset state
        state = "searching";
        low = 0; high = array.length - 1; mid = -1; foundIdx = -1; stepCount = 0;
        logArea.setText("📋 Search Log:\n─────────────────────\n");
        logArea.append("🎯 Target: " + target + "\n");
        logArea.append("📦 Array: " + Arrays.toString(array) + "\n\n");
        searchBtn.setEnabled(false);

        new Thread(() -> {
            try {
                binarySearch();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    private void binarySearch() throws InterruptedException {
        while (low <= high) {
            mid = (low + high) / 2;
            stepCount++;

            final int curLow = low, curHigh = high, curMid = mid, curStep = stepCount;
            SwingUtilities.invokeLater(() -> {
                statusLabel.setText("Step " + curStep + ": low=" + curLow + ", high=" + curHigh + ", mid=" + curMid + " (value=" + array[curMid] + ")");
                stepsLabel.setText("Steps: " + curStep);
                logArea.append("Step " + curStep + ": low[" + curLow + "]=" + array[curLow] +
                    ", high[" + curHigh + "]=" + array[curHigh] +
                    ", mid[" + curMid + "]=" + array[curMid] + "\n");
                repaint();
            });

            Thread.sleep(1200);

            if (array[mid] == target) {
                foundIdx = mid;
                state = "found";
                final int fs = stepCount;
                SwingUtilities.invokeLater(() -> {
                    statusLabel.setText("✅ Found " + target + " at index [" + foundIdx + "] in " + fs + " steps!");
                    logArea.append("\n✅ FOUND! Value " + target + " at index [" + foundIdx + "]\n");
                    logArea.append("Total Steps: " + fs + "\n");
                    searchBtn.setEnabled(true);
                    repaint();
                });
                return;
            } else if (array[mid] < target) {
                final int oldLow = low;
                low = mid + 1;
                SwingUtilities.invokeLater(() ->
                    logArea.append("   → " + array[curMid] + " < " + target + ", go RIGHT (low → " + (oldLow + 1) + ")\n"));
            } else {
                high = mid - 1;
                SwingUtilities.invokeLater(() ->
                    logArea.append("   → " + array[curMid] + " > " + target + ", go LEFT (high → " + (curMid - 1) + ")\n"));
            }
        }

        state = "notfound";
        SwingUtilities.invokeLater(() -> {
            statusLabel.setText("❌ " + target + " nahi mila array mein!");
            logArea.append("\n❌ NOT FOUND: " + target + " is not in the array.\n");
            searchBtn.setEnabled(true);
            repaint();
        });
    }

    private void resetSearch() {
        state = "idle";
        low = 0; high = array.length - 1; mid = -1; foundIdx = -1; stepCount = 0;
        searchField.setText("");
        statusLabel.setText("Koi bhi number search karo array mein se!");
        stepsLabel.setText("Steps: 0");
        logArea.setText("📋 Search Log:\n─────────────────────\n");
        searchBtn.setEnabled(true);
        repaint();
    }
}
