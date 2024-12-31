.PHONY: install start build test clean docker-build docker-up docker-down docker-logs docker-ps

install:
	corepack enable
	pnpm install

start:
	pnpm start

build:
	pnpm build

test:
	pnpm test

clean:
	rm -rf node_modules
	rm -rf build
	rm -rf pnpm-lock.yaml

# Docker commands
docker-build:
	docker-compose -f deployment/docker-compose.yml build

docker-up:
	docker-compose -f deployment/docker-compose.yml up -d

docker-down:
	docker-compose -f deployment/docker-compose.yml down

docker-logs:
	docker-compose -f deployment/docker-compose.yml logs -f

docker-ps:
	docker-compose -f deployment/docker-compose.yml ps