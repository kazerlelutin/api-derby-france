FROM oven/bun:1 as base
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN mkdir -p data .temp

RUN bun run gen:all

EXPOSE 3000

ENV PORT=3000

CMD ["bun", "run", "start"]
