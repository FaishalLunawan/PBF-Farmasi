FROM golang:1.25-alpine

WORKDIR /

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Tentukan path ke main.go
RUN go build -o main ./cmd

EXPOSE 8080

CMD ["./main"]