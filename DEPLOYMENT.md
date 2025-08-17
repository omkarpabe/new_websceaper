# Local Deployment Guide

## Quick Start

1. **Extract the project** to your preferred directory
2. **Open terminal** in the project root directory
3. **Run the setup commands**:

```bash
# Install all dependencies
npm install

# Start the application
npm run dev
```

4. **Access the application** at: http://localhost:5000

## Detailed Setup

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 8.0.0 or higher (comes with Node.js)
- **RAM**: Minimum 512MB available
- **Storage**: ~200MB for node_modules

### Step-by-Step Installation

#### Windows:

1. **Open Command Prompt or PowerShell**
2. **Navigate to project directory**:
   ```cmd
   cd path\to\webscraper-pro
   ```
3. **Install dependencies**:
   ```cmd
   npm install
   ```
4. **Start the server**:
   ```cmd
   npm run dev
   ```

#### macOS/Linux:

1. **Open Terminal**
2. **Navigate to project directory**:
   ```bash
   cd path/to/webscraper-pro
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the server**:
   ```bash
   npm run dev
   ```

### Verification

After running `npm run dev`, you should see:

```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts
[timestamp] [express] serving on port 5000
```

Open your browser and go to `http://localhost:5000` to access the application.

### Production Build

For production deployment:

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Troubleshooting

#### Port Issues
If port 5000 is busy:
- **Windows**: `netstat -ano | findstr :5000`
- **macOS/Linux**: `lsof -i :5000`
- Kill the process or change the port in `server/index.ts`

#### Permission Issues
- **Windows**: Run as Administrator
- **macOS/Linux**: Use `sudo` if needed for global installs

#### Node.js Issues
- Update Node.js to latest LTS version
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and run `npm install` again

### Configuration

The application works out-of-the-box with default settings:
- **Port**: 5000
- **Rate Limit**: 1 request per 5 seconds
- **Storage**: In-memory (resets on restart)

To customize, create a `.env` file (see `.env.example`).

### Network Access

To access from other devices on your network:

1. **Find your local IP address**:
   - Windows: `ipconfig`
   - macOS/Linux: `ifconfig` or `ip addr`

2. **Update server binding** in `server/index.ts`:
   ```typescript
   app.listen(port, '0.0.0.0', () => {
   ```

3. **Access via**: `http://[your-ip]:5000`

### Security Considerations

- The application is designed for local/development use
- For public deployment, add authentication and HTTPS
- Consider firewall rules if exposing to network
- Rate limiting is enabled by default

### Stopping the Application

- **Ctrl+C** in the terminal where it's running
- The server will gracefully shut down and free the port

### Logs

Application logs appear in the terminal. For persistent logging in production, consider:
- **PM2**: Process manager with logging
- **Winston**: Advanced logging library
- **System logs**: OS-level logging solutions