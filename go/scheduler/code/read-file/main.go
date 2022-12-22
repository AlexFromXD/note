// 10 Thousand Documents using 8 goroutines with 1 core
// 2.9 GHz Intel 4 Core i7
// Concurrency WITHOUT Parallelism
// -----------------------------------------------------------------------------
// $ GOGC=off go test -cpu 1 -run none -bench . -benchtime 3s
// goos: darwin
// goarch: amd64
// pkg: github.com/ardanlabs/gotraining/topics/go/testing/benchmarks/io-bound
// BenchmarkSequential      	       3	1483458120 ns/op
// BenchmarkConcurrent      	      20	 188941855 ns/op : ~87% Faster
// BenchmarkSequentialAgain 	       2	1502682536 ns/op
// BenchmarkConcurrentAgain 	      20	 184037843 ns/op : ~88% Faster

// 10 Thousand Documents using 8 goroutines with 1 core
// 2.9 GHz Intel 4 Core i7
// Concurrency WITH Parallelism
// -----------------------------------------------------------------------------
// $ GOGC=off go test -run none -bench . -benchtime 3s
// goos: darwin
// goarch: amd64
// pkg: github.com/ardanlabs/gotraining/topics/go/testing/benchmarks/io-bound
// BenchmarkSequential-8        	       3	1490947198 ns/op
// BenchmarkConcurrent-8        	      20	 187382200 ns/op : ~88% Faster
// BenchmarkSequentialAgain-8   	       3	1416126029 ns/op
// BenchmarkConcurrentAgain-8   	      20	 185965460 ns/op : ~87% Faster
package readFile

import (
	"encoding/xml"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

func GenerateList(totalDocs int) []string {
	docs := make([]string, totalDocs)
	for i := 0; i < totalDocs; i++ {
		docs[i] = "test.xml"
	}
	return docs
}

func Read(doc string) ([]item, error) {
	time.Sleep(time.Millisecond) // Simulate blocking disk read.
	var d document
	if err := xml.Unmarshal([]byte(file), &d); err != nil {
		return nil, err
	}
	return d.Channel.Items, nil
}

func Find(topic string, docs []string) int {
	var found int
	for _, doc := range docs {
		items, err := Read(doc)
		if err != nil {
			continue
		}
		for _, item := range items {
			if strings.Contains(item.Description, topic) {
				found++
			}
		}
	}
	return found
}

func FindConcurrent(goroutines int, topic string, docs []string) int {
	var found int64

	ch := make(chan string, len(docs))
	for _, doc := range docs {
		ch <- doc
	}
	close(ch)

	var wg sync.WaitGroup
	wg.Add(goroutines)

	for g := 0; g < goroutines; g++ {
		go func() {
			var lFound int64
			for doc := range ch {
				items, err := Read(doc)
				if err != nil {
					continue
				}
				for _, item := range items {
					if strings.Contains(item.Description, topic) {
						lFound++
					}
				}
			}
			atomic.AddInt64(&found, lFound)
			wg.Done()
		}()
	}

	wg.Wait()

	return int(found)
}

var file = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
<channel>
    <title>Going Go Programming</title>
    <description>Golang : https://github.com/goinggo</description>
    <link>http://www.goinggo.net/</link>
    <item>
        <pubDate>Sun, 15 Mar 2015 15:04:00 +0000</pubDate>
        <title>Object Oriented Programming Mechanics</title>
        <description>Go is an amazing language.</description>
        <link>http://www.goinggo.net/2015/03/object-oriented</link>
    </item>
</channel>
</rss>`

type item struct {
	XMLName     xml.Name `xml:"item"`
	Title       string   `xml:"title"`
	Description string   `xml:"description"`
	Link        string   `xml:"link"`
}

type channel struct {
	XMLName     xml.Name `xml:"channel"`
	Title       string   `xml:"title"`
	Description string   `xml:"description"`
	Link        string   `xml:"link"`
	PubDate     string   `xml:"pubDate"`
	Items       []item   `xml:"item"`
}

type document struct {
	XMLName xml.Name `xml:"rss"`
	Channel channel  `xml:"channel"`
	URI     string
}
