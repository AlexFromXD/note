package main

import (
	"fmt"
	"net/http"
)

func main() {
	// *** net/http server.go ***
	// ---------------------------------------------------
	// |	type Handler interface {
	// |		ServeHTTP(ResponseWriter, *Request)
	// |	}
	// ---------------------------------------------------
	// *** net/http fs.go ***
	// ---------------------------------------------------
	// |	type filehandler struct {
	// |		root Filesystem
	// |	}
	// |	func (f *filehandler) ServeHTTP(w ResponseWriter, r *Request) {
	// |		 ...
	// |	}
	// |	func FileServer(root Filesystem) Handler {
	// |		 return &filehandler{root}
	// |	}
	// ---------------------------------------------------
	// *** net/http server.go ***
	// ---------------------------------------------------
	// |	func Handle(pattern string, handler Handler) {
	// |		DefaultServeMux.Handle(pattern, handler)
	// |	}
	// ---------------------------------------------------
	http.Handle("/assets", http.FileServer(http.Dir("public")))

	// handler struct is too redundant
	// so we have `HandlerFunc` which creates a bridge between ability to
	// use a function as a handler and the Handler interface.
	// (in golang any type can have methods)
	// *** net/http server.go ***
	// ---------------------------------------------------
	// |	type HandlerFunc func(ResponseWriter, *Request)
	// |	func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	// |		f(w, r)
	// |	}
	// ---------------------------------------------------
	// *** net/http server.go ***
	// ---------------------------------------------------
	// |	func HandleFunc(pattern string, handler func(w ResponseWriter, r *Request)) {
	// |		DefaultServeMux.HandleFunc(pattern, handler)
	// |	}
	// |
	// |	func (mux *ServeMux) HandleFunc(pattern string, handler func(w ResponseWriter, r *Request)) {
	// |		if handler == nil {
	// |				panic("http: nil handler")
	// |		}
	// |		mux.Handle(pattern, HandlerFunc(handler)) -> line#29
	// | }
	// ---------------------------------------------------
	http.Handle("/hello", &HelloHandler{})
	http.HandleFunc("/hello/v2", SayHello)
}

// handler struct is too redundant
type HelloHandler struct{}

func (h *HelloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

// this is much simpler
func SayHello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

// --- my example ---

type A interface {
	Do(string)
}

func useA(a A) {
	a.Do("aaaaa")
}

// struct implement
type AStruct struct{}

func (a AStruct) Do(s string) {
	fmt.Println("print via strut method", s)
}

// function implement
type AFunc func(string)

func (a AFunc) Do(s string) {
	a(s)
}

func example() {
	var aStruct AStruct
	useA(aStruct)

	var aFunc AFunc
	aFunc = func(s string) {
		fmt.Println("print via func", s)
	}
	useA(aFunc)
}
