package main

import "fmt"

func main() {
	sumA := sum(1, 2, 3)
	sumB := sum([]int{1, 2, 3}...)
	fmt.Println(sumA)
	fmt.Println(sumB)
}

func sum(list ...int) int {
	sum := 0
	for _, x := range list {
		sum += x
	}

	return sum
}
