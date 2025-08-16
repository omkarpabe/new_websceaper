# Web Scraper Pro

## Overview

Web Scraper Pro is a full-stack web application that allows users to extract data from websites through an intuitive interface. The application provides a React-based frontend for URL input and scraping configuration, with an Express.js backend that handles the web scraping operations using Cheerio. Users can extract various types of content including titles, links, images, headings, and custom CSS selector-based content from any publicly accessible website.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript for type safety and better development experience
- **UI Framework**: Utilizes shadcn/ui components built on Radix UI primitives for accessible, customizable interface components
- **Styling**: Tailwind CSS with CSS custom properties for theming, providing a clean and responsive design system
- **State Management**: React Query (@tanstack/react-query) for server state management and caching of API responses
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management and input validation

### Backend Architecture
- **Express.js Server**: RESTful API built with Express.js and TypeScript for handling scraping requests
- **Web Scraping Engine**: Cheerio library for parsing and extracting data from HTML documents
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Rate Limiting**: Express rate limiter to prevent abuse (1 request per 5 seconds per IP)
- **Input Validation**: Zod schemas for request validation and type safety across the stack

### Data Storage Solutions
- **Current Implementation**: MemStorage class providing in-memory data persistence for development
- **Database Schema**: Drizzle ORM configuration with PostgreSQL schema definitions for users and scraping jobs
- **Future Migration**: Architecture supports easy transition to PostgreSQL with existing schema definitions

### API Structure
- **RESTful Endpoints**: 
  - `GET /api/scraping-jobs` - Retrieve recent scraping jobs
  - `GET /api/scraping-jobs/:id` - Get specific job details
  - `POST /api/scrape` - Create new scraping job with rate limiting
- **Real-time Updates**: Polling-based status updates for job progress tracking
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

### Security and Performance
- **Rate Limiting**: IP-based request throttling to prevent server overload
- **Input Sanitization**: URL validation and CSS selector sanitization
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Boundaries**: Client-side error handling with graceful fallbacks

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for frontend functionality
- **Express.js**: Node.js web framework for backend API server
- **TypeScript**: Type safety across the entire application stack

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

### Data Management
- **React Query**: Server state management and caching (@tanstack/react-query)
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Zod**: Runtime type validation and schema definition

### Web Scraping
- **Cheerio**: Server-side HTML parsing and manipulation library
- **Express Rate Limit**: API rate limiting middleware

### Development Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server

### Database Integration (Prepared)
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **PostgreSQL**: Relational database for persistent data storage
- **Drizzle Kit**: Database migration and schema management tools