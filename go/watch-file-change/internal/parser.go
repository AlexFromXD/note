package internal

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type testConf struct {
	Int  int      `yaml:"int"`
	Str  string   `yaml:"str"`
	List []string `yaml:"list"`
}

func ParseYaml(conf string) (*testConf, error) {
	b, err := os.ReadFile(conf)
	if err != nil {
		return nil, err
	}

	t := &testConf{}
	if err := yaml.Unmarshal(b, t); err != nil {
		return nil, err
	}

	return t, nil
}

func (t *testConf) Print() {
	fmt.Println("int: ", t.Int)
	fmt.Println("str: ", t.Str)
	fmt.Printf("list: %+v\n", t.List)
}
