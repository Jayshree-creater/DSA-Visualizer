package dsavisualizer;

import dsavisualizer.sorting.SortingPanel;
import dsavisualizer.searching.SearchingPanel;
import dsavisualizer.stack.StackPanel;
import dsavisualizer.queue.QueuePanel;

import javax.swing.*;
import java.awt.*;

public class MainFrame extends JFrame {

    private JPanel contentPanel;
    private CardLayout cardLayout;

    public MainFrame() {
        setTitle("DSA Visualizer — Placement Ready Project");
        setSize(950, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // Dark background
        getContentPane().setBackground(new Color(18, 18, 30));
        setLayout(new BorderLayout());

        // Top navigation bar
        JPanel navBar = createNavBar();
        add(navBar, BorderLayout.NORTH);

        // Content area with CardLayout
        cardLayout = new CardLayout();
        contentPanel = new JPanel(cardLayout);
        contentPanel.setBackground(new Color(18, 18, 30));

        // Add all panels
        contentPanel.add(new HomePanel(this), "HOME");
        contentPanel.add(new SortingPanel(), "SORTING");
        contentPanel.add(new SearchingPanel(), "SEARCHING");
        contentPanel.add(new StackPanel(), "STACK");
        contentPanel.add(new QueuePanel(), "QUEUE");

        add(contentPanel, BorderLayout.CENTER);

        showPanel("HOME");
    }

    private JPanel createNavBar() {
        JPanel nav = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 8));
        nav.setBackground(new Color(25, 25, 40));
        nav.setBorder(BorderFactory.createMatteBorder(0, 0, 2, 0, new Color(99, 102, 241)));

        JLabel logo = new JLabel("  🧠 DSA Visualizer");
        logo.setFont(new Font("Segoe UI", Font.BOLD, 18));
        logo.setForeground(new Color(99, 102, 241));
        nav.add(logo);

        nav.add(Box.createHorizontalStrut(30));

        String[] tabs = {"🏠 Home", "📊 Sorting", "🔍 Searching", "📚 Stack", "🔄 Queue"};
        String[] panels = {"HOME", "SORTING", "SEARCHING", "STACK", "QUEUE"};

        for (int i = 0; i < tabs.length; i++) {
            final String panelName = panels[i];
            JButton btn = new JButton(tabs[i]);
            btn.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            btn.setForeground(Color.WHITE);
            btn.setBackground(new Color(40, 40, 60));
            btn.setBorder(BorderFactory.createEmptyBorder(6, 14, 6, 14));
            btn.setFocusPainted(false);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
            btn.addActionListener(e -> showPanel(panelName));
            btn.addMouseListener(new java.awt.event.MouseAdapter() {
                public void mouseEntered(java.awt.event.MouseEvent e) {
                    btn.setBackground(new Color(99, 102, 241));
                }
                public void mouseExited(java.awt.event.MouseEvent e) {
                    btn.setBackground(new Color(40, 40, 60));
                }
            });
            nav.add(btn);
        }

        return nav;
    }

    public void showPanel(String name) {
        cardLayout.show(contentPanel, name);
    }
}
