// 10 Million Numbers using 8 goroutines with 1 core
// 2.9 GHz Intel 4 Core i7
// Concurrency WITHOUT Parallelism
// -----------------------------------------------------------------------------
// $ GOGC=off go test -cpu 1 -run none -bench . -benchtime 3s
// goos: darwin
// goarch: amd64
// pkg: github.com/ardanlabs/gotraining/topics/go/testing/benchmarks/cpu-bound
// BenchmarkSequential      	    1000	   5720764 ns/op : ~10% Faster
// BenchmarkConcurrent      	    1000	   6387344 ns/op
// BenchmarkSequentialAgain 	    1000	   5614666 ns/op : ~13% Faster
// BenchmarkConcurrentAgain 	    1000	   6482612 ns/op

package addNumber

import (
	"sync"
	"sync/atomic"
)

func Add(numbers []int) int {
	var v int
	for _, n := range numbers {
		v += n
	}
	return v
}

func AddConcurrent(goroutines int, numbers []int) int {
	var v int64
	totalNumbers := len(numbers)
	lastGoroutine := goroutines - 1
	stride := totalNumbers / goroutines

	var wg sync.WaitGroup
	wg.Add(goroutines)

	for g := 0; g < goroutines; g++ {
		go func(g int) {
			start := g * stride
			end := start + stride
			if g == lastGoroutine {
				end = totalNumbers
			}

			var lv int
			for _, n := range numbers[start:end] {
				lv += n
			}

			atomic.AddInt64(&v, int64(lv))
			wg.Done()
		}(g)
	}

	wg.Wait()

	return int(v)
}
