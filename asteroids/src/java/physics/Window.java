package physics;

import java.awt.*;
import javax.swing.*;
import java.awt.event.*;

public class Window extends JFrame implements ActionListener{
	
	private Space s;
	private Timer t;
	
	public Window(int width, int height) {
		s = new Space(width, height);
		t = new Timer(1,this);
		add(s);
		pack();
		setVisible(true);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		t.start();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		s.step();
	}
	
	public static void main(String[] args) {
		Window w = new Window(500, 500);
	}

}
