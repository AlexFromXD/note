# Go Basic

## Go Env

- ### GOROOT

  - where you install `golang`
  - those `standard libraries` are stored in `$(go env GOROOT)/src`

- ### GOPATH

  - store `third-party libraries`

  - struct:
    - /src: source code
    - /bin: binary
    - /pkg: .a (archive libraries)

- ### GO111MODULE

  - Go Modules was introduced at v1.11

  - Go Modules will be enabled automatically if:

    - `pwd` not under `$(go env GOPATH)/src`

    - a `go.mod` in `./` or `../`

  - store `third-party libraries` under `$(go env GOPATH)/pkg/mod`

    > $(go env GOPATH)/pkg/mod/<:repository>/<:pkg_name>/<:pkg_name@version>
