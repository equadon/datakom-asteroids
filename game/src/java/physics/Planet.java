package physics;

import java.awt.*;

public class Planet {
	
	private Color c;
	private Vector pos;
	private Vector vel;
	private int r;
	
	public Planet() {
		pos = new Vector(50, 50);
		vel = new Vector(0.5, 0.5);
		r = 5;
		c = new Color((float)Math.random(),
                (float)Math.random(),
                (float)Math.random());
	}
	
	public void move() {
		pos.add(vel);
	}
	
	public void paint(Graphics g) {
		int x = (int) Math.round(pos.getX());
		int y = (int) Math.round(pos.getY());
		
		g.setColor(c);
		g.fillOval(x-r, y-r, 2*r, 2*r);
	}

}
