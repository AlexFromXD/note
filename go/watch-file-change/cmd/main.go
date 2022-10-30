package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"watch-file-change/internal"

	"github.com/fsnotify/fsnotify"
)

func main() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	conf := path.Join(wd, "/conf/test.yaml")
	if t, err := internal.ParseYaml(conf); err != nil {
		log.Fatal(err)
	} else {
		t.Print()
	}

	watcher, err := internal.NewWatcher(conf)
	if err != nil {
		log.Fatal(err)
	}

	for {
		select {
		case event, ok := <-watcher.Events:
			// watch just one file update for demo
			if ok && event.Op == fsnotify.Write {
				fmt.Println("---- reload config ----")
				if t, err := internal.ParseYaml(conf); err != nil {
					log.Fatal(err)
				} else {
					t.Print()
				}
			}

		case err, ok := <-watcher.Errors:
			if ok && err != nil {
				fmt.Println(err)
			}
		}

	}

}
