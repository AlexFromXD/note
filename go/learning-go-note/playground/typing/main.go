package main

import (
	"fmt"
)

// Alias
type IntAlias = int

// cannot define new methods on non-local type int
// func (i *IntAlias) Incre() {}

// Declaration
type MyInt int

func (i *MyInt) Incre() {
	*i = *i + 1
}

func main() {
	var i IntAlias
	var myI MyInt

	i = 1
	myI = 1

	useInt(i) // 1

	// cannot use i2 (variable of type MyInt) as int value in argument to useInt
	// useInt(i2)

	myI.Incre()
	useInt(int(myI)) // 2
}

func useInt(n int) {
	fmt.Println(n)
}
