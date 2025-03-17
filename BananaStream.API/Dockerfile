FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server ./main.go

FROM ubuntu:22.04

WORKDIR /root/

COPY .env .
COPY --from=builder /app/server .

RUN chmod +x ./server

CMD ["./server"]
