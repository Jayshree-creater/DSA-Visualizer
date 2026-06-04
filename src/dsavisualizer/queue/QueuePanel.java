package dsavisualizer.queue;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.LinkedList;
import java.util.Queue;

public class QueuePanel extends JPanel {

    private Queue<Integer> queue;
    private int highlightFront = -1; // 0=front highlight, -1=none
    private int highlightRear = -1;  // last index highlight
    private String highlightType = "";

    private JTextField inputField;
    private JButton enqueueBtn, dequeueBtn, peekBtn, clearBtn;
    private JLabel statusLabel;
    private JTextArea logArea;

    private static final Color BG = new Color(18, 18, 30);
    private static final Color QUEUE_COLOR = new Color(239, 68, 68);
    private static final Color ENQUEUE_COLOR = new Color(16, 185, 129);
    private static final Color DEQUEUE_COLOR = new Color(239, 68, 68);
    private static final Color PEEK_COLOR = new Color(99, 102, 241);

    public QueuePanel() {
        setBackground(BG);
        setLayout(new BorderLayout(10, 10));
        setBorder(new EmptyBorder(15, 20, 15, 20));
        queue = new LinkedList<>();

        add(createTopPanel(), BorderLayout.NORTH);
        add(createMainPanel(), BorderLayout.CENTER);
        add(createControlPanel(), BorderLayout.SOUTH);
    }

