package physics;

public class Vector {

	private double x, y;
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public Vector(double x, double y) {
		this.x = x;
		this.y = y;
	}
	
	public void add(Vector v) {
		this.x += v.x;
		this.y += v.y;
	}
	
	public void scale(double k) {
		this.x *= k;
		this.y *= k;
	}
	

	@Override
	public String toString() {
		return "Vector [x=" + x + ", y=" + y + "]";
	}
	
	public static void main(String[] args) {
		Vector v1 = new Vector(1, 1);
		Vector v2 = new Vector(2, 3);
		v1.add(v2);
		System.out.println(v1);
	}
	
}
