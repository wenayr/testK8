FROM node:20-alpine

RUN npm install -g pnpm@latest
WORKDIR /app

# Копируем только ту самую "выжимку" из первого этапа
## COPY --from=builder /app/out .
# Поскольку контекст от корня, COPY . . скопирует ВСЮ монорепу в этот временный контейнер
COPY . .

# Устанавливаем пакеты из lockfile
RUN pnpm install --frozen-lockfile

EXPOSE 3001

WORKDIR /app/backend
CMD ["pnpm", "dev"]