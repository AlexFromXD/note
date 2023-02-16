package main

import "fmt"

type Shape interface {
	Area() float64
}

// Rectangle is a `Shape`
type Rectangle struct {
	Width  float64
	Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

// Square is a `Shape`
type Square struct {
	Width float64
}

func (s Square) Area() float64 {
	return s.Width * s.Width
}

func CalculateArea(s Shape) float64 {
	return s.Area()
}

func main() {
	rect := Rectangle{Width: 10, Height: 5}
	fmt.Println("Area of rectangle:", CalculateArea(rect))

	Square := Square{Width: 10}
	fmt.Println("Area of square:", CalculateArea(Square))
}
