# Web Scraper Pro

A full-stack web application for extracting data from websites with customizable scraping options.

## Features

- **Multiple Scraping Types**: Extract page titles, meta descriptions, links, images, headings, and custom CSS selector-based content
- **Real-time Status Tracking**: Monitor scraping job progress with live updates
- **Job Management**: Cancel long-running jobs and view paginated job history
- **Rate Limiting**: Built-in protection against abuse (1 request per 5 seconds)
- **Export Results**: Download scraped data as JSON files

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Web Scraping**: Cheerio for HTML parsing
- **State Management**: React Query for server state
- **Validation**: Zod for type-safe schemas
- **Containerization**: Docker & Docker Compose

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. **Clone or extract the project**:
   ```bash
   cd WebScrapeExtract
   ```

2. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   ```
   http://localhost:3000
   ```

The application will be fully containerized and ready to use!

## Local Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. **Enter a URL** in the input field (must be HTTP/HTTPS)
2. **Select scraping options**:
   - Page Title & Meta Description
   - Links from the page
   - Images with alt text
   - Headings (H1-H6)
   - Custom CSS selectors
3. **Click "Start Scraping"** to begin the job
4. **Monitor progress** in the status panel
5. **Cancel jobs** if needed using the cancel button
6. **View results** and download as JSON
7. **Browse job history** with pagination

## Deployment Options

### Docker Deployment (Recommended)

The application is containerized and can be deployed to any Docker-compatible platform:

- **DigitalOcean App Platform**
- **Google Cloud Run**
- **AWS App Runner**
- **Railway**
- **Render.com**

### Production Deployment Steps

1. **Build the Docker image**:
   ```bash
   docker build -t webscraper .
   ```

2. **Run in production mode**:
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production webscraper
   ```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and configuration
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared schemas and types
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `docker-compose up` - Run with Docker

## Rate Limiting

The application includes rate limiting to prevent abuse:
- **Limit**: 1 scraping request per 5 seconds per IP address
- **Purpose**: Protect both the application and target websites

## Troubleshooting

### Docker Issues

1. **Port 3000 already in use**:
   ```bash
   docker-compose down
   # Or change port in docker-compose.yml
   ```

2. **Build failures**:
   ```bash
   docker-compose down
   docker-compose up --build --force-recreate
   ```

### Development Issues

1. **Port 5000 already in use**:
   - Kill any processes using port 5000
   - Or modify the port in `server/index.ts`

2. **CORS errors**:
   - The application runs on the same port to avoid CORS issues
   - Ensure you're accessing via the correct localhost URL

3. **Rate limiting errors**:
   - Wait 5 seconds between scraping requests
   - Rate limits reset automatically

4. **Scraping failures**:
   - Ensure target URLs are publicly accessible
   - Some websites may block automated requests
   - Check that URLs use HTTP or HTTPS protocol

## Contributing

To extend functionality:

1. **Add new scraping options** in `shared/schema.ts`
2. **Implement scraping logic** in `server/routes.ts`
3. **Update UI components** in `client/src/components/`
4. **Test with Docker** before deploying

## License

This project is provided as-is for educational and development purposes.