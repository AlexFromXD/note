package internal

import (
	"fmt"

	"github.com/fsnotify/fsnotify"
)

func NewWatcher(path string) (*fsnotify.Watcher, error) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return nil, err
	}

	go func() {
		err = watcher.Add(path)
		if err != nil {
			fmt.Println("err: ", err)
		}
	}()

	return watcher, nil
}
