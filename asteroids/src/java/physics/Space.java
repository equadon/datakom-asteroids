package physics;

import java.awt.*;
import javax.swing.*;

public class Space extends JPanel {
	
	private Planet p;
	
	public Space(int width, int height) {
		p = new Planet();
		this.setPreferredSize(new Dimension(width, height));
		this.setBackground(Color.black);
	}
        
	@Override
	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		p.paint(g);
	}
	
	public void step() {
	       p.move();
	       repaint();
	    }

}
