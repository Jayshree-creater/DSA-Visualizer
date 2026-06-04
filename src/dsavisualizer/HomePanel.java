package dsavisualizer;

import javax.swing.*;
import java.awt.*;

public class HomePanel extends JPanel {

    public HomePanel(MainFrame frame) {
        setBackground(new Color(18, 18, 30));
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        // Title
        JLabel title = new JLabel("DSA Algorithm Visualizer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 34));
        title.setForeground(new Color(99, 102, 241));
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        add(title, gbc);

        // Subtitle
        JLabel subtitle = new JLabel("Algorithms ko visually samjho — Step by Step Animation");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        subtitle.setForeground(new Color(160, 160, 200));
        gbc.gridy = 1;
        add(subtitle, gbc);

        // Cards panel
        JPanel cards = new JPanel(new GridLayout(1, 4, 15, 0));
        cards.setBackground(new Color(18, 18, 30));
        gbc.gridy = 2; gbc.insets = new Insets(30, 10, 10, 10);
        add(cards, gbc);

        cards.add(createCard("📊", "Sorting", "Bubble, Selection\nInsertion Sort", new Color(99, 102, 241), frame, "SORTING"));
        cards.add(createCard("🔍", "Searching", "Binary Search\nStep by Step", new Color(16, 185, 129), frame, "SEARCHING"));
        cards.add(createCard("📚", "Stack", "Push & Pop\nAnimation", new Color(245, 158, 11), frame, "STACK"));
        cards.add(createCard("🔄", "Queue", "Enqueue & Dequeue\nAnimation", new Color(239, 68, 68), frame, "QUEUE"));

        // Info label
        JLabel info = new JLabel("Made with ❤️ using Core Java & Swing  |  Placement Project");
        info.setFont(new Font("Segoe UI", Font.ITALIC, 13));
        info.setForeground(new Color(100, 100, 140));
        gbc.gridy = 3; gbc.insets = new Insets(30, 10, 10, 10);
        add(info, gbc);
    }

    private JPanel createCard(String emoji, String title, String desc, Color color, MainFrame frame, String panelName) {
        JPanel card = new JPanel();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBackground(new Color(28, 28, 45));
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(color, 2, true),
            BorderFactory.createEmptyBorder(20, 20, 20, 20)
        ));
        card.setCursor(new Cursor(Cursor.HAND_CURSOR));

        JLabel emojiLabel = new JLabel(emoji);
        emojiLabel.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 36));
        emojiLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLabel.setForeground(color);
        titleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel descLabel = new JLabel("<html><center>" + desc.replace("\n", "<br>") + "</center></html>");
        descLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        descLabel.setForeground(new Color(160, 160, 200));
        descLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JButton btn = new JButton("Open →");
        btn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btn.setForeground(Color.WHITE);
        btn.setBackground(color);
        btn.setBorder(BorderFactory.createEmptyBorder(8, 20, 8, 20));
        btn.setFocusPainted(false);
        btn.setAlignmentX(Component.CENTER_ALIGNMENT);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.addActionListener(e -> frame.showPanel(panelName));

        card.add(emojiLabel);
        card.add(Box.createVerticalStrut(10));
        card.add(titleLabel);
        card.add(Box.createVerticalStrut(8));
        card.add(descLabel);
        card.add(Box.createVerticalStrut(15));
        card.add(btn);

        card.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                card.setBackground(new Color(35, 35, 55));
            }
            public void mouseExited(java.awt.event.MouseEvent e) {
                card.setBackground(new Color(28, 28, 45));
            }
        });

        return card;
    }
}