    private JPanel createTopPanel() {
        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT));
        top.setBackground(BG);

        JLabel title = new JLabel("🔄 Queue Visualizer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(QUEUE_COLOR);
        top.add(title);

        JLabel note = new JLabel("   FIFO — First In, First Out");
        note.setFont(new Font("Segoe UI", Font.ITALIC, 13));
        note.setForeground(new Color(120, 120, 160));
        top.add(note);

        return top;
    }

    private JPanel createMainPanel() {
        JPanel main = new JPanel(new BorderLayout(15, 0));
        main.setBackground(BG);

        // Queue drawing panel
        JPanel drawPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawQueue((Graphics2D) g);
            }
        };
        drawPanel.setBackground(new Color(22, 22, 38));
        drawPanel.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        main.add(drawPanel, BorderLayout.CENTER);

        // Right info + log panel
        JPanel rightPanel = new JPanel(new BorderLayout(0, 10));
        rightPanel.setBackground(BG);
        rightPanel.setPreferredSize(new Dimension(260, 0));

        // Info box
        JPanel infoBox = new JPanel();
        infoBox.setLayout(new BoxLayout(infoBox, BoxLayout.Y_AXIS));
        infoBox.setBackground(new Color(22, 22, 38));
        infoBox.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(QUEUE_COLOR, 2, true),
            new EmptyBorder(12, 14, 12, 14)
        ));

        JLabel infoTitle = new JLabel("Queue Info");
        infoTitle.setFont(new Font("Segoe UI", Font.BOLD, 15));
        infoTitle.setForeground(QUEUE_COLOR);
        infoBox.add(infoTitle);
        infoBox.add(Box.createVerticalStrut(8));

        String[] facts = {
            "ENQUEUE → Rear pe add karo",
            "DEQUEUE → Front se nikalo",
            "PEEK → Front dekho (remove nahi)",
            "FIFO — First In First Out",
            "Use: Print queue, BFS, CPU scheduling"
        };
        for (String f : facts) {
            JLabel lbl = new JLabel("• " + f);
            lbl.setFont(new Font("Monospaced", Font.PLAIN, 11));
            lbl.setForeground(new Color(160, 160, 210));
            infoBox.add(lbl);
            infoBox.add(Box.createVerticalStrut(4));
        }
        rightPanel.add(infoBox, BorderLayout.NORTH);

        // Log
        logArea = new JTextArea();
        logArea.setBackground(new Color(22, 22, 38));
        logArea.setForeground(new Color(160, 200, 160));
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        logArea.setEditable(false);
        logArea.setText("📋 Operation Log:\n──────────────────\n");
        logArea.setBorder(new EmptyBorder(8, 8, 8, 8));

        JScrollPane scroll = new JScrollPane(logArea);
        scroll.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        rightPanel.add(scroll, BorderLayout.CENTER);

        main.add(rightPanel, BorderLayout.EAST);
        return main;
    }

    private void drawQueue(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int panelW = getWidth() - 280;
        int panelH = getHeight() - 160;

        int cellW = 72, cellH = 70;
        int maxVisible = 8;
        int totalW = Math.min(queue.size(), maxVisible) * (cellW + 8);
        int startX = (panelW - totalW) / 2;
        int startY = (panelH - cellH) / 2;

        // Arrow directions
        g.setColor(new Color(80, 80, 120));
        g.setFont(new Font("Segoe UI", Font.BOLD, 13));
        if (!queue.isEmpty()) {
            // ENQUEUE arrow on right
            g.setColor(ENQUEUE_COLOR);
            g.drawString("ENQUEUE →", startX + totalW + 10, startY + cellH / 2 + 5);
            // DEQUEUE arrow on left
            g.setColor(DEQUEUE_COLOR);
            g.drawString("← DEQUEUE", startX - 105, startY + cellH / 2 + 5);
        }

        // Draw cells
        java.util.List<Integer> items = new java.util.ArrayList<>(queue);
        for (int i = 0; i < items.size() && i < maxVisible; i++) {
            int x = startX + i * (cellW + 8);
            boolean isFront = (i == 0);
            boolean isRear = (i == items.size() - 1);

            Color cellColor = new Color(80, 80, 130);
            if (isFront && highlightType.equals("dequeue")) cellColor = DEQUEUE_COLOR;
            else if (isFront && highlightType.equals("peek")) cellColor = PEEK_COLOR;
            else if (isRear && highlightType.equals("enqueue")) cellColor = ENQUEUE_COLOR;
            else if (isFront) cellColor = new Color(239, 68, 68, 180);
            else if (isRear) cellColor = new Color(16, 185, 129, 180);
            else cellColor = new Color(70, 70, 110);

            // Cell
            GradientPaint gp = new GradientPaint(x, startY, cellColor, x, startY + cellH, cellColor.darker());
            g.setPaint(gp);
            g.fillRoundRect(x, startY, cellW, cellH, 10, 10);

            g.setColor(cellColor.brighter());
            g.setStroke(new BasicStroke(2));
            g.drawRoundRect(x, startY, cellW, cellH, 10, 10);

            // Value
            g.setColor(Color.WHITE);
            g.setFont(new Font("Segoe UI", Font.BOLD, 22));
            FontMetrics fm = g.getFontMetrics();
            String val = String.valueOf(items.get(i));
            g.drawString(val, x + (cellW - fm.stringWidth(val)) / 2, startY + 44);

            // FRONT / REAR labels
            g.setFont(new Font("Segoe UI", Font.BOLD, 11));
            if (isFront) {
                g.setColor(DEQUEUE_COLOR);
                g.drawString("FRONT", x + (cellW - 38) / 2, startY - 10);
            }
            if (isRear) {
                g.setColor(ENQUEUE_COLOR);
                g.drawString("REAR", x + (cellW - 30) / 2, startY + cellH + 18);
            }

            // Arrow between cells
            if (i < items.size() - 1 && i < maxVisible - 1) {
                g.setColor(new Color(120, 120, 160));
                g.setFont(new Font("Segoe UI", Font.BOLD, 18));
                g.drawString("→", x + cellW + 1, startY + cellH / 2 + 7);
            }
        }

        // Empty message
        if (queue.isEmpty()) {
            g.setColor(new Color(80, 80, 120));
            g.setFont(new Font("Segoe UI", Font.ITALIC, 16));
            String msg = "Queue khali hai — ENQUEUE karo!";
            FontMetrics fm = g.getFontMetrics();
            g.drawString(msg, (panelW - fm.stringWidth(msg)) / 2, panelH / 2);
        }

        // Size info
        g.setColor(new Color(160, 160, 200));
        g.setFont(new Font("Segoe UI", Font.BOLD, 13));
        g.drawString("Size: " + queue.size(), 15, 25);
    }

    private JPanel createControlPanel() {
        JPanel control = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 10));
        control.setBackground(new Color(22, 22, 38));
        control.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 1));

        JLabel inputLabel = new JLabel("Value:");
        inputLabel.setForeground(Color.WHITE);
        inputLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        control.add(inputLabel);

        inputField = new JTextField(7);
        inputField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        inputField.setBackground(new Color(40, 40, 60));
        inputField.setForeground(Color.WHITE);
        inputField.setCaretColor(Color.WHITE);
        inputField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(QUEUE_COLOR, 1),
            new EmptyBorder(5, 8, 5, 8)
        ));
        control.add(inputField);

        enqueueBtn = makeBtn("➡ ENQUEUE", ENQUEUE_COLOR);
        enqueueBtn.addActionListener(e -> doEnqueue());
        control.add(enqueueBtn);

        dequeueBtn = makeBtn("⬅ DEQUEUE", DEQUEUE_COLOR);
        dequeueBtn.addActionListener(e -> doDequeue());
        control.add(dequeueBtn);

        peekBtn = makeBtn("👁 PEEK", PEEK_COLOR);
        peekBtn.addActionListener(e -> doPeek());
        control.add(peekBtn);

        clearBtn = makeBtn("🗑 CLEAR", new Color(80, 80, 100));
        clearBtn.addActionListener(e -> doClear());
        control.add(clearBtn);

        control.add(Box.createHorizontalStrut(15));

        statusLabel = new JLabel("ENQUEUE karo — koi bhi number!");
        statusLabel.setForeground(new Color(160, 160, 200));
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        control.add(statusLabel);

        return control;
    }

    private JButton makeBtn(String text, Color color) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(Color.WHITE);
        btn.setBackground(color);
        btn.setBorder(BorderFactory.createEmptyBorder(8, 14, 8, 14));
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void doEnqueue() {
        String text = inputField.getText().trim();
        if (text.isEmpty()) { statusLabel.setText("⚠️ Value enter karo!"); return; }
        try {
            int val = Integer.parseInt(text);
            if (queue.size() >= 8) { statusLabel.setText("⚠️ Queue full hai! Pehle DEQUEUE karo."); return; }
            queue.offer(val);
            highlightType = "enqueue";
            logArea.append("➡ ENQUEUE(" + val + ") → Rear pe add | Size: " + queue.size() + "\n");
            statusLabel.setText("✅ ENQUEUE(" + val + ") — Rear pe add ho gaya!");
            inputField.setText("");
            repaint();
            new Timer(800, e -> { highlightType = ""; repaint(); ((Timer)e.getSource()).stop(); }).start();
        } catch (NumberFormatException e) {
            statusLabel.setText("⚠️ Sirf number enter karo!");
        }
    }

    private void doDequeue() {
        if (queue.isEmpty()) { statusLabel.setText("⚠️ Queue khali hai!"); return; }
        highlightType = "dequeue";
        repaint();
        new Timer(600, e -> {
            int val = queue.poll();
            logArea.append("⬅ DEQUEUE() → " + val + " nikala (Front) | Size: " + queue.size() + "\n");
            statusLabel.setText("✅ DEQUEUE — " + val + " front se nikal gaya!");
            highlightType = "";
            repaint();
            ((Timer)e.getSource()).stop();
        }).start();
    }

    private void doPeek() {
        if (queue.isEmpty()) { statusLabel.setText("⚠️ Queue khali hai!"); return; }
        int val = queue.peek();
        highlightType = "peek";
        logArea.append("👁 PEEK() → Front = " + val + " (removed nahi)\n");
        statusLabel.setText("👁 PEEK — Front element: " + val + " (nahi nikala)");
        repaint();
        new Timer(1000, e -> { highlightType = ""; repaint(); ((Timer)e.getSource()).stop(); }).start();
    }

    private void doClear() {
        queue.clear();
        highlightType = "";
        logArea.append("🗑 CLEAR — Queue khali ho gayi\n");
        statusLabel.setText("Queue clear ho gayi!");
        repaint();
    }
}
