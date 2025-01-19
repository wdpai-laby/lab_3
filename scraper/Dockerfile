FROM python:3.11.0-slim-buster

# Install system dependencies for Playwright, Chromium, and xvfb
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    libx11-dev \
    libxkbfile-dev \
    libgdk-pixbuf2.0-dev \
    libgtk-3-dev \
    libasound2 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    libgbm-dev \
    libatspi2.0-0 \
    libepoxy0 \
    libvulkan1 \
    libxss1 \
    libxtst6 \
    libgbm1 \
    libnss3-dev \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxdamage1 \
    libnspr4 \
    libxrender1 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Copy the test script
COPY . /scraper 

# Install Playwright and the necessary browsers
RUN pip install -r /scraper/requirements.txt && playwright install chromium
