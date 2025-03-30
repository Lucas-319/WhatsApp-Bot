FROM node:22-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["npm", "start"]

EXPOSE 3000