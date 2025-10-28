FROM golang:1.25-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /webhook

FROM alpine:3.19
COPY --from=build /webhook /webhook
EXPOSE 8443
ENTRYPOINT ["/webhook"]
