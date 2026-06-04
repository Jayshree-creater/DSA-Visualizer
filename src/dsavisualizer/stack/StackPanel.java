package dsavisualizer.stack;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.Stack;

public class StackPanel extends JPanel {

    private Stack<Integer> stack;
    private int highlightIdx = -1; // which element to highlight
    private String highlightType = ""; // "push" or "pop"

    private JTextField inputField;
    private JButton pushBtn, popBtn, peekBtn, clearBtn;
    private JLabel statusLabel;
    private JTextArea logArea;

    private static final Color BG = new Color(18, 18, 30);
    private static final Color STACK_COLOR = new Color(245, 158, 11);
    private static final Color PUSH_COLOR = new Color(16, 185, 129);
    private static final Color POP_COLOR = new Color(239, 68, 68);
    private static final Color PEEK_COLOR = new Color(99, 102, 241);

    public StackPanel() {
        setBackground(BG);
        setLayout(new BorderLayout(10, 10));
        setBorder(new EmptyBorder(15, 20, 15, 20));
        stack = new Stack<>();

        add(createTopPanel(), BorderLayout.NORTH);
        add(createMainPanel(), BorderLayout.CENTER);
        add(createControlPanel(), BorderLayout.SOUTH);
    }

    private JPanel createTopPanel() {
        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT));
        top.setBackground(BG);

        JLabel title = new JLabel("📚 Stack Visualizer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(STACK_COLOR);
        top.add(title);

        JLabel note = new JLabel("   LIFO — Last In, First Out");
        note.setFont(new Font("Segoe UI", Font.ITALIC, 13));
        note.setForeground(new Color(120, 120, 160));
        top.add(note);

        return top;
    }

    private JPanel createMainPanel() {
        JPanel main = new JPanel(new BorderLayout(15, 0));
        main.setBackground(BG);

        // Stack drawing panel
        JPanel drawPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawStack((Graphics2D) g);
            }
        };
        drawPanel.setBackground(new Color(22, 22, 38));
        drawPanel.setBorder(BorderFactory.createLineBorder(new Color(50, 50, 80), 2));
        main.add(drawPanel, BorderLayout.CENTER);

        // Info + log panel
        JPanel rightPanel = new JPanel(new BorderLayout(0, 10));
        rightPanel.setBackground(BG);
        rightPanel.setPreferredSize(new Dimension(260, 0));

        // Info box
        JPanel infoBox = new JPanel();
        infoBox.setLayout(new BoxLayout(infoBox, BoxLayout.Y_AXIS));
        infoBox.setBackground(new Color(22, 22, 38));
        infoBox.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(STACK_COLOR, 2, true),
            new EmptyBorder(12, 14, 12, 14)
        ));

        JLabel infoTitle = new JLabel("Stack Info");
        infoTitle.setFont(new Font("Segoe UI", Font.BOLD, 15));
        infoTitle.setForeground(STACK_COLOR);
        infoBox.add(infoTitle);
        infoBox.add(Box.createVerticalStrut(8));

        String[] facts = {
            "PUSH → Top pe add karo",
            "POP  → Top se nikalo",
            "PEEK → Top dekho (remove nahi)",
            "LIFO — Last In First Out",
            "Use: Undo, Recursion, Browser back"
        };
        for (String f : facts) {
            JLabel lbl = new JLabel("• " + f);
            lbl.setFont(new Font("Monospaced", Font.PLAIN, 11));
            lbl.setForeground(new Color(160, 160, 210));
            infoBox.add(lbl);
            infoBox.add(Box.createVerticalStrut(4));
        }
        rightPanel.add(infoBox, BorderLayout.NORTH);

        // Log area
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

    private void drawStack(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int panelW = getWidth() - 280;
        int panelH = getHeight() - 160;
        int cellW = 160, cellH = 50;
        int startX = (panelW - cellW) / 2;

        // Draw "BOTTOM" label
        g.setColor(new Color(100, 100, 140));
        g.setFont(new Font("Segoe UI", Font.BOLD, 12));
        g.drawString("▼ BOTTOM", startX + 45, panelH - 15);

        // Draw stack base
        g.setColor(new Color(60, 60, 100));
        g.fillRect(startX - 10, panelH - 30, cellW + 20, 8);

        // Draw left/right walls
        g.setColor(new Color(80, 80, 120));
        g.setStroke(new BasicStroke(3));
        g.drawLine(startX - 10, 30, startX - 10, panelH - 22);
        g.drawLine(startX + cellW + 10, 30, startX + cellW + 10, panelH - 22);

        // Draw each element
        java.util.List<Integer> items = new java.util.ArrayList<>(stack);
        int maxVisible = 8;

        for (int i = 0; i < items.size() && i < maxVisible; i++) {
            int y = panelH - 30 - (i + 1) * (cellH + 4);
            boolean isTop = (i == items.size() - 1);

            Color cellColor = STACK_COLOR;
            if (isTop) {
                if (highlightType.equals("push")) cellColor = PUSH_COLOR;
                else if (highlightType.equals("pop")) cellColor = POP_COLOR;
                else if (highlightType.equals("peek")) cellColor = PEEK_COLOR;
                else cellColor = STACK_COLOR.brighter();
            }

            // Cell gradient
            GradientPaint gp = new GradientPaint(startX, y, cellColor, startX, y + cellH, cellColor.darker());
            g.setPaint(gp);
            g.fillRoundRect(startX, y, cellW, cellH, 10, 10);

            g.setColor(cellColor.brighter());
            g.setStroke(new BasicStroke(2));
            g.drawRoundRect(startX, y, cellW, cellH, 10, 10);

            // Value
            g.setColor(Color.WHITE);
            g.setFont(new Font("Segoe UI", Font.BOLD, 20));
            FontMetrics fm = g.getFontMetrics();
            String val = String.valueOf(items.get(i));
            g.drawString(val, startX + (cellW - fm.stringWidth(val)) / 2, y + 33);

            // TOP label
            if (isTop) {
                g.setColor(cellColor);
                g.setFont(new Font("Segoe UI", Font.BOLD, 12));
                g.drawString("◀ TOP", startX + cellW + 18, y + 32);
            }
        }

        // Empty stack message
        if (stack.isEmpty()) {
            g.setColor(new Color(80, 80, 120));
            g.setFont(new Font("Segoe UI", Font.ITALIC, 16));
            g.drawString("Stack khali hai — PUSH karo!", startX - 30, panelH - 60);
        }

        // Stack size
        g.setColor(new Color(160, 160, 200));
        g.setFont(new Font("Segoe UI", Font.BOLD, 13));
        g.drawString("Size: " + stack.size(), startX, 25);
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
            BorderFactory.createLineBorder(STACK_COLOR, 1),
            new EmptyBorder(5, 8, 5, 8)
        ));
        control.add(inputField);

        pushBtn = makeBtn("⬆ PUSH", PUSH_COLOR);
        pushBtn.addActionListener(e -> doPush());
        control.add(pushBtn);

        popBtn = makeBtn("⬇ POP", POP_COLOR);
        popBtn.addActionListener(e -> doPop());
        control.add(popBtn);

        peekBtn = makeBtn("👁 PEEK", PEEK_COLOR);
        peekBtn.addActionListener(e -> doPeek());
        control.add(peekBtn);

        clearBtn = makeBtn("🗑 CLEAR", new Color(80, 80, 100));
        clearBtn.addActionListener(e -> doClear());
        control.add(clearBtn);

        control.add(Box.createHorizontalStrut(15));

        statusLabel = new JLabel("PUSH karo — koi bhi number!");
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
        btn.setBorder(BorderFactory.createEmptyBorder(8, 16, 8, 16));
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void doPush() {
        String text = inputField.getText().trim();
        if (text.isEmpty()) { statusLabel.setText("⚠️ Value enter karo!"); return; }
        try {
            int val = Integer.parseInt(text);
            if (stack.size() >= 8) { statusLabel.setText("⚠️ Stack full hai! Pehle POP karo."); return; }
            stack.push(val);
            highlightType = "push";
            logArea.append("⬆ PUSH(" + val + ") → Stack size: " + stack.size() + "\n");
            statusLabel.setText("✅ PUSH(" + val + ") — Top pe add ho gaya!");
            inputField.setText("");
            repaint();
            new Timer(800, e -> { highlightType = ""; repaint(); ((Timer)e.getSource()).stop(); }).start();
        } catch (NumberFormatException e) {
            statusLabel.setText("⚠️ Sirf number enter karo!");
        }
    }

    private void doPop() {
        if (stack.isEmpty()) { statusLabel.setText("⚠️ Stack khali hai — POP nahi ho sakta!"); return; }
        highlightType = "pop";
        repaint();
        new Timer(600, e -> {
            int val = stack.pop();
            logArea.append("⬇ POP() → " + val + " nikala | Stack size: " + stack.size() + "\n");
            statusLabel.setText("✅ POP — " + val + " nikal gaya top se!");
            highlightType = "";
            repaint();
            ((Timer)e.getSource()).stop();
        }).start();
    }

    private void doPeek() {
        if (stack.isEmpty()) { statusLabel.setText("⚠️ Stack khali hai!"); return; }
        int val = stack.peek();
        highlightType = "peek";
        logArea.append("👁 PEEK() → Top = " + val + " (removed nahi)\n");
        statusLabel.setText("👁 PEEK — Top element: " + val + " (nahi nikala)");
        repaint();
        new Timer(1000, e -> { highlightType = ""; repaint(); ((Timer)e.getSource()).stop(); }).start();
    }

    private void doClear() {
        stack.clear();
        highlightType = "";
        logArea.append("🗑 CLEAR — Stack khali ho gayi\n");
        statusLabel.setText("Stack clear ho gayi!");
        repaint();
    }
}
